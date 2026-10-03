import {
  Box3,
  Material,
  Mesh,
  Object3D,
  Texture,
  Vector3,
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

type ModelFade = { items: { m: Material; base: number; transparent: boolean }[] };
const modelFades = new WeakMap<Group, ModelFade>();

/** Forget the cached materials (call when a model finished loading into the group). */
export function resetModelFade(group: Group | null) {
  if (group) modelFades.delete(group);
}

/**
 * Fade a whole loaded model in/out. Unlike `setGroupOpacity` the materials go
 * back to opaque (and depth-sorted normally) once the model is fully shown.
 */
export function fadeModel(group: Group, value: number) {
  let cache = modelFades.get(group);
  if (!cache) {
    cache = { items: [] };
    const seen = new Set<Material>();
    group.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.material) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        if (seen.has(m)) return;
        seen.add(m);
        cache!.items.push({ m, base: m.opacity, transparent: m.transparent });
      });
    });
    modelFades.set(group, cache);
  }
  const full = value >= 0.995;
  for (const it of cache.items) {
    it.m.transparent = full ? it.transparent : true;
    it.m.opacity = full ? it.base : it.base * value;
  }
  group.visible = value > 0.003;
}

const box = new Box3();
const bsize = new Vector3();

/**
 * Hides tiny clutter meshes (cables, keycaps, desk toys) — they cost a draw
 * call each and are unreadable at phone size. Anything with a bounding-box
 * diagonal under `ratio` of the whole model's is dropped; textures also stop
 * paying for anisotropic filtering.
 */
export function simplifyModel(root: Object3D, ratio = 0.045, keep: string[] = []) {
  root.updateWorldMatrix(true, true);
  const diag = box.setFromObject(root).getSize(bsize).length() || 1;
  const kept = new Set(keep);
  root.traverse((o) => {
    const mesh = o as Mesh;
    if (!mesh.isMesh) return;
    if (!kept.has(o.name) && box.setFromObject(mesh).getSize(bsize).length() < diag * ratio) {
      mesh.visible = false;
    }
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((m) => {
      for (const v of Object.values(m ?? {})) {
        if (v instanceof Texture) v.anisotropy = 1;
      }
    });
  });
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
