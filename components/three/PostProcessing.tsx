"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  Noise,
  SMAA,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { rig } from "@/lib/rig";

/**
 * Cinematic, not showy: light bloom on emissives, vignette, a breath of
 * film grain and filmic tone mapping. Bloom strength follows the light
 * profile of the current chapter.
 */
export default function PostProcessing({ reduced }: { reduced: boolean }) {
  const bloom = useRef<{ intensity: number } | null>(null);

  useFrame(() => {
    if (bloom.current) bloom.current.intensity = rig.bloom;
  });

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        ref={bloom as never}
        intensity={0.4}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.2}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.22} darkness={0.75} />
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={reduced ? 0.15 : 0.32}
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <SMAA />
    </EffectComposer>
  );
}
