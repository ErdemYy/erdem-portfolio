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
import { usePerf } from "@/lib/performance";

/**
 * Cinematic, not showy. HIGH: bloom + vignette + grain + SMAA. MEDIUM: a
 * half-strength, low-resolution bloom and a lighter vignette only. LOW never
 * mounts this (the renderer tone-maps by itself).
 */
export default function PostProcessing({ reduced }: { reduced: boolean }) {
  const cfg = usePerf();
  const bloom = useRef<{ intensity: number } | null>(null);

  useFrame(() => {
    if (bloom.current) bloom.current.intensity = rig.bloom * cfg.bloom;
  });

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        ref={bloom as never}
        intensity={0.4 * cfg.bloom}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.2}
        resolutionScale={cfg.bloomResolution}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.22} darkness={cfg.vignette} />
      {cfg.noise ? (
        <Noise
          premultiply
          blendFunction={BlendFunction.SOFT_LIGHT}
          opacity={reduced ? 0.15 : 0.32}
        />
      ) : (
        <></>
      )}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      {cfg.smaa ? <SMAA /> : <></>}
    </EffectComposer>
  );
}
