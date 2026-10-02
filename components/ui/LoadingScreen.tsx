"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { frame, getExperience, setExperience, useExperience } from "@/lib/experience";
import { site } from "@/data/site";
import { useLanguage } from "@/hooks/useLanguage";

const FAILSAFE_MS = 20000;

/**
 * Real loading state: the number is three's LoadingManager progress while the
 * hero environment streams in. When the hero model is in the scene graph the
 * screen dissolves and the camera reveal runs. No fake percentages.
 */
export default function LoadingScreen() {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const [gone, setGone] = useState(false);
  const display = useRef({ v: 0 });
  const done = useRef(false);

  const { dict } = useLanguage();
  const progress = useExperience((s) => s.loadProgress);
  const heroReady = useExperience((s) => s.heroReady);
  const webgl = useExperience((s) => s.webgl);
  const ready = useExperience((s) => s.ready);

  const target = heroReady || (ready && !webgl) ? 100 : progress;

  useEffect(() => {
    gsap.to(display.current, {
      v: target,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        const v = Math.round(display.current.v);
        setShown(v);
        if (bar.current) bar.current.style.transform = `scaleX(${display.current.v / 100})`;
      },
    });
  }, [target]);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    const reduced = getExperience().reducedMotion;
    gsap.to(root.current, {
      opacity: 0,
      duration: reduced ? 0.2 : 0.9,
      delay: 0.25,
      ease: "power2.inOut",
      onStart: () => {
        setExperience({ introDone: true });
        gsap.to(frame, {
          intro: 1,
          duration: reduced ? 0.6 : 3.6,
          ease: "power2.inOut",
        });
      },
      onComplete: () => setGone(true),
    });
  };

  // finished loading → leave
  useEffect(() => {
    if (shown >= 100 && target >= 100) finish();
  }, [shown, target]);

  // never trap the visitor behind a loader
  useEffect(() => {
    const t = window.setTimeout(finish, FAILSAFE_MS);
    return () => window.clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-ink px-6 py-8 md:px-12 md:py-12"
    >
      <div className="flex items-start justify-between">
        <span className="label text-bone">{site.nameUpper}</span>
        <span className="label">{dict.profile.role}</span>
      </div>

      <div>
        <div className="display display-lg tabular-nums text-bone">
          {String(shown).padStart(3, "0")}
          <span className="text-signal">%</span>
        </div>
        <div className="mt-6 h-px w-full max-w-md bg-white/10">
          <div
            ref={bar}
            className="h-px origin-left bg-signal"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <p className="label mt-4">{dict.ui.loading}</p>
      </div>
    </div>
  );
}
