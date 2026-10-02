"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Vector3,
  type Group,
  type InstancedMesh,
  Object3D,
} from "three";
import { getExperience } from "@/lib/experience";

type Props = {
  nodes: [number, number, number][];
  edges: [number, number][];
  color?: string;
  nodeSize?: number;
  /** nodes that should render larger (indices → scale) */
  emphasis?: Record<number, number>;
  /** travelling light pulses along the edges */
  pulses?: boolean;
  opacity?: number;
};

const dummy = new Object3D();
const a = new Vector3();
const b = new Vector3();

/**
 * Generic node/edge graph: instanced nodes, one LineSegments draw call and
 * optional pulses travelling along the edges. Used by the request-flow, the
 * systems mesh and the technology constellation.
 */
export default function NetworkLines({
  nodes,
  edges,
  color = "#4f8cff",
  nodeSize = 0.09,
  emphasis,
  pulses = true,
  opacity = 0.55,
}: Props) {
  const group = useRef<Group>(null);
  const nodeMesh = useRef<InstancedMesh>(null);
  const pulseMesh = useRef<InstancedMesh>(null);

  const lineGeo = useMemo(() => {
    const g = new BufferGeometry();
    const pts: number[] = [];
    for (const [i, j] of edges) {
      pts.push(...nodes[i], ...nodes[j]);
    }
    g.setAttribute("position", new Float32BufferAttribute(pts, 3));
    return g;
  }, [nodes, edges]);

  useEffect(() => () => lineGeo.dispose(), [lineGeo]);

  useEffect(() => {
    const m = nodeMesh.current;
    if (!m) return;
    nodes.forEach((p, i) => {
      dummy.position.set(...p);
      dummy.scale.setScalar(emphasis?.[i] ?? 1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [nodes, emphasis]);

  const pulseCount = pulses ? edges.length : 0;

  useFrame(({ clock }) => {
    const m = pulseMesh.current;
    if (!m || !pulseCount) return;
    const slow = getExperience().reducedMotion ? 0.25 : 1;
    const t = clock.elapsedTime * 0.35 * slow;
    edges.forEach(([i, j], k) => {
      const f = (t + k * 0.37) % 1;
      a.set(...nodes[i]);
      b.set(...nodes[j]);
      dummy.position.lerpVectors(a, b, f);
      dummy.scale.setScalar(0.7 + Math.sin(f * Math.PI) * 0.8);
      dummy.updateMatrix();
      m.setMatrixAt(k, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeo} frustumCulled={false}>
        <lineBasicMaterial color={color} transparent opacity={opacity} />
      </lineSegments>
      <instancedMesh
        ref={nodeMesh}
        args={[undefined, undefined, nodes.length]}
        frustumCulled={false}
      >
        <sphereGeometry args={[nodeSize, 14, 14]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </instancedMesh>
      {pulseCount > 0 && (
        <instancedMesh
          ref={pulseMesh}
          args={[undefined, undefined, pulseCount]}
          frustumCulled={false}
        >
          <sphereGeometry args={[nodeSize * 0.6, 10, 10]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </instancedMesh>
      )}
    </group>
  );
}
