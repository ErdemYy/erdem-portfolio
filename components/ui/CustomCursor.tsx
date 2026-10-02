"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useExperience } from "@/lib/experience";

/** Small dot; a ring appears over interactive elements. Desktop only. */
export default function CustomCursor() {
  const disabled = useExperience((s) => s.coarse || s.mobile || !s.ready);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;
    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return;

    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3" });

    gsap.set([d, r], { x: -100, y: -100 });

    const onMove = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const setState = (target: EventTarget | null) => {
      const el = (target as HTMLElement | null)?.closest?.(
        "a, button, [data-cursor]",
      ) as HTMLElement | null;
      if (!el) {
        gsap.to(r, { opacity: 0, scale: 0.6, duration: 0.3 });
        gsap.to(d, { scale: 1, duration: 0.3 });
        return;
      }
      const big = el.dataset.cursor === "view";
      gsap.to(r, { opacity: 1, scale: big ? 1.9 : 1, duration: 0.35, ease: "power3.out" });
      gsap.to(d, { scale: big ? 0 : 1.6, duration: 0.3 });
    };

    const onOver = (e: PointerEvent) => setState(e.target);
    const onLeave = () => gsap.to([d, r], { opacity: 0, duration: 0.2 });
    const onEnter = () => gsap.to(d, { opacity: 1, duration: 0.2 });
    const onDown = () => gsap.to(r, { scale: 0.8, duration: 0.15 });
    const onUp = () => gsap.to(r, { scale: 1, duration: 0.25 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [disabled]);

  if (disabled) return null;
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
