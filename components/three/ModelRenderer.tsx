"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, type ReactNode } from "react";
import { useGLTF } from "@react-three/drei";
import { clone as cloneWithSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import type { PortfolioAsset } from "@/types/portfolio";
import { disposeObject } from "@/lib/three-utils";
import {
  ModelErrorBoundary,
  ModelErrorFallback,
  ModelLoaderFallback,
} from "./ModelLoader";

type V3 = [number, number, number];

export type ModelRendererProps = {
  asset: PortfolioAsset;
  position?: V3;
  rotation?: V3;
  scale?: number | V3;
  /** Node names to hide (e.g. a room that ships inside the GLB). */
  hide?: string[];
  /** Fired once the geometry is in the scene graph. */
  onReady?: () => void;
  /** Rendered inside the model's transform (screens, labels…). */
  children?: ReactNode;
  fallbackSize?: number;
};

function Model({
  asset,
  position,
  rotation,
  scale = 1,
  hide,
  onReady,
  children,
}: ModelRendererProps) {
  // GLB / GLTF — meshopt is on, Draco off (assets are meshopt-compressed)
  const gltf = useGLTF(asset.path, false, true);
  // SkeletonUtils: plain Object3D.clone() loses skin bindings (the rack is skinned)
  const scene = useMemo(() => cloneWithSkeleton(gltf.scene), [gltf.scene]);

  useLayoutEffect(() => {
    const hidden = new Set(hide ?? []);
    scene.traverse((o) => {
      if (hidden.has(o.name)) o.visible = false;
    });
  }, [scene, hide]);

  useEffect(() => {
    onReady?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      // GPU buffers re-upload automatically if the cached scene is reused
      disposeObject(scene);
    };
  }, [scene]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
      {children}
    </group>
  );
}

/** Loads a GLB/GLTF with Suspense + error isolation. */
export default function ModelRenderer(props: ModelRendererProps) {
  const size = props.fallbackSize ?? 2;
  return (
    <ModelErrorBoundary
      label={props.asset.name}
      onError={props.onReady}
      fallback={<ModelErrorFallback size={size} />}
    >
      <Suspense fallback={<ModelLoaderFallback size={size} />}>
        <Model {...props} />
      </Suspense>
    </ModelErrorBoundary>
  );
}
