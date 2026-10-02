"use client";

import { useEffect } from "react";
import { setExperience, type Breakpoint } from "@/lib/experience";
import { audio } from "@/lib/audio";
import { detectPerf, probeGL } from "@/lib/performance";

const breakpointOf = (w: number): Breakpoint =>
  w < 380 ? "xs" : w < 768 ? "sm" : w < 1024 ? "md" : w < 1536 ? "lg" : "xl";

/**
 * Resolves viewport / input / motion / capability signals once on the client
 * and keeps them current on resize and orientation change. Everything is
 * feature-detected; unsupported APIs simply fall back to safe defaults.
 */
export default function DeviceFlags({
  audioFiles = {},
}: {
  audioFiles?: Record<string, boolean>;
}) {
  useEffect(() => {
    audio.configure(audioFiles);
    const root = document.documentElement;
    const mqMobile = window.matchMedia("(max-width: 767px)");
    const mqCoarse = window.matchMedia("(pointer: coarse)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqNarrow = window.matchMedia("(max-width: 899px)");
    const mqShort = window.matchMedia("(max-height: 520px) and (orientation: landscape)");

    const sync = () => {
      const reduced = mqReduced.matches;
      root.classList.toggle("reduced-motion", reduced);
      root.classList.toggle("has-custom-cursor", !mqCoarse.matches && !mqMobile.matches);
      root.classList.toggle("landscape-short", mqShort.matches);
      setExperience({
        mobile: mqMobile.matches,
        narrow: mqNarrow.matches,
        coarse: mqCoarse.matches,
        reducedMotion: reduced,
        landscapeShort: mqShort.matches,
        bp: breakpointOf(window.innerWidth),
      });
    };

    sync();

    const gl = probeGL();
    const perf = detectPerf(gl);
    root.classList.toggle("no-webgl", !gl.ok);
    root.dataset.perf = perf.tier;
    setExperience({
      webgl: gl.ok,
      perf: perf.tier,
      loadAhead: perf.loadAhead,
      ready: true,
    });

    const media = [mqMobile, mqCoarse, mqReduced, mqNarrow, mqShort];
    media.forEach((m) => m.addEventListener("change", sync));
    window.addEventListener("resize", sync, { passive: true });
    window.addEventListener("orientationchange", sync);
    return () => {
      media.forEach((m) => m.removeEventListener("change", sync));
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
