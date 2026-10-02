"use client";

import { useEffect, useMemo } from "react";
import { Grid } from "@react-three/drei";
import { CanvasTexture } from "three";
import { stations, type V3 } from "@/lib/world";

function makeBlobTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(0,0,0,0.85)");
  grad.addColorStop(0.55, "rgba(0,0,0,0.45)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

/** Soft contact shadow + a hairline ring — grounds a station on the floor. */
function Plinth({ position, radius }: { position: V3; radius: number }) {
  const blob = useMemo(() => makeBlobTexture(), []);
  useEffect(() => () => blob.dispose(), [blob]);
  return (
    <group position={position}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <circleGeometry args={[radius * 1.35, 48]} />
        <meshBasicMaterial map={blob} transparent depthWrite={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.03, 0]}>
        <ringGeometry args={[radius, radius + 0.04, 96]} />
        <meshBasicMaterial color="#3b424f" transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.03, 0]}>
        <ringGeometry args={[radius * 0.82, radius * 0.822, 96]} />
        <meshBasicMaterial color="#3b424f" transparent opacity={0.25} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Dark ground, technical grid and a ring under each station. */
export default function World() {
  const s = stations;
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]}>
        <circleGeometry args={[160, 64]} />
        <meshStandardMaterial color="#0a0b0d" roughness={0.92} metalness={0.1} />
      </mesh>
      <Grid
        position={[0, 0.005, 0]}
        args={[300, 300]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1a1d23"
        sectionSize={5}
        sectionThickness={0.9}
        sectionColor="#2a303a"
        fadeDistance={85}
        fadeStrength={1.8}
        infiniteGrid
      />

      <Plinth position={[0, 0, 0.9]} radius={6.2} />
      <Plinth position={s.phone.position} radius={3.2} />
      <Plinth position={s.backend.position} radius={3.8} />
      <Plinth position={s.systems.position} radius={8.2} />
      <Plinth position={s.pc.position} radius={3.6} />
      <Plinth position={s.laptop.position} radius={6.4} />
    </>
  );
}
