"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getExperience } from "@/lib/experience";
import { cn } from "@/lib/utils";

type Props = {
  /** DOM id + chapter id (used as the scroll anchor). */
  id: string;
  /** Camera waypoint key (defaults to `id`). */
  pose?: string;
  /** Progress-indicator group. */
  group: string;
  /** Scroll length in viewport heights (tablet / desktop). */
  vh?: number;
  /** Phones get a shorter chapter — defaults to ~62% of `vh`, never below 100 (the pinned stage is 100svh). */
  mobileVh?: number;
  /** Which side the copy sits on — decides the scrim. */
  side?: "left" | "right" | "none";
  /** Hero drives its own entrance. */
  autoReveal?: boolean;
  label?: string;
  className?: string;
  innerClassName?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * One scroll chapter = one camera pose. The section supplies scroll distance;
 * the content is sticky for the whole length, fades in/out with the scroll
 * (scrubbed, so reverse scrolling is exact) and reveals its `[data-mask]`,
 * `[data-fade]` children when the chapter enters.
 */
export default function Chapter({
  id,
  pose,
  group,
  vh = 130,
  mobileVh,
  side = "left",
  autoReveal = true,
  label,
  className,
  innerClassName,
  style,
  children,
}: Props) {
  const section = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    const content = inner.current;
    if (!el || !content) return;
    const reduced = getExperience().reducedMotion;
    const ctx = gsap.context(() => {
      /* scrubbed in / hold / out (only meaningful alongside the 3D scene) */
      const travel = reduced ? 0 : 36;
      if (getExperience().webgl)
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        })
        .fromTo(content, { autoAlpha: 0, y: travel }, { autoAlpha: 1, y: 0, duration: 0.16 })
        .to(content, { autoAlpha: 1, duration: 0.64 })
        .to(content, { autoAlpha: 0, y: -travel, duration: 0.2 });

      /* line / fade reveals (reversible) */
      if (autoReveal) {
        const masks = el.querySelectorAll<HTMLElement>("[data-mask]");
        const fades = el.querySelectorAll<HTMLElement>("[data-fade]");
        if (masks.length) gsap.set(masks, { yPercent: reduced ? 0 : 115, opacity: reduced ? 0 : 1 });
        if (fades.length) gsap.set(fades, { opacity: 0, y: reduced ? 0 : 24 });

        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "power4.out" },
        });
        if (masks.length)
          tl.to(masks, { yPercent: 0, opacity: 1, duration: reduced ? 0.4 : 1.1, stagger: 0.07 }, 0);
        if (fades.length)
          tl.to(fades, { opacity: 1, y: 0, duration: reduced ? 0.4 : 0.9, stagger: 0.06 }, 0.25);

        ScrollTrigger.create({
          trigger: el,
          start: "top 62%",
          end: "bottom 38%",
          onToggle: (self) => (self.isActive ? tl.timeScale(1).play() : tl.timeScale(1.6).reverse()),
        });
      }
    }, el);
    return () => ctx.revert();
  }, [autoReveal]);

  return (
    <section
      ref={section}
      id={id}
      data-chapter={id}
      data-pose={pose ?? id}
      data-group={group}
      aria-label={label}
      className={cn("chapter pointer-events-none relative overflow-x-clip", className)}
      style={{
        "--ch-d": `${vh}svh`,
        "--ch-m": `${mobileVh ?? Math.max(100, Math.round(vh * 0.62))}svh`,
        ...style,
      } as CSSProperties}
    >
      <div
        ref={inner}
        className={cn(
          "chapter-inner sticky top-0 flex h-[100svh] w-full items-center",
          side === "left" && "scrim-left",
          side === "right" && "scrim-right",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
