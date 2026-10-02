"use client";

import { useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";

/** Tiny deterministic PRNG so panes look the same on every render. */
function seeded(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

type Props = {
  w: number;
  h: number;
  rows?: number;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  seed?: number;
};

/** A restrained wireframe "interface" — outline, header bar and text rows. */
export default function UIPane({
  w,
  h,
  rows = 4,
  color = "#d9dde6",
  position,
  rotation,
  seed = 1,
}: Props) {
  const outline = useMemo(() => {
    const g = new BufferGeometry();
    const x = w / 2;
    const y = h / 2;
    g.setAttribute(
      "position",
      new Float32BufferAttribute([-x, -y, 0, x, -y, 0, x, y, 0, -x, y, 0], 3),
    );
    return g;
  }, [w, h]);

  const bars = useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: rows }, (_, i) => ({
      width: w * (0.3 + rand() * 0.5),
      y: h / 2 - h * (0.26 + i * (0.5 / Math.max(rows, 1))),
    }));
  }, [rows, w, h, seed]);

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color="#0b0d11" transparent opacity={0.6} depthWrite={false} />
      </mesh>
      <lineLoop geometry={outline}>
        <lineBasicMaterial color={color} transparent opacity={0.55} />
      </lineLoop>
      {/* header */}
      <mesh position={[-w / 2 + w * 0.2, h / 2 - h * 0.08, 0.002]}>
        <planeGeometry args={[w * 0.28, h * 0.035]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      {bars.map((b, i) => (
        <mesh
          key={i}
          position={[-w / 2 + w * 0.08 + b.width / 2, b.y, 0.002]}
        >
          <planeGeometry args={[b.width, h * 0.028]} />
          <meshBasicMaterial color={color} transparent opacity={0.22} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
