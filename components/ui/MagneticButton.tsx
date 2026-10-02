"use client";

import { useEffect, useRef, type ComponentProps } from "react";
import { gsap } from "@/lib/gsap";
import { getExperience } from "@/lib/experience";
import { cn } from "@/lib/utils";

type Props = ComponentProps<"a"> & { variant?: "outline" | "solid" };

/**
 * Outline button with a subtle magnetic pull toward the pointer.
 * The pull is skipped for touch input and reduced motion.
 */
export default function MagneticButton({
  variant = "outline",
  className,
  children,
  ...rest
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { coarse, reducedMotion } = getExperience();
    if (coarse || reducedMotion) return;

    const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * 0.25);
      y((e.clientY - (r.top + r.height / 2)) * 0.25);
    };
    const leave = () => {
      x(0);
      y(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <a
      ref={ref}
      className={cn("btn pointer-events-auto", variant === "solid" && "btn-solid", className)}
      {...rest}
    >
      {children}
    </a>
  );
}
