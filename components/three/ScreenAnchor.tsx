"use client";

import { forwardRef, useMemo, type ReactNode } from "react";
import { BufferGeometry, Float32BufferAttribute, type Group } from "three";
import type { ScreenConfig } from "@/lib/screens";

/** Dev-only: open the site with ?debugScreens to see every anchor. */
function useDebugScreens() {
  return useMemo(
    () =>
      process.env.NODE_ENV !== "production" &&
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("debugScreens"),
    [],
  );
}

function DebugPlane({ w, h }: { w: number; h: number }) {
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

  return (
    <group renderOrder={999}>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color="#ff2d2d" wireframe transparent opacity={0.9} depthTest={false} />
      </mesh>
      <lineLoop geometry={outline}>
        <lineBasicMaterial color="#ff2d2d" depthTest={false} />
      </lineLoop>
      <axesHelper args={[0.35]} />
    </group>
  );
}

type Props = { config: ScreenConfig; children: ReactNode };

/**
 * An Object3D that sits exactly on the model's glass. Everything that lives
 * "on the screen" is a child of this group, so it inherits the model's
 * transform — and the camera's perspective — for free.
 */
const ScreenAnchor = forwardRef<Group, Props>(function ScreenAnchor(
  { config, children },
  ref,
) {
  const debug = useDebugScreens();
  return (
    <group
      ref={ref}
      name={`ScreenAnchor:${config.node}`}
      position={config.position}
      rotation={config.rotation}
      scale={config.scale}
    >
      {children}
      {debug && <DebugPlane w={config.width} h={config.height} />}
    </group>
  );
});

export default ScreenAnchor;
