"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, type Points } from "three";
import { frame, getExperience } from "@/lib/experience";

let dotTexture: CanvasTexture | null = null;
function getDot() {
  if (dotTexture) return dotTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.35)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  dotTexture = new CanvasTexture(c);
  return dotTexture;
}

/** Sparse floating dust — depth cue, never a feature. */
export default function ParticleField({ count }: { count: number }) {
  const ref = useRef<Points>(null);

  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    // seeded so SSR/CSR and re-mounts agree
    let s = 1337;
    const rand = () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
    for (let i = 0; i < count; i++) {
      a[i * 3] = -34 + rand() * 80;
      a[i * 3 + 1] = 0.4 + rand() * 24;
      a[i * 3 + 2] = -50 + rand() * 74;
    }
    return a;
  }, [count]);

  useFrame((_, dt) => {
    const p = ref.current;
    if (!p) return;
    if (getExperience().reducedMotion) return;
    p.rotation.y += Math.min(dt, 0.05) * 0.006;
    p.position.y = Math.sin(performance.now() * 0.00008) * 0.4;
    const m = p.material as import("three").PointsMaterial;
    m.opacity = (0.28 + 0.22 * Math.sin(frame.progress * Math.PI)) * frame.intro;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={getDot()}
        size={0.18}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        color="#cdd5e4"
      />
    </points>
  );
}
