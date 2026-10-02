import { getExperience, setExperience, type PerfTier } from "./experience";

export type { PerfTier };

/**
 * Everything that costs GPU/CPU is decided HERE, per tier. Components read
 * `perfConfig[tier]` — they never sniff devices themselves.
 */
export type PerfConfig = {
  /** upper bound of the pixel ratio (the renderer still scales down on its own) */
  dprMax: number;
  /** MSAA. The high tier uses SMAA in the composer instead. */
  antialias: boolean;
  powerPreference: "high-performance" | "default" | "low-power";
  /** post-processing */
  composer: boolean;
  bloom: number;
  bloomResolution: number;
  noise: boolean;
  smaa: boolean;
  vignette: number;
  /** floating dust */
  particles: number;
  /** lights: ambient + hemisphere + key are always on */
  rimLight: boolean;
  accentLight: boolean;
  envResolution: number;
  /** animated bits */
  pulses: boolean;
  floatPanes: boolean;
  /** constellation detail: techs per category + cross-links */
  constellationTechs: number;
  constellationLinks: boolean;
  /** PC station + other decorative models */
  decor: boolean;
};

export const perfConfig: Record<PerfTier, PerfConfig> = {
  high: {
    dprMax: 2,
    antialias: false,
    powerPreference: "high-performance",
    composer: true,
    bloom: 1,
    bloomResolution: 0.5,
    noise: true,
    smaa: true,
    vignette: 0.75,
    particles: 650,
    rimLight: true,
    accentLight: true,
    envResolution: 256,
    pulses: true,
    floatPanes: true,
    constellationTechs: 99,
    constellationLinks: true,
    decor: true,
  },
  medium: {
    dprMax: 1.25,
    antialias: true,
    powerPreference: "default",
    composer: true,
    bloom: 0.55,
    bloomResolution: 0.3,
    noise: false,
    smaa: false,
    vignette: 0.55,
    particles: 240,
    rimLight: true,
    accentLight: true,
    envResolution: 128,
    pulses: false,
    floatPanes: true,
    constellationTechs: 3,
    constellationLinks: false,
    decor: false,
  },
  low: {
    dprMax: 1,
    antialias: false,
    powerPreference: "low-power",
    composer: false,
    bloom: 0,
    bloomResolution: 0.25,
    noise: false,
    smaa: false,
    vignette: 0,
    particles: 0,
    rimLight: false,
    accentLight: false,
    envResolution: 64,
    pulses: false,
    floatPanes: false,
    constellationTechs: 2,
    constellationLinks: false,
    decor: false,
  },
};

/* ------------------------------------------------------------------ */
/*  Capability detection — feature-detected, never UA-sniffed          */
/* ------------------------------------------------------------------ */

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
  type?: string;
};

export type GLProbe = { ok: boolean; renderer: string };

/** One throw-away context: is WebGL there, and is it real hardware? */
export function probeGL(): GLProbe {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return { ok: false, renderer: "" };
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return { ok: true, renderer };
  } catch {
    return { ok: false, renderer: "" };
  }
}

export type PerfDetection = {
  tier: PerfTier;
  /** how many chapters ahead to preload (0 = only the current one) */
  loadAhead: number;
  reason: string;
};

const PERF_KEY = "portfolio-perf";
const isTier = (v: unknown): v is PerfTier => v === "high" || v === "medium" || v === "low";

/**
 * HIGH   desktop / strong device
 * MEDIUM tablets, modern phones, modest desktops
 * LOW    low-end phones, software rendering, data-saver / slow networks
 *
 * `?perf=low|medium|high` forces a tier (remembered) — handy for testing.
 */
export function detectPerf(gl: GLProbe): PerfDetection {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: NetworkInformation;
  };
  const params = new URLSearchParams(window.location.search);
  const forced = params.get("perf");
  if (isTier(forced)) {
    try {
      window.localStorage.setItem(PERF_KEY, forced);
    } catch {
      /* ignore */
    }
  }
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(PERF_KEY);
  } catch {
    /* ignore */
  }
  const override = isTier(forced) ? forced : isTier(stored) ? stored : null;

  const mem = nav.deviceMemory; // Chromium only; capped at 8
  const cores = nav.hardwareConcurrency;
  const conn = nav.connection;
  const saveData = !!conn?.saveData;
  const slow = conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g";
  const metered = conn?.type === "cellular" || conn?.effectiveType === "3g";
  const software = /swiftshader|llvmpipe|software|microsoft basic render/i.test(gl.renderer);
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 600;
  const handheld = coarse || small;

  let tier: PerfTier;
  let reason: string;
  if (override) {
    tier = override;
    reason = "override";
  } else if (software) {
    tier = "low";
    reason = "software renderer";
  } else if (saveData || slow) {
    tier = "low";
    reason = "data saver / slow network";
  } else if (mem !== undefined && mem <= 2) {
    tier = "low";
    reason = "≤2 GB memory";
  } else if (handheld) {
    const weak = (mem !== undefined && mem <= 3) || (cores !== undefined && cores <= 4);
    tier = weak ? "low" : "medium";
    reason = weak ? "handheld, modest hardware" : "handheld";
  } else if ((cores !== undefined && cores <= 2) || (mem !== undefined && mem <= 4)) {
    tier = "medium";
    reason = "desktop, modest hardware";
  } else {
    tier = "high";
    reason = "desktop";
  }

  const loadAhead = saveData || slow ? 0 : metered || tier === "low" ? 1 : 2;
  return { tier, loadAhead, reason };
}

/** Frame-rate trouble: step down one tier (never back up — no flip-flopping). */
export function degradePerf() {
  const { perf } = getExperience();
  const next: PerfTier = perf === "high" ? "medium" : "low";
  if (next !== perf) setExperience({ perf: next });
}
