"use client";

import { useEffect, useRef } from "react";
import Chapter from "./Chapter";
import MaskLines from "@/components/ui/MaskLines";
import SectionLabel from "@/components/ui/SectionLabel";
import { experience, journeyPhaseKeys } from "@/data/experience";
import { useLanguage } from "@/hooks/useLanguage";
import { plain, rich } from "@/i18n/rich";
import { gsap } from "@/lib/gsap";
import { getExperience } from "@/lib/experience";

/**
 * 07 — BUILD → LEARN → EXPERIMENT → SHIP. A line fills as you scroll and
 * each phase lights up in turn (scrubbed, so it reverses exactly).
 * Real entries from data/experience.ts appear underneath when present.
 */
export default function JourneySection() {
  const root = useRef<HTMLDivElement>(null);
  const { dict, loc } = useLanguage();
  const j = dict.journey;

  useEffect(() => {
    const el = root.current;
    const host = el?.closest("section");
    if (!el || !host) return;
    const reduced = getExperience().reducedMotion;
    const ctx = gsap.context(() => {
      const phases = el.querySelectorAll<HTMLElement>("[data-phase]");
      const dots = el.querySelectorAll<HTMLElement>("[data-dot]");
      const line = el.querySelector<HTMLElement>("[data-line]");
      if (reduced) {
        phases.forEach((p) => (p.style.opacity = "1"));
        if (line) line.style.transform = "scale(1)";
        return;
      }
      gsap.set(phases, { opacity: 0.18 });
      if (line) gsap.set(line, { scaleX: 0, scaleY: 0, transformOrigin: "0 0" });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: host, start: "top 35%", end: "bottom 70%", scrub: true },
      });
      if (line) tl.to(line, { scaleX: 1, scaleY: 1, duration: phases.length }, 0);
      phases.forEach((p, i) => {
        tl.to(p, { opacity: 1, duration: 0.5 }, i * 0.9);
        if (dots[i]) tl.to(dots[i], { backgroundColor: "#ff5b2e", borderColor: "#ff5b2e", duration: 0.3 }, i * 0.9);
      });
    }, host);
    return () => ctx.revert();
  }, []);

  return (
    <Chapter
      id="journey"
      group="journey"
      vh={170}
      side="none"
      label={j.label}
      innerClassName="bg-ink/45"
    >
      <div ref={root} className="w-full px-5 md:px-10 lg:px-16">
        <SectionLabel index="07" className="mb-8">
          {j.kicker}
        </SectionLabel>
        <MaskLines
          label={plain(j.headline)}
          className="display display-md mb-12 text-bone"
          lines={j.headline.map(rich)}
        />

        <div className="relative">
          {/* horizontal on desktop, vertical on mobile */}
          <div className="absolute left-[3px] top-1 hidden h-px w-full bg-white/10 md:block" />
          <div
            data-line
            className="absolute left-[3px] top-1 hidden h-px w-full origin-left bg-signal md:block"
          />
          <div className="absolute bottom-0 left-[3px] top-1 w-px bg-white/10 md:hidden" />

          <ol className="grid gap-8 md:grid-cols-4 md:gap-6">
            {journeyPhaseKeys.map((key, i) => (
              <li key={key} data-phase className="relative pl-7 md:pl-0 md:pt-8">
                <span
                  data-dot
                  className="absolute left-0 top-1.5 block h-[7px] w-[7px] rounded-full border border-white/40 bg-ink md:top-0"
                />
                <div className="label mb-2 text-signal">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="display display-sm mb-3 !leading-none">{j.phases[key].title}</h3>
                <p className="max-w-[16rem] text-[0.92rem] leading-relaxed text-bone/65">
                  {j.phases[key].text}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {experience.length > 0 && (
          <ul className="mt-14 grid gap-4 border-t border-line pt-6 md:grid-cols-2">
            {experience.map((e) => (
              <li key={e.id} data-fade>
                <div className="label mb-1">
                  {j.kinds[e.kind]}
                  {e.period ? ` · ${e.period}` : ""}
                </div>
                <div className="text-bone">{loc(e.title)}</div>
                {e.organization && <div className="text-bone/60">{loc(e.organization)}</div>}
                {e.description && <p className="mt-1 text-sm text-bone/55">{loc(e.description)}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Chapter>
  );
}
