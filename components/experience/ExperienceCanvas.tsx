"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor, useGLTF } from "@react-three/drei";
import { ACESFilmicToneMapping, NoToneMapping } from "three";
import ExperienceScene from "./ExperienceScene";
import LoadProgressBridge from "./LoadProgressBridge";
import { HtmlPortalContext } from "@/components/three/SceneHtml";
import { getExperience, setExperience, useExperience } from "@/lib/experience";
import { degradePerf, perfConfig } from "@/lib/performance";
import { assetList } from "@/data/assets";

/** If the canvas cannot be created at all, fall back to the lightweight page. */
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[3D] canvas failed — showing the lightweight version", error);
    document.documentElement.classList.add("no-webgl");
    setExperience({ webgl: false, heroReady: true });
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The single fixed, fullscreen WebGL canvas.
 *
 * Settings that cannot change without recreating the GL context (MSAA, power
 * preference) are taken from the tier at mount. Everything else follows the
 * live tier: if the frame rate drops, PerformanceMonitor steps the tier down
 * (high → medium → low) — dpr, post-processing, particles and lights follow.
 */
export default function ExperienceCanvas() {
  const perf = useExperience((s) => s.perf);
  const reduced = useExperience((s) => s.reducedMotion);
  const cfg = perfConfig[perf];
  // fixed at mount: these cannot change without recreating the GL context
  const [initial] = useState(() => perfConfig[getExperience().perf]);
  const htmlRoot = useRef<HTMLDivElement>(null);

  // Shader compilation + model upload make the first seconds jumpy on ANY
  // device. Judge the frame rate only after things have settled.
  const bornAt = useRef(0);
  useEffect(() => {
    bornAt.current = performance.now();
  }, []);
  const stepDown = () => {
    if (performance.now() - bornAt.current < 8000) return;
    degradePerf();
  };

  // expose the live tier (CSS / tests)
  useEffect(() => {
    document.documentElement.dataset.perf = perf;
  }, [perf]);

  // drop cached GLTFs when the canvas goes away (route change / unmount)
  useEffect(
    () => () => {
      assetList.forEach((a) => useGLTF.clear(a.path));
    },
    [],
  );

  return (
    <div className="fixed inset-0 z-0">
      <LoadProgressBridge />
      <div className="absolute inset-0" aria-hidden="true">
        <CanvasBoundary>
          <Canvas
            dpr={[1, cfg.dprMax]}
            camera={{ fov: 36, near: 0.1, far: 260, position: [3.2, 5.8, 15.5] }}
            gl={{
              antialias: initial.antialias,
              alpha: false,
              stencil: false,
              powerPreference: initial.powerPreference,
              toneMapping: initial.composer ? NoToneMapping : ACESFilmicToneMapping,
            }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
            }}
          >
            <PerformanceMonitor
              onDecline={stepDown}
              onFallback={stepDown}
              flipflops={2}
            />
            <HtmlPortalContext.Provider value={htmlRoot}>
              <ExperienceScene reduced={reduced} />
            </HtmlPortalContext.Provider>
          </Canvas>
        </CanvasBoundary>
      </div>
      {/* DOM layer for drei <Html> (screens + labels) */}
      <div ref={htmlRoot} className="pointer-events-none absolute inset-0 overflow-hidden" />
    </div>
  );
}
