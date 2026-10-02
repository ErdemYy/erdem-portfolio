"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { routeTransition } from "@/lib/transition";
import { getExperience } from "@/lib/experience";

/**
 * Shared-element style page transition: the clicked project visual grows to
 * fill the screen, the route changes underneath, then the cover dissolves.
 * Deliberately simple (one div, one tween) so it can't get fragile.
 */
export default function RouteTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const cover = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const first = useRef(true);

  useEffect(() => {
    return routeTransition.register(({ rect, color, href }) => {
      const el = cover.current;
      if (!el || pending.current) {
        router.push(href);
        return;
      }
      pending.current = true;
      const reduced = getExperience().reducedMotion;
      gsap.set(el, {
        display: "block",
        opacity: 1,
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        backgroundColor: "#0d0e11",
        borderColor: color,
      });
      gsap.to(el, {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        duration: reduced ? 0.01 : 0.85,
        ease: "power4.inOut",
        onComplete: () => router.push(href),
      });
    });
  }, [router]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = cover.current;
    if (!el || !pending.current) return;
    window.scrollTo(0, 0);
    gsap.to(el, {
      opacity: 0,
      duration: 0.7,
      delay: 0.25,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(el, { display: "none" });
        pending.current = false;
      },
    });
  }, [pathname]);

  return (
    <div
      ref={cover}
      aria-hidden="true"
      className="pointer-events-none fixed z-[80] hidden border"
    />
  );
}
