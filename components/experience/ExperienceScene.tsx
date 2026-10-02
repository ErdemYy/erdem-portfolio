"use client";

import { useEffect, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ACESFilmicToneMapping, NoToneMapping, Plane, Vector3 } from "three";
import CameraController from "./CameraController";
import Lighting from "@/components/three/Lighting";
import WorldEnvironment from "@/components/three/Environment";
import World from "@/components/three/World";
import ParticleField from "@/components/three/ParticleField";
import PostProcessing from "@/components/three/PostProcessing";
import {
  BackendStation,
  Constellation,
  DeskStation,
  LaptopStation,
  PcStation,
  PhoneStation,
  SystemsStation,
} from "@/components/three/stations/Stations";
import { frame, setExperience, useExperience } from "@/lib/experience";
import { rig } from "@/lib/rig";
import { perfConfig } from "@/lib/performance";

/** Reveals the world bottom-up through a global clipping plane. */
function IntroReveal() {
  const gl = useThree((s) => s.gl);
  const plane = useMemo(() => new Plane(new Vector3(0, -1, 0), 0), []);

  useEffect(() => {
    gl.clippingPlanes = [plane];
    return () => {
      gl.clippingPlanes = [];
    };
  }, [gl, plane]);

  useFrame(() => {
    const t = frame.intro;
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    plane.constant = -0.2 + e * 60;
  });

  return null;
}

type Props = { reduced: boolean };

/** Which poses each streamed station is needed for. */
const stationPoses: Record<string, readonly string[]> = {
  phone: ["mobile"],
  backend: ["backend"],
  systems: ["systems"],
  laptop: ["laptop", "work", "projectScreen", "projectScreenFlip", "github"],
};

/** Stations needed around the active chapter: one behind, `ahead` in front. */
function wantedStations(chapter: number, ahead: number) {
  const set = new Set<string>();
  for (let i = chapter - 1; i <= chapter + ahead; i++) {
    const pose = frame.chapters[i]?.pose;
    if (!pose) continue;
    for (const [key, poses] of Object.entries(stationPoses)) {
      if (poses.includes(pose)) set.add(key);
    }
  }
  return set;
}

export default function ExperienceScene({ reduced }: Props) {
  const heroReady = useExperience((s) => s.heroReady);
  const perf = useExperience((s) => s.perf);
  const chapter = useExperience((s) => s.chapter);
  const loadAhead = useExperience((s) => s.loadAhead);
  const gl = useThree((s) => s.gl);
  const cfg = perfConfig[perf];
  const stage = useStage(heroReady);

  // the composer tone-maps on the high/medium tiers; the renderer does it on low
  useEffect(() => {
    gl.toneMapping = cfg.composer ? NoToneMapping : ACESFilmicToneMapping;
  }, [gl, cfg.composer]);

  // high tier: everything streams in right behind the hero.
  // medium / low: only the stations around the current chapter exist at all —
  // the rest is never loaded, and dropped (GPU buffers disposed) once behind us.
  const wanted = useMemo(
    () => (perf === "high" ? null : wantedStations(chapter, loadAhead)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [perf, chapter, loadAhead, heroReady],
  );
  const show = (key: string, minStage: number) =>
    heroReady && (wanted ? wanted.has(key) : stage >= minStage);

  const particles = reduced ? Math.min(cfg.particles, 100) : cfg.particles;

  return (
    <>
      <color attach="background" args={["#060709"]} />
      <fogExp2 attach="fog" args={[rig.fogColor, rig.fogDensity]} />

      <CameraController />
      <Lighting />
      <WorldEnvironment />
      <IntroReveal />

      <World />
      {particles > 0 && <ParticleField count={particles} />}

      <DeskStation onReady={() => setExperience({ heroReady: true })} />
      {show("phone", 1) && <PhoneStation />}
      {show("backend", 1) && <BackendStation />}
      {show("laptop", 2) && <LaptopStation />}
      {show("systems", 2) && <SystemsStation />}
      {cfg.decor && stage >= 2 && <PcStation />}
      <Constellation />

      {cfg.composer && <PostProcessing reduced={reduced} />}
    </>
  );
}

function useStage(heroReady: boolean) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (!heroReady) return;
    const t1 = window.setTimeout(() => setStage(1), 350);
    const t2 = window.setTimeout(() => setStage(2), 1400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [heroReady]);
  return stage;
}
