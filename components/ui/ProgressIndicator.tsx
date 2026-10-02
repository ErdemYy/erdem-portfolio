"use client";

import { useEffect, useRef } from "react";
import { frame, useExperience } from "@/lib/experience";
import { gsap } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/lenis";
import { useLanguage } from "@/hooks/useLanguage";
import { cn, pad } from "@/lib/utils";

/** Labels: `progress.*` in the dictionaries. */
export const groups = [
  { key: "hero", target: "hero" },
  { key: "about", target: "about" },
  { key: "build", target: "build" },
  { key: "work", target: "work" },
  { key: "stack", target: "stack" },
  { key: "engineering", target: "engineering" },
  { key: "journey", target: "journey" },
  { key: "open", target: "open" },
  { key: "contact", target: "contact" },
] as const;

/** Chapter ticks + thin fill. Not a scrollbar replacement — just orientation. */
export default function ProgressIndicator() {
  const { dict } = useLanguage();
  const active = useExperience((s) => s.group);
  const introDone = useExperience((s) => s.introDone);
  const fill = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const index = Math.max(
    0,
    groups.findIndex((g) => g.key === active),
  );

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (fill.current) fill.current.style.transform = `scaleY(${frame.progress})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (introDone && root.current) {
      gsap.to(root.current, { opacity: 1, duration: 1.2, delay: 0.6 });
    }
  }, [introDone]);

  return (
    <div
      ref={root}
      className="pointer-events-none fixed bottom-6 right-5 z-40 opacity-0 md:bottom-auto md:right-10 md:top-1/2 md:-translate-y-1/2"
      aria-hidden={false}
    >
      {/* compact counter (mobile) */}
      <div className="label text-right md:hidden" aria-live="polite">
        {pad(index + 1)} <span className="opacity-40">/ {pad(groups.length)}</span>
      </div>

      {/* ticks (desktop) */}
      <nav aria-label={dict.ui.sectionProgress} className="relative hidden md:block">
        <div className="absolute bottom-0 right-[3px] top-0 w-px bg-white/10">
          <div
            ref={fill}
            className="h-full w-px origin-top bg-signal"
            style={{ transform: "scaleY(0)" }}
          />
        </div>
        <ul className="relative flex flex-col items-end gap-4">
          {groups.map((g, i) => (
            <li key={g.key} className="pointer-events-auto">
              <button
                type="button"
                onClick={() => scrollToTarget(g.target)}
                className="group flex items-center gap-3"
                aria-label={`${dict.ui.goTo} ${dict.progress[g.key]}`}
                aria-current={i === index ? "true" : undefined}
              >
                <span
                  className={cn(
                    "label transition-all duration-500",
                    i === index
                      ? "translate-x-0 !text-bone opacity-100"
                      : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                  )}
                >
                  {pad(i + 1)} {dict.progress[g.key]}
                </span>
                <span
                  className={cn(
                    "block h-[7px] w-[7px] rounded-full border transition-colors duration-500",
                    i === index
                      ? "border-signal bg-signal"
                      : i < index
                        ? "border-bone/70 bg-ink"
                        : "border-white/25 bg-ink",
                  )}
                />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
