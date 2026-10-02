"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import UIPane from "./UIPane";
import { poseWeight, setGroupOpacity } from "@/lib/three-utils";

const layers = [
  { z: -0.9, s: 1.0, rot: 0.0 },
  { z: -1.7, s: 1.12, rot: 0.06 },
  { z: -2.5, s: 1.24, rot: 0.12 },
  { z: -3.3, s: 1.36, rot: 0.18 },
];

/** MOBILE: stacked interface layers that fan out behind the phone. */
export default function MobileLayers() {
  const group = useRef<Group>(null);
  const kids = useRef<(Group | null)[]>([]);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const w = poseWeight("mobile");
    setGroupOpacity(g, w);
    kids.current.forEach((k, i) => {
      if (!k) return;
      k.position.z = layers[i].z * (0.4 + 0.6 * w);
      k.position.x = layers[i].rot * 3 * w;
      k.rotation.y = layers[i].rot * w;
    });
  });

  return (
    <group ref={group} visible={false}>
      {layers.map((l, i) => (
        <group
          key={i}
          ref={(el) => {
            kids.current[i] = el;
          }}
        >
          <UIPane
            w={2.1 * l.s}
            h={3.75 * l.s}
            rows={5}
            color="#9cb6ff"
            seed={i + 11}
          />
        </group>
      ))}
    </group>
  );
}
