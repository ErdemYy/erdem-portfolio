import { Color, Vector3 } from "three";

/**
 * The "rig" is the blended + damped result of the choreography for the
 * current frame. CameraController writes it; Lighting / Fog / PostProcessing
 * only read it. Plain mutable object — no React involved.
 */
export const rig = {
  pos: new Vector3(3.2, 5.8, 15.5),
  target: new Vector3(0, 3, 0),
  fov: 36,
  frameX: 0,
  frameY: 0,
  key: { color: new Color("#fff0de"), intensity: 0, offset: new Vector3(6, 9, 8) },
  fill: { color: new Color("#8c9bb4"), intensity: 0 },
  rim: { color: new Color("#ffffff"), intensity: 0, offset: new Vector3(-8, 5, -7) },
  accent: { color: new Color("#ff5b2e"), intensity: 0, offset: new Vector3(0, 3, 3) },
  ambient: 0,
  env: 0,
  fogColor: new Color("#08090b"),
  fogDensity: 0.016,
  bloom: 0.4,
};
