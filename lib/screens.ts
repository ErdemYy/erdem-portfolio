/**
 * Screen anchors — the ONLY place where "where is the glass on the model" is
 * defined. Values are in the LOCAL space of the model they belong to, so they
 * follow that model's position / rotation / scale automatically.
 *
 * Derived from the real glTF scene graphs (inspected, not guessed):
 *
 *  desk   modern_desk_setup…glb  node `Object_86` (mesh `Object_46`) — the flat
 *         monitor display plane, local bounds x −0.50…0.88, y 0.39…1.22,
 *         z −1.92 (facing +z). 1.38 × 0.83 ≈ 16:9.6.
 *  laptop low_poly_laptop…glb    node `Object_7` (mesh `Object_3`) — the lid,
 *         tilted ~19.5° back (x −1.90…0.90, y 0.35…1.79, z −1.05…−0.54). The
 *         usable glass inside the bezel is 2.5 × 1.32 (≈ 17:9).
 *
 * Change the model → change these numbers, nothing else.
 */
export type ScreenConfig = {
  /** glTF node the glass was measured from (documentation only) */
  node: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  /** glass size in the model's local units */
  width: number;
  height: number;
  /** CSS px width the interface is authored at (desktop) */
  px: number;
};

export const screenConfig = {
  desk: {
    node: "Object_86",
    // 0.004 in front of the display plane: no z-fighting, still "in" the glass
    position: [0.19, 0.805, -1.901],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    width: 1.38,
    height: 0.83,
    px: 1000,
  },
  laptop: {
    node: "Object_7",
    position: [-0.5, 1.07, -0.775],
    rotation: [-0.34, 0, 0],
    scale: [1, 1, 1],
    width: 2.5,
    height: 1.32,
    px: 1000,
  },
} satisfies Record<string, ScreenConfig>;

/** Authoring width on narrow screens — fewer, bigger pixels so it stays legible. */
export const compactPx = 560;

export type ScreenKey = keyof typeof screenConfig;
