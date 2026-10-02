"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getExperience } from "@/lib/experience";

/** Scroll reveals for the case-study page (native scroll, no WebGL). */
export default function DetailEffects() {
  useEffect(() => {
    const reduced = getExperience().reducedMotion;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: reduced ? 0 : 40 },
          {
            opacity: 1,
            y: 0,
            duration: reduced ? 0.3 : 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
          },
        );
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(t);
  }, []);

  return null;
}
