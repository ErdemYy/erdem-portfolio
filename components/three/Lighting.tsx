"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { AmbientLight, DirectionalLight, FogExp2, HemisphereLight, PointLight } from "three";
import { rig } from "@/lib/rig";
import { frame, useExperience } from "@/lib/experience";
import { perfConfig } from "@/lib/performance";

/**
 * Follows the camera target like a film crew: key, fill, rim and an accent
 * point light, all driven by the blended light profile in `rig`.
 * Intensities are scaled by the intro so the scene lights up on reveal.
 */
export default function Lighting() {
  const key = useRef<DirectionalLight>(null);
  const rim = useRef<DirectionalLight>(null);
  const fill = useRef<HemisphereLight>(null);
  const accent = useRef<PointLight>(null);
  const ambient = useRef<AmbientLight>(null);
  const { scene } = useThree();
  const cfg = perfConfig[useExperience((st) => st.perf)];

  useEffect(() => {
    const k = key.current;
    const r = rim.current;
    if (!k) return;
    scene.add(k.target);
    if (r) scene.add(r.target);
    return () => {
      scene.remove(k.target);
      if (r) scene.remove(r.target);
    };
  }, [scene, cfg.rimLight]);

  useFrame(() => {
    const k = key.current;
    const r = rim.current;
    const f = fill.current;
    const a = accent.current;
    const amb = ambient.current;
    if (!k || !f || !amb) return;

    const lit = 0.15 + 0.85 * frame.intro;

    k.position.copy(rig.target).add(rig.key.offset);
    k.target.position.copy(rig.target);
    k.color.copy(rig.key.color);
    // without rim/accent lights the key carries a little more of the picture
    k.intensity = rig.key.intensity * lit * (cfg.rimLight ? 1 : 1.3);

    if (r) {
      r.position.copy(rig.target).add(rig.rim.offset);
      r.target.position.copy(rig.target);
      r.color.copy(rig.rim.color);
      r.intensity = rig.rim.intensity * lit;
    }

    f.color.copy(rig.fill.color);
    f.groundColor.set("#0a0a0c");
    f.intensity = rig.fill.intensity * lit;

    if (a) {
      a.position.copy(rig.target).add(rig.accent.offset);
      a.color.copy(rig.accent.color);
      a.intensity = rig.accent.intensity * lit;
    }

    amb.intensity = rig.ambient * lit * (cfg.accentLight ? 1 : 1.5);

    scene.environmentIntensity = rig.env * lit;
    const fog = scene.fog as FogExp2 | null;
    if (fog) {
      fog.color.copy(rig.fogColor);
      fog.density = rig.fogDensity;
    }
  });

  return (
    <>
      <ambientLight ref={ambient} />
      <hemisphereLight ref={fill} />
      <directionalLight ref={key} />
      {cfg.rimLight && <directionalLight ref={rim} />}
      {cfg.accentLight && <pointLight ref={accent} distance={26} decay={1.6} />}
    </>
  );
}
