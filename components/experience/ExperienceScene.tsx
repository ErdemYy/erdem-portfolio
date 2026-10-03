"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { usePerf } from "@/lib/performance";

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

/** Phones show a single rack: the systems chapters reuse the backend station. */
const mobileStationPoses: Record<string, readonly string[]> = {
  ...stationPoses,
  backend: ["backend", "systems"],
  systems: [],
};

/** How long a station that just left stays mounted so its fade-out can finish. */
const LINGER_MS = 1600;

/** Stations needed around the active chapter: `behind` before it, `ahead` in front. */
function wantedStations(
  chapter: number,
  ahead: number,
  behind: number,
  table: Record<string, readonly string[]>,
) {
  const set = new Set<string>();
  for (let i = chapter - behind; i <= chapter + ahead; i++) {
    const pose = frame.chapters[i]?.pose;
    if (!pose) continue;
    for (const [key, poses] of Object.entries(table)) {
      if (poses.includes(pose)) set.add(key);
    }
  }
  return set;
}

export default function ExperienceScene({ reduced }: Props) {
  const heroReady = useExperience((s) => s.heroReady);
  const chapter = useExperience((s) => s.chapter);
  const loadAhead = useExperience((s) => s.loadAhead);
  const gl = useThree((s) => s.gl);
  const mobile = useExperience((s) => s.mobile);
  const cfg = usePerf();
  const stage = useStage(heroReady);

  // the composer tone-maps on the high/medium tiers; the renderer does it on low
  useEffect(() => {
    gl.toneMapping = cfg.composer ? NoToneMapping : ACESFilmicToneMapping;
  }, [gl, cfg.composer]);

  // desktop high tier: everything streams in right behind the hero.
  // phones / medium / low: only the stations around the current chapter exist —
  // current model live, NEXT one preloaded (invisible until its chapter), the
  // previous one disposed as soon as its fade-out is done.
  const table = mobile ? mobileStationPoses : stationPoses;
  const ahead = mobile ? Math.min(loadAhead, 1) : loadAhead;
  const wanted = useMemo(
    () =>
      cfg.streaming ? wantedStations(chapter, ahead, cfg.keepBehind, table) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cfg.streaming, cfg.keepBehind, chapter, ahead, table, heroReady],
  );
  const lingering = useLingering(wanted);
  const show = (key: string, minStage: number) =>
    heroReady &&
    (wanted ? wanted.has(key) || lingering.has(key) : stage >= minStage);

  const particles = cfg.particles;

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

/** Stations that just dropped out of `wanted`, kept alive until their fade-out is over. */
function useLingering(wanted: Set<string> | null) {
  const prev = useRef<Set<string> | null>(null);
  const [lingering, setLingering] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const before = prev.current;
    prev.current = wanted;
    if (!before || !wanted) return;
    const dropped = [...before].filter((k) => !wanted.has(k));
    if (!dropped.length) return;
    setLingering((s) => new Set([...s, ...dropped]));
    // not cleared on re-run: each drop owns its own timer
    window.setTimeout(
      () =>
        setLingering((s) => {
          const next = new Set(s);
          dropped.forEach((k) => next.delete(k));
          return next;
        }),
      LINGER_MS,
    );
  }, [wanted]);

  return lingering;
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
