import type Lenis from "lenis";

/** Module-level handle so UI (nav, links) can drive the same Lenis instance. */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;

export function scrollToTarget(target: string | number, immediate = false) {
  const lenis = instance;
  const el =
    typeof target === "string" ? document.getElementById(target) : null;
  if (typeof target === "string" && !el) return;

  if (lenis) {
    lenis.scrollTo(typeof target === "string" ? (el as HTMLElement) : target, {
      duration: immediate ? 0 : 2.2,
      immediate,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
  } else if (el) {
    el.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
  } else if (typeof target === "number") {
    window.scrollTo({ top: target });
  }
}
