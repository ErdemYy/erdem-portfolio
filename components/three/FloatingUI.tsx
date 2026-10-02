"use client";

import { useRef } from "react";
import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import UIPane from "./UIPane";
import { poseWeight, setGroupOpacity } from "@/lib/three-utils";
import { getExperience } from "@/lib/experience";

const panes = [
  { p: [-3.6, 4.4, -1.4], r: [0, 0.32, 0], w: 1.9, h: 1.25, rows: 4 },
  { p: [3.7, 4.9, -1.6], r: [0, -0.36, 0], w: 1.7, h: 1.1, rows: 3 },
  { p: [-1.9, 6.1, -2.0], r: [0.08, 0.16, 0], w: 1.4, h: 0.8, rows: 2 },
  { p: [2.5, 6.0, -2.3], r: [0.05, -0.2, 0], w: 1.2, h: 0.75, rows: 2 },
  { p: [-4.3, 2.9, -0.2], r: [0, 0.45, 0], w: 1.0, h: 1.4, rows: 5 },
] as const;

/** WEB: floating UI components orbiting the desk. */
export default function FloatingUI() {
  const group = useRef<Group>(null);
  const reduced = getExperience().reducedMotion;

  useFrame(() => {
    if (group.current) setGroupOpacity(group.current, poseWeight("web"));
  });

  return (
    <group ref={group} visible={false}>
      {panes.map((pane, i) => (
        <Float
          key={i}
          speed={reduced ? 0 : 1.1 + i * 0.12}
          floatIntensity={reduced ? 0 : 0.7}
          rotationIntensity={reduced ? 0 : 0.18}
          position={[...pane.p]}
        >
          <UIPane
            w={pane.w}
            h={pane.h}
            rows={pane.rows}
            rotation={[...pane.r]}
            seed={i + 2}
          />
        </Float>
      ))}
    </group>
  );
}
