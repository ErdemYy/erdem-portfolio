"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { getExperience, useExperience } from "@/lib/experience";
import { site } from "@/data/site";
import { useLanguage } from "@/hooks/useLanguage";
import Chapter from "./Chapter";
import MaskLines from "@/components/ui/MaskLines";

/** Hero copy enters after the loader dissolves — in sync with the camera reveal. */
export default function HeroSection() {
  const introDone = useExperience((s) => s.introDone);
  const { dict } = useLanguage();
  const root = useRef<HTMLDivElement>(null);

  // hide until intro (client-side so the SSR markup stays readable without JS)
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = getExperience().reducedMotion;
    gsap.set(el.querySelectorAll("[data-mask]"), { yPercent: reduced ? 0 : 115, opacity: reduced ? 0 : 1 });
    gsap.set(el.querySelectorAll("[data-fade]"), { opacity: 0, y: reduced ? 0 : 16 });
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || !introDone) return;
    const reduced = getExperience().reducedMotion;
    const tl = gsap.timeline({ delay: reduced ? 0 : 1.1, defaults: { ease: "power4.out" } });
    tl.to(el.querySelectorAll("[data-mask]"), {
      yPercent: 0,
      opacity: 1,
      duration: reduced ? 0.5 : 1.5,
      stagger: 0.09,
    }).to(
      el.querySelectorAll("[data-fade]"),
      { opacity: 1, y: 0, duration: 1, stagger: 0.12 },
      "-=0.9",
    );
    return () => {
      tl.kill();
    };
  }, [introDone]);

  return (
    <Chapter
      id="hero"
      group="hero"
      vh={140}
      side="none"
      autoReveal={false}
      label={site.name}
      innerClassName="scrim-bottom items-end"
    >
      <div
        ref={root}
        className="flex w-full flex-col gap-10 px-5 pb-10 md:px-10 md:pb-14 lg:px-16"
      >
        <div>
          <p data-fade className="label mb-5 flex flex-wrap gap-x-4 !text-bone/80">
            {dict.profile.tagline.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </p>

          <MaskLines
            as="h1"
            label={`${site.name} — ${dict.profile.headline.join(" ")}`}
            lines={[site.nameUpper]}
            className="display display-lg text-bone max-md:!text-[2.1rem]"
          />

          <div className="mt-6 flex flex-col gap-1 md:mt-8">
            <MaskLines
              as="p"
              lines={[...dict.profile.headline]}
              className="display display-sm !leading-[1.05] tracking-[-0.03em] text-bone/85"
            />
          </div>
        </div>

        <div
          data-fade
          className="flex items-center gap-4 self-end md:absolute md:bottom-14 md:right-16 md:self-auto"
        >
          <span className="label !text-bone/70">{dict.hero.scroll}</span>
          <span className="relative block h-12 w-px overflow-hidden bg-white/15">
            <span className="scroll-cue-line absolute inset-0 bg-signal" />
          </span>
        </div>
      </div>
    </Chapter>
  );
}
