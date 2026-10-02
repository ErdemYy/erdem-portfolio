"use client";

import { useEffect } from "react";
import { setExperience } from "@/lib/experience";
import { audio } from "@/lib/audio";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Resolves viewport / input / motion preferences once on the client. */
export default function DeviceFlags({
  audioFiles = {},
}: {
  audioFiles?: Record<string, boolean>;
}) {
  useEffect(() => {
    audio.configure(audioFiles);
    const mqMobile = window.matchMedia("(max-width: 767px)");
    const mqCoarse = window.matchMedia("(pointer: coarse)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqNarrow = window.matchMedia("(max-width: 899px)");

    const sync = () => {
      const reduced = mqReduced.matches;
      document.documentElement.classList.toggle("reduced-motion", reduced);
      document.documentElement.classList.toggle(
        "has-custom-cursor",
        !mqCoarse.matches && !mqMobile.matches,
      );
      setExperience({
        mobile: mqMobile.matches,
        narrow: mqNarrow.matches,
        coarse: mqCoarse.matches,
        reducedMotion: reduced,
      });
    };

    sync();
    setExperience({ webgl: hasWebGL(), ready: true });

    [mqMobile, mqCoarse, mqReduced, mqNarrow].forEach((m) =>
      m.addEventListener("change", sync),
    );
    return () =>
      [mqMobile, mqCoarse, mqReduced, mqNarrow].forEach((m) =>
        m.removeEventListener("change", sync),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
