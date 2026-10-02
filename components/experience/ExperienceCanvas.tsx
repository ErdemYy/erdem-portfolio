"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor, useGLTF } from "@react-three/drei";
import { ACESFilmicToneMapping, NoToneMapping } from "three";
import ExperienceScene from "./ExperienceScene";
import LoadProgressBridge from "./LoadProgressBridge";
import { HtmlPortalContext } from "@/components/three/SceneHtml";
import { useExperience } from "@/lib/experience";
import { assetList } from "@/data/assets";

/**
 * The single fixed, fullscreen WebGL canvas.
 * Desktop: composer handles tone mapping + SMAA, MSAA off.
 * Mobile / low power: no composer, native tone mapping + MSAA, lower DPR.
 */
export default function ExperienceCanvas() {
  const lowPower = useExperience((s) => s.mobile || s.coarse);
  const reduced = useExperience((s) => s.reducedMotion);
  const maxDpr = lowPower ? 1.5 : 2;
  // PerformanceMonitor can only ever lower the pixel ratio
  const htmlRoot = useRef<HTMLDivElement>(null);
  const [degraded, setDegraded] = useState(false);
  const dpr = degraded ? 1 : maxDpr;

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
      <Canvas
        key={lowPower ? "lite" : "full"}
        dpr={[1, dpr]}
        camera={{ fov: 36, near: 0.1, far: 260, position: [3.2, 5.8, 15.5] }}
        gl={{
          antialias: lowPower,
          alpha: false,
          stencil: false,
          powerPreference: "high-performance",
          toneMapping: lowPower ? ACESFilmicToneMapping : NoToneMapping,
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) =>
            e.preventDefault(),
          );
        }}
      >
        <PerformanceMonitor
          onDecline={() => setDegraded(true)}
          onIncline={() => setDegraded(false)}
          flipflops={3}
          onFallback={() => setDegraded(true)}
        />
        <HtmlPortalContext.Provider value={htmlRoot}>
          <ExperienceScene lowPower={lowPower} reduced={reduced} />
        </HtmlPortalContext.Provider>
      </Canvas>
      </div>
      {/* DOM layer for drei <Html> (screens + labels) */}
      <div
        ref={htmlRoot}
        className="pointer-events-none absolute inset-0 overflow-hidden"
      />
    </div>
  );
}
