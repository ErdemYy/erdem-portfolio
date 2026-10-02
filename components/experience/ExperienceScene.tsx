"use client";

import { useEffect, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Plane, Vector3 } from "three";
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

type Props = { lowPower: boolean; reduced: boolean };

export default function ExperienceScene({ lowPower, reduced }: Props) {
  const heroReady = useExperience((s) => s.heroReady);
  const stage = useStage(heroReady);

  return (
    <>
      <color attach="background" args={["#060709"]} />
      <fogExp2 attach="fog" args={[rig.fogColor, rig.fogDensity]} />

      <CameraController />
      <Lighting />
      <WorldEnvironment />
      <IntroReveal />

      <World />
      <ParticleField count={lowPower ? 220 : reduced ? 260 : 650} />

      {/* progressive loading: hero first, the rest streams in behind it */}
      <DeskStation onReady={() => setExperience({ heroReady: true })} />
      {stage >= 1 && (
        <>
          <PhoneStation />
          <BackendStation />
        </>
      )}
      {stage >= 2 && (
        <>
          <LaptopStation />
          <PcStation />
          <SystemsStation />
        </>
      )}
      <Constellation pulses={!lowPower} />

      {!lowPower && <PostProcessing reduced={reduced} />}
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
