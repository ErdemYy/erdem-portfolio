"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { perfConfig } from "@/lib/performance";
import { useExperience } from "@/lib/experience";

/**
 * Procedural studio reflections — no HDR download needed.
 * Baked once (frames = 1); strength is driven by scene.environmentIntensity.
 */
export default function WorldEnvironment() {
  const resolution = perfConfig[useExperience((s) => s.perf)].envResolution;
  return (
    <Environment resolution={resolution} frames={1} background={false}>
      {/* big soft top box */}
      <Lightformer form="rect" intensity={2.4} color="#fff3e6" position={[0, 9, 2]} rotation-x={Math.PI / 2} scale={[16, 10, 1]} />
      {/* side strips */}
      <Lightformer form="rect" intensity={1.6} color="#cfd8ea" position={[-9, 3, 4]} rotation-y={Math.PI / 2} scale={[10, 3, 1]} />
      <Lightformer form="rect" intensity={1.1} color="#ffd9c4" position={[9, 2, -3]} rotation-y={-Math.PI / 2} scale={[8, 2.4, 1]} />
      {/* back kicker */}
      <Lightformer form="ring" intensity={1.4} color="#ffffff" position={[0, 4, -10]} scale={6} />
    </Environment>
  );
}
