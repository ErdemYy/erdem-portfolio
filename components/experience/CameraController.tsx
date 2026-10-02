"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, MathUtils, Vector3 } from "three";
import { frame, getExperience } from "@/lib/experience";
import { rig } from "@/lib/rig";
import {
  lightProfiles,
  waypoints,
  type LightProfile,
  type Waypoint,
} from "@/lib/choreography";
import { clamp } from "@/lib/utils";
import { degradePerf } from "@/lib/performance";

type Eval = {
  pos: Vector3;
  target: Vector3;
  fov: number;
  fx: number;
  fy: number;
};

const mkEval = (): Eval => ({
  pos: new Vector3(),
  target: new Vector3(),
  fov: 36,
  fx: 0,
  fy: 0,
});

const A = mkEval();
const B = mkEval();
const off = new Vector3();
const right = new Vector3();
const up = new Vector3();
const tmpColor = new Color();
const tmpColorB = new Color();
const cTmp = new Color();
const tmpV = new Vector3();
const tmpV2 = new Vector3();
const shift = new Vector3();

const FALLBACK = waypoints.hero;
const wp = (pose: string): Waypoint => waypoints[pose] ?? FALLBACK;
const lp = (w: Waypoint): LightProfile => lightProfiles[w.light];

/** Evaluate a waypoint at local chapter progress p (0..1). */
function evaluate(
  out: Eval,
  w: Waypoint,
  p: number,
  fit: number,
  portrait: boolean,
  motion: number,
  aspect: number,
  lens: number,
) {
  // portrait phones get their own single-focus composition where one exists
  const pm = portrait ? w.m : undefined;
  const src = pm ? { ...w, ...pm } : w;
  const tight = !!pm?.tight;
  const fitK = tight ? 1 : fit;
  const lensK = tight ? 1 : lens;

  out.target.set(...src.target);
  off.set(src.pos[0] - src.target[0], src.pos[1] - src.target[1], src.pos[2] - src.target[2]);
  const t = p - 0.5;
  const orbit = (src.orbit ?? 0) * t * motion;
  if (orbit) off.applyAxisAngle(up.set(0, 1, 0), orbit);
  const dolly = 1 + (src.dolly ?? 0) * t * motion;
  off.multiplyScalar(dolly * fitK);
  out.pos.copy(out.target).add(off);
  // portrait: widen the lens (cheaper than dollying through other stations);
  // poses that look at a screen widen until the whole glass fits across.
  const widen = (f: number) =>
    MathUtils.radToDeg(2 * Math.atan(Math.tan(MathUtils.degToRad(f) / 2) * lensK));
  out.fov = lensK > 1.001 ? Math.min(75, widen(src.fov)) : src.fov;
  if (portrait && src.screenWidth) {
    const need = MathUtils.radToDeg(
      2 * Math.atan((src.screenWidth * 1.12) / (2 * off.length() * aspect)),
    );
    out.fov = MathUtils.clamp(need, src.fov, 82);
  }
  const f = portrait ? (w.frameMobile ?? [0, 0]) : (w.frame ?? [0, 0]);
  out.fx = f[0];
  out.fy = f[1];
}

const damp = MathUtils.damp;

/* Dev-only inspection hook (tree-shaken in production builds). */
type DevHook = {
  scene?: unknown;
  gl?: unknown;
  frame: typeof frame;
  degradePerf: () => void;
};
const dev: DevHook | null =
  process.env.NODE_ENV !== "production" && typeof window !== "undefined"
    ? ((window as unknown as { __exp: unknown }).__exp = {
        rig,
        frame,
        waypoints,
        lightProfiles,
        degradePerf,
      } as DevHook)
    : null;

function dampVec(cur: Vector3, target: Vector3, lambda: number, dt: number) {
  cur.x = damp(cur.x, target.x, lambda, dt);
  cur.y = damp(cur.y, target.y, lambda, dt);
  cur.z = damp(cur.z, target.z, lambda, dt);
}

function dampColor(cur: Color, target: Color, lambda: number, dt: number) {
  cur.r = damp(cur.r, target.r, lambda, dt);
  cur.g = damp(cur.g, target.g, lambda, dt);
  cur.b = damp(cur.b, target.b, lambda, dt);
}

/** Blend two numeric light channels. */
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Turns the scroll chapter pair into a cinematic camera + light rig.
 * Runs first in the frame loop (priority -1) so every other consumer sees
 * a consistent rig.
 */
export default function CameraController() {
  const { camera, size, scene, gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const time = useRef(0);

  useEffect(() => {
    if (dev) {
      dev.scene = scene;
      dev.gl = gl;
    }
  }, [scene, gl]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      frame.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      frame.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    time.current += dt;
    const { reducedMotion, coarse } = getExperience();
    const motion = reducedMotion ? 0.3 : 1;
    const lambda =
      dev && (frame.debugPose || frame.debugSnap) ? 1000 : reducedMotion ? 10 : 4.2;

    const aspect = size.width / size.height;
    const portrait = aspect < 0.95;
    // Narrow screens need more horizontal coverage. Backing the camera off a lot
    // would carry it through neighbouring stations, so cover it with a modest
    // dolly plus a wider lens instead.
    const coverage = aspect < 1.6 ? clamp(Math.sqrt(1.6 / aspect), 1, 2.1) : 1;
    const fit = 1 + (coverage - 1) * 0.32;
    const lens = coverage / fit;

    const cs = frame.chapters;
    const forced = dev ? frame.debugPose : null;
    const fromPose = forced ?? cs[frame.from]?.pose ?? "hero";
    const toPose = forced ?? cs[frame.to]?.pose ?? fromPose;
    const wA = wp(fromPose);
    const wB = wp(toPose);

    evaluate(A, wA, forced ? 0.5 : frame.pFrom, fit, portrait, motion, aspect, lens);
    evaluate(B, wB, forced ? 0.5 : frame.pTo, fit, portrait, motion, aspect, lens);
    const b = forced ? 0 : frame.blend;

    /* ---------------- intro (camera reveal) ---------------- */
    const intro = frame.intro;
    const e = 1 - Math.pow(1 - intro, 3);
    const introK = 1 - e;

    const tp = tmpV.lerpVectors(A.target, B.target, b);
    const pp = tmpV2.lerpVectors(A.pos, B.pos, b);

    // damped rig (target first, then position offset)
    dampVec(rig.target, tp, lambda, dt);
    dampVec(rig.pos, pp, lambda, dt);
    rig.fov = damp(rig.fov, mix(A.fov, B.fov, b), lambda, dt);
    rig.frameX = damp(rig.frameX, mix(A.fx, B.fx, b), lambda, dt);
    rig.frameY = damp(rig.frameY, mix(A.fy, B.fy, b), lambda, dt);

    /* ---------------- lighting rig ---------------- */
    const L0 = lp(wA);
    const L1 = lp(wB);
    const lerpC = (out: Color, c0: string, c1: string) => {
      tmpColor.set(c0);
      tmpColorB.set(c1);
      return out.copy(tmpColor).lerp(tmpColorB, b);
    };

    dampColor(rig.key.color, lerpC(cTmp, L0.key.color, L1.key.color), lambda, dt);
    rig.key.intensity = damp(rig.key.intensity, mix(L0.key.intensity, L1.key.intensity, b), lambda, dt);
    rig.key.offset.set(
      mix(L0.key.offset[0], L1.key.offset[0], b),
      mix(L0.key.offset[1], L1.key.offset[1], b),
      mix(L0.key.offset[2], L1.key.offset[2], b),
    );

    dampColor(rig.fill.color, lerpC(cTmp, L0.fill.color, L1.fill.color), lambda, dt);
    rig.fill.intensity = damp(rig.fill.intensity, mix(L0.fill.intensity, L1.fill.intensity, b), lambda, dt);

    dampColor(rig.rim.color, lerpC(cTmp, L0.rim.color, L1.rim.color), lambda, dt);
    rig.rim.intensity = damp(rig.rim.intensity, mix(L0.rim.intensity, L1.rim.intensity, b), lambda, dt);
    rig.rim.offset.set(
      mix(L0.rim.offset[0], L1.rim.offset[0], b),
      mix(L0.rim.offset[1], L1.rim.offset[1], b),
      mix(L0.rim.offset[2], L1.rim.offset[2], b),
    );

    dampColor(rig.accent.color, lerpC(cTmp, L0.accent.color, L1.accent.color), lambda, dt);
    rig.accent.intensity = damp(rig.accent.intensity, mix(L0.accent.intensity, L1.accent.intensity, b), lambda, dt);
    rig.accent.offset.set(
      mix(L0.accent.offset[0], L1.accent.offset[0], b),
      mix(L0.accent.offset[1], L1.accent.offset[1], b),
      mix(L0.accent.offset[2], L1.accent.offset[2], b),
    );

    rig.ambient = damp(rig.ambient, mix(L0.ambient, L1.ambient, b), lambda, dt);
    rig.env = damp(rig.env, mix(L0.env, L1.env, b), lambda, dt);
    dampColor(rig.fogColor, lerpC(cTmp, L0.fog.color, L1.fog.color), lambda, dt);
    rig.fogDensity = damp(rig.fogDensity, mix(L0.fog.density, L1.fog.density, b), lambda, dt);
    rig.bloom = damp(rig.bloom, mix(L0.bloom, L1.bloom, b), lambda, dt);

    /* ---------------- apply to the camera ---------------- */
    // intro arc: start farther out and swung to the side, ease into place
    off.copy(rig.pos).sub(rig.target);
    if (introK > 0.0005) {
      off.applyAxisAngle(up.set(0, 1, 0), 0.5 * introK * (reducedMotion ? 0.3 : 1));
      off.multiplyScalar(1 + 0.55 * introK * (reducedMotion ? 0.3 : 1));
      off.y += 1.2 * introK;
    }
    camera.position.copy(rig.target).add(off);

    // idle sway + pointer parallax (tiny, never drives the animation)
    const len = off.length();
    if (!reducedMotion) {
      const t = time.current;
      camera.position.x += Math.sin(t * 0.31) * 0.012 * len;
      camera.position.y += Math.sin(t * 0.23 + 1.3) * 0.007 * len;
    }
    // no pointer parallax while the laptop is being used (steady click targets)
    if (!coarse && !reducedMotion && getExperience().group !== "open") {
      mouse.current.x = damp(mouse.current.x, frame.mouse.x, 3, dt);
      mouse.current.y = damp(mouse.current.y, frame.mouse.y, 3, dt);
      camera.lookAt(rig.target);
      camera.updateMatrixWorld();
      right.setFromMatrixColumn(camera.matrixWorld, 0);
      up.setFromMatrixColumn(camera.matrixWorld, 1);
      camera.position
        .addScaledVector(right, mouse.current.x * 0.022 * len)
        .addScaledVector(up, -mouse.current.y * 0.014 * len);
    }
    camera.lookAt(rig.target);

    // lens
    const cam = camera as import("three").PerspectiveCamera;
    cam.fov = rig.fov + 5 * introK;
    cam.updateProjectionMatrix();

    // framing: slide camera + target together (parallel shift, no rotation) so
    // the subject sits beside the copy column. Unlike an off-axis projection
    // this keeps CSS-3D screens (drei <Html transform>) perfectly registered.
    if (rig.frameX || rig.frameY) {
      camera.updateMatrixWorld();
      right.setFromMatrixColumn(camera.matrixWorld, 0);
      up.setFromMatrixColumn(camera.matrixWorld, 1);
      const dist = camera.position.distanceTo(rig.target);
      const visH = 2 * dist * Math.tan(MathUtils.degToRad(cam.fov) / 2);
      shift
        .copy(right)
        .multiplyScalar(-rig.frameX * visH * aspect)
        .addScaledVector(up, -rig.frameY * visH);
      camera.position.add(shift);
      camera.lookAt(tmpV.copy(rig.target).add(shift));
    }
  }, -1);

  return null;
}
