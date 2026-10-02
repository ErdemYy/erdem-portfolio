import { stations, type V3 } from "./world";

/* ------------------------------------------------------------------ */
/*  Lighting profiles â€” one per mood, blended by scroll                */
/* ------------------------------------------------------------------ */

export type LightProfile = {
  key: { color: string; intensity: number; offset: V3 };
  fill: { color: string; intensity: number };
  rim: { color: string; intensity: number; offset: V3 };
  accent: { color: string; intensity: number; offset: V3 };
  ambient: number;
  env: number;
  fog: { color: string; density: number };
  bloom: number;
};

export const lightProfiles = {
  /** HERO â€” soft studio */
  studio: {
    key: { color: "#fff0de", intensity: 2.4, offset: [6, 9, 8] },
    fill: { color: "#8c9bb4", intensity: 0.55 },
    rim: { color: "#ffffff", intensity: 1.4, offset: [-8, 5, -7] },
    accent: { color: "#ff5b2e", intensity: 0, offset: [0, 3, 3] },
    ambient: 0.16,
    env: 0.7,
    fog: { color: "#08090b", density: 0.026 },
    bloom: 0.45,
  },
  /** ABOUT â€” low contrast */
  soft: {
    key: { color: "#e9e6df", intensity: 1.2, offset: [5, 7, 7] },
    fill: { color: "#a2aab8", intensity: 0.95 },
    rim: { color: "#cfd6e2", intensity: 0.6, offset: [-6, 4, -6] },
    accent: { color: "#ff5b2e", intensity: 0, offset: [0, 3, 3] },
    ambient: 0.24,
    env: 0.62,
    fog: { color: "#0a0b0d", density: 0.03 },
    bloom: 0.3,
  },
  /** WEB â€” neutral screen glow */
  screen: {
    key: { color: "#f2f0ea", intensity: 1.7, offset: [4, 6, 8] },
    fill: { color: "#7d8aa6", intensity: 0.6 },
    rim: { color: "#ffffff", intensity: 1, offset: [-6, 4, -5] },
    accent: { color: "#9cb6ff", intensity: 5, offset: [0, 0.5, 2.5] },
    ambient: 0.14,
    env: 0.55,
    fog: { color: "#07080a", density: 0.03 },
    bloom: 0.6,
  },
  /** MOBILE â€” cool light */
  cool: {
    key: { color: "#dbe8ff", intensity: 2.2, offset: [4, 6, 7] },
    fill: { color: "#6f86b8", intensity: 0.7 },
    rim: { color: "#a9c4ff", intensity: 2.2, offset: [-6, 3, -6] },
    accent: { color: "#8fb4ff", intensity: 9, offset: [1.5, 0.5, 3] },
    ambient: 0.1,
    env: 0.6,
    fog: { color: "#06080d", density: 0.03 },
    bloom: 0.55,
  },
  /** BACKEND â€” technical blue accent */
  technical: {
    key: { color: "#c3d4f5", intensity: 2.2, offset: [3, 6, 8] },
    fill: { color: "#4d65a0", intensity: 0.45 },
    rim: { color: "#4f8cff", intensity: 2.6, offset: [-5, 3, -6] },
    accent: { color: "#4f8cff", intensity: 22, offset: [0, 1, 3.5] },
    ambient: 0.14,
    env: 0.55,
    fog: { color: "#05070c", density: 0.03 },
    bloom: 0.8,
  },
  /** PROJECTS â€” dynamic focused light */
  focused: {
    key: { color: "#ffffff", intensity: 3.4, offset: [5, 8, 6] },
    fill: { color: "#6c7686", intensity: 0.3 },
    rim: { color: "#ffd9c7", intensity: 1.6, offset: [-6, 4, -5] },
    accent: { color: "#ff5b2e", intensity: 14, offset: [-2, 1.5, 4] },
    ambient: 0.14,
    env: 0.62,
    fog: { color: "#060607", density: 0.03 },
    bloom: 0.5,
  },
  /** CONTACT â€” minimal dark */
  minimal: {
    key: { color: "#e6e2da", intensity: 0.9, offset: [4, 8, 6] },
    fill: { color: "#59606e", intensity: 0.25 },
    rim: { color: "#aab3c4", intensity: 0.7, offset: [-6, 4, -6] },
    accent: { color: "#ff5b2e", intensity: 0, offset: [0, 3, 3] },
    ambient: 0.1,
    env: 0.4,
    fog: { color: "#050506", density: 0.014 },
    bloom: 0.25,
  },
} satisfies Record<string, LightProfile>;

export type LightKey = keyof typeof lightProfiles;

/* ------------------------------------------------------------------ */
/*  Camera waypoints                                                   */
/* ------------------------------------------------------------------ */

export type Waypoint = {
  pos: V3;
  target: V3;
  fov: number;
  /** Total orbit (radians) around the target across the chapter. */
  orbit?: number;
  /** Fractional dolly in/out across the chapter (+ = away). */
  dolly?: number;
  /** Viewport framing shift (fraction of w/h) â€” desktop / mobile. */
  frame?: [number, number];
  frameMobile?: [number, number];
  /**
   * World width of the screen this pose looks at. On portrait viewports the
   * lens widens until the whole screen fits horizontally.
   */
  screenWidth?: number;
  light: LightKey;
};

/** Offset from a station â€” keeps poses glued to the world layout. */
const at = (base: V3, dx: number, dy: number, dz: number): V3 => [
  base[0] + dx,
  base[1] + dy,
  base[2] + dz,
];

const phone = stations.phone.position;
const backend = stations.backend.position;
const systems = stations.systems.position;
const laptop = stations.laptop.position;
const cluster = stations.constellation.position;

/** Centre of the laptop glass in world space (see laptopPlacement). */
const laptopGlass = at(laptop, 0, 2.55, -1.2);
/** Centre of the desk monitor glass in world space. */
const deskGlass: V3 = [0, 3.72, -0.85];

export const waypoints: Record<string, Waypoint> = {
  // wide establishing shot
  hero: {
    pos: [3.2, 5.8, 15.5],
    target: [0, 3, 0],
    fov: 36,
    orbit: 0.12,
    dolly: -0.05,
    frameMobile: [0, 0.14],
    light: "studio",
  },
  // slow orbit around the desk
  about: {
    pos: [-7.5, 4.8, 10.5],
    target: [-0.4, 3.2, 0.4],
    fov: 34,
    orbit: 0.6,
    frame: [0.17, 0],
    frameMobile: [0, 0.2],
    light: "soft",
  },
  // pulled back â€” the whole environment, travelling across it
  buildIntro: {
    pos: [6, 11, 27],
    target: [1, 2, -12],
    fov: 42,
    orbit: -0.25,
    frame: [0.12, 0],
    frameMobile: [0, 0.14],
    light: "soft",
  },
  web: {
    pos: [2.6, 4.7, 7.2],
    target: [0.1, 3.6, -0.5],
    fov: 32,
    orbit: -0.12,
    frame: [0.17, 0],
    frameMobile: [0, 0.2],
    light: "screen",
  },
  mobile: {
    pos: at(phone, 3.4, 3.8, 9.8),
    target: at(phone, 0, 2.9, 0),
    fov: 32,
    orbit: 0.22,
    frame: [0.17, 0],
    frameMobile: [0, 0.2],
    light: "cool",
  },
  backend: {
    pos: at(backend, 4.6, 4.2, 15.5),
    target: at(backend, 0, 3.0, 0),
    fov: 34,
    orbit: -0.15,
    frame: [0.17, 0],
    frameMobile: [0, 0.2],
    light: "technical",
  },
  systems: {
    pos: at(systems, 4.5, 6.2, 17.5),
    target: at(systems, 0, 3.3, 0),
    fov: 38,
    orbit: -0.25,
    dolly: -0.1,
    frame: [0.17, 0],
    frameMobile: [0, 0.2],
    light: "technical",
  },
  laptop: {
    pos: at(laptopGlass, 1.0, 1.9, 13.2),
    target: laptopGlass,
    fov: 30,
    dolly: -0.16,
    frame: [0.2, 0],
    frameMobile: [0, 0.14],
    screenWidth: 4.75,
    light: "screen",
  },
  work: {
    pos: at(laptop, 11, 5.5, 8),
    target: at(laptop, -0.5, 2.4, -1.6),
    fov: 36,
    orbit: 0.2,
    frame: [0.16, 0],
    frameMobile: [0, 0.18],
    light: "focused",
  },
  // Projects live on the laptop glass: centred, steady, with a slow sway
  // (the Flip variant mirrors the orbit so neighbouring chapters join up).
  projectScreen: {
    pos: at(laptopGlass, 0.9, 1.2, 9.2),
    target: laptopGlass,
    fov: 30,
    orbit: 0.16,
    dolly: -0.1,
    frameMobile: [0, 0.14],
    screenWidth: 4.75,
    light: "screen",
  },
  // the monitor shows the featured project; camera closes in on it
  featured: {
    pos: at(deskGlass, 0.35, 0.3, 4.6),
    target: deskGlass,
    fov: 30,
    dolly: -0.14,
    frameMobile: [0, 0.12],
    screenWidth: 2.2,
    light: "screen",
  },

  // scene expands: pulled back to hold the whole constellation
  stack: {
    pos: at(cluster, 0, 3.4, 24),
    target: at(cluster, 0, -0.6, 0),
    fov: 46,
    orbit: 0.4,
    frame: [0.18, 0],
    frameMobile: [0, 0.22],
    light: "technical",
  },
  engineering: {
    pos: [0.6, 12.5, 7.5],
    target: [0, 2.8, 0.3],
    fov: 34,
    orbit: 0.3,
    light: "soft",
  },
  journey: {
    pos: [-6.2, 2.2, 10],
    target: [0, 3.4, 0],
    fov: 34,
    orbit: -0.3,
    frame: [0.14, 0],
    frameMobile: [0, 0.2],
    light: "studio",
  },
  // the laptop shows the repositories â€” close and steady so it can be used
  github: {
    pos: at(laptopGlass, 0.5, 1.1, 9.8),
    target: laptopGlass,
    fov: 30,
    frame: [0.1, 0],
    frameMobile: [0, 0.14],
    screenWidth: 4.75,
    light: "screen",
  },


  // pulled far away
  contact: {
    pos: [8, 19, 40],
    target: [3, 2, -12],
    fov: 46,
    orbit: 0.1,
    frame: [0.1, 0],
    frameMobile: [0, 0.1],
    light: "minimal",
  },
};

/** Mirrored sway for every other project chapter (continuous at the joins). */
waypoints.projectScreenFlip = {
  ...waypoints.projectScreen,
  orbit: -(waypoints.projectScreen.orbit ?? 0),
};

export const poseOrder = Object.keys(waypoints);


