import {
  Material,
  Mesh,
  Object3D,
  Texture,
  type BufferGeometry,
  type Group,
} from "three";
import { frame } from "./experience";

/** 0..1 — how strongly a camera pose is currently "on" (accounts for blends). */
export function poseWeight(pose: string) {
  if (frame.debugPose) return frame.debugPose === pose ? 1 : 0;
  const cs = frame.chapters;
  const from = cs[frame.from]?.pose;
  const to = cs[frame.to]?.pose;
  let w = 0;
  if (from === pose) w += 1 - frame.blend;
  if (to === pose && frame.to !== frame.from) w += frame.blend;
  if (from === pose && to === pose) w = 1;
  return Math.min(1, w);
}

/** Weight over several poses (e.g. the three project poses). */
export const poseWeightAny = (poses: string[]) =>
  Math.min(1, poses.reduce((s, p) => s + poseWeight(p), 0));

type FadeCache = { materials: { m: Material; base: number }[] };
const fadeCaches = new WeakMap<Group, FadeCache>();

/** Cheap group-wide opacity: materials are collected once, then reused. */
export function setGroupOpacity(group: Group, value: number) {
  let cache = fadeCaches.get(group);
  if (!cache) {
    cache = { materials: [] };
    group.traverse((o) => {
      const mesh = o as Mesh;
      const mats = mesh.material
        ? Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material]
        : [];
      mats.forEach((m) => {
        m.transparent = true;
        cache!.materials.push({ m, base: m.opacity });
      });
    });
    fadeCaches.set(group, cache);
  }
  for (const { m, base } of cache.materials) m.opacity = base * value;
  group.visible = value > 0.003;
}

/** Releases GPU memory for an object tree (geometries, materials, textures). */
export function disposeObject(root: Object3D) {
  root.traverse((o) => {
    const mesh = o as Mesh;
    (mesh.geometry as BufferGeometry | undefined)?.dispose?.();
    const mats = mesh.material
      ? Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material]
      : [];
    mats.forEach((m) => {
      for (const v of Object.values(m)) {
        if (v instanceof Texture) v.dispose();
      }
      m.dispose();
    });
  });
}
