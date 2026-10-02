import { useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ */
/*  Reactive store — only for things that change rarely (chapter, UI) */
/* ------------------------------------------------------------------ */

export type ExperienceState = {
  /** Device flags are resolved on the client after mount. */
  ready: boolean;
  mobile: boolean;
  coarse: boolean;
  reducedMotion: boolean;
  webgl: boolean;
  /** Real asset loading progress 0..100 (from the three loading manager). */
  loadProgress: number;
  /** Hero model finished loading. */
  heroReady: boolean;
  /** Loading screen dismissed — intro animation may run. */
  introDone: boolean;
  /** Index of the active chapter. */
  chapter: number;
  chapterId: string;
  /** Active group key (hero, about, build, work…). */
  group: string;
  laptopTab: number;
  /** Project currently on the laptop screen (follows the scroll chapter). */
  projectId: string;
  /** Ids of the projects currently listed (after filtering), in order. */
  projectIds: string[];
  /** Viewport < 900px — screens use their compact interface. */
  narrow: boolean;
  menuOpen: boolean;
  soundOn: boolean;
  soundAvailable: boolean;
};

const initial: ExperienceState = {
  ready: false,
  mobile: false,
  coarse: false,
  reducedMotion: false,
  webgl: true,
  loadProgress: 0,
  heroReady: false,
  introDone: false,
  chapter: 0,
  chapterId: "hero",
  group: "hero",
  laptopTab: 0,
  projectId: "",
  projectIds: [],
  narrow: false,
  menuOpen: false,
  soundOn: false,
  soundAvailable: false,
};

let state: ExperienceState = initial;
const listeners = new Set<() => void>();

export const getExperience = () => state;

export function setExperience(patch: Partial<ExperienceState>) {
  let changed = false;
  for (const key of Object.keys(patch) as (keyof ExperienceState)[]) {
    if (state[key] !== patch[key]) {
      changed = true;
      break;
    }
  }
  if (!changed) return;
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export const subscribeExperience = subscribe;

/** Subscribe to store changes where `pred(next, prev)` is true. */
export function onExperienceChange(
  pred: (next: ExperienceState, prev: ExperienceState) => boolean,
  cb: () => void,
) {
  let prev = state;
  return subscribe(() => {
    if (pred(state, prev)) cb();
    prev = state;
  });
}

export function useExperience<T>(selector: (s: ExperienceState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(initial),
  );
}

/* ------------------------------------------------------------------ */
/*  Mutable per-frame state — never triggers React renders             */
/* ------------------------------------------------------------------ */

export type ChapterInfo = {
  id: string;
  pose: string;
  group: string;
  top: number;
  height: number;
};

export const frame = {
  scrollY: 0,
  scrollLimit: 1,
  /** Overall page progress 0..1 */
  progress: 0,
  /** 0..1 intro reveal (driven by GSAP once loading is done). */
  intro: 0,
  mouse: { x: 0, y: 0 },
  /** Chapter pair currently being blended: from → to. */
  from: 0,
  to: 0,
  blend: 0,
  /** Local progress (0..1) inside the `from` / `to` chapters. */
  pFrom: 0,
  pTo: 0,
  /** Local progress inside the *active* chapter. */
  activeProgress: 0,
  chapters: [] as ChapterInfo[],
  /** dev-only: force a camera pose (see CameraController) */
  debugPose: null as string | null,
  /** dev-only: skip camera damping (headless screenshots run at ~3 fps) */
  debugSnap: false,
};
