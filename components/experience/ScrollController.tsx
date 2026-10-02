"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis, scrollToTarget } from "@/lib/lenis";
import {
  frame,
  getExperience,
  onExperienceChange,
  setExperience,
  type ChapterInfo,
} from "@/lib/experience";
import { clamp, smootherstep } from "@/lib/utils";

/**
 * Owns Lenis + the scroll → chapter mapping.
 *
 * Every `[data-chapter]` element is a chapter. The camera reference line sits
 * in the vertical middle of the viewport; while it travels through a chapter
 * the pose is held (with a small orbit/dolly), and around the boundary
 * between two chapters it blends A → B. All of this is written into the
 * mutable `frame` object — React is only notified when the chapter changes.
 */
export default function ScrollController() {
  useEffect(() => {
    const reduced = getExperience().reducedMotion;

    const lenis = new Lenis({
      lerp: reduced ? 1 : 0.085,
      smoothWheel: !reduced,
      wheelMultiplier: 0.9,
      autoRaf: false,
    });
    setLenis(lenis);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    /* ---------------- chapter measurement ---------------- */
    const measure = () => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>("[data-chapter]"),
      );
      const scrollY = window.scrollY;
      const list: ChapterInfo[] = els.map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          id: el.dataset.chapter ?? "",
          pose: el.dataset.pose ?? el.dataset.chapter ?? "hero",
          group: el.dataset.group ?? "hero",
          top: rect.top + scrollY,
          height: Math.max(rect.height, 1),
        };
      });
      frame.chapters = list;
      frame.scrollLimit = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      compute(lenis.scroll);
    };

    /* ---------------- scroll → chapter pair + blend ---------------- */
    const compute = (y: number) => {
      const cs = frame.chapters;
      const n = cs.length;
      frame.scrollY = y;
      frame.progress = clamp(y / frame.scrollLimit, 0, 1);
      if (!n) return;

      const vh = window.innerHeight;
      const r = y + vh * 0.5;

      let i = 0;
      for (let k = 0; k < n; k++) {
        if (cs[k].top <= r) i = k;
        else break;
      }

      const A = cs[i];
      const next = cs[i + 1];
      const prev = cs[i - 1];
      let from = i;
      let to = i;
      let blend = 0;

      if (next) {
        const w = Math.min(vh * 0.55, A.height * 0.35, next.height * 0.35);
        const b = A.top + A.height;
        if (r > b - w) {
          from = i;
          to = i + 1;
          blend = smootherstep((r - (b - w)) / (2 * w));
        }
      }
      if (to === from && prev) {
        const w = Math.min(vh * 0.55, A.height * 0.35, prev.height * 0.35);
        if (r < A.top + w) {
          from = i - 1;
          to = i;
          blend = smootherstep((r - (A.top - w)) / (2 * w));
        }
      }

      const local = (c: ChapterInfo) => clamp((r - c.top) / c.height, 0, 1);
      frame.from = from;
      frame.to = to;
      frame.blend = blend;
      frame.pFrom = local(cs[from]);
      frame.pTo = local(cs[to]);

      const active = blend < 0.5 ? from : to;
      frame.activeProgress = blend < 0.5 ? frame.pFrom : frame.pTo;

      const chapter = cs[active];
      const patch: Parameters<typeof setExperience>[0] = {
        chapter: active,
        chapterId: chapter.id,
        group: chapter.group,
      };
      if (chapter.id.startsWith("project-") && chapter.id !== "project-empty") {
        patch.projectId = chapter.id.slice("project-".length);
      }
      if (chapter.id === "laptop") {
        patch.laptopTab = clamp(
          Math.floor(((frame.activeProgress - 0.12) / 0.76) * 4),
          0,
          3,
        );
      }
      setExperience(patch);
    };

    lenis.on("scroll", () => {
      ScrollTrigger.update();
      compute(lenis.scroll);
    });

    /* ---------------- observers ---------------- */
    const ro = new ResizeObserver(() => {
      measure();
      ScrollTrigger.refresh();
    });
    ro.observe(document.body);

    const onRemeasure = () => {
      measure();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onRemeasure);
    window.addEventListener("chapters:remeasure", onRemeasure);
    document.fonts?.ready.then(onRemeasure);
    measure();

    /* ---------------- lock scroll while loading / menu ---------------- */
    const syncLock = () => {
      const s = getExperience();
      if (!s.introDone || s.menuOpen) lenis.stop();
      else lenis.start();
    };
    syncLock();
    const unsub = onExperienceChange(
      (s, p) => s.introDone !== p.introDone || s.menuOpen !== p.menuOpen,
      syncLock,
    );

    /* ---------------- deep link (#work etc.) ---------------- */
    let hashTimer: number | undefined;
    const goHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) scrollToTarget(hash, true);
    };
    const unsubIntro = onExperienceChange(
      (s, p) => s.introDone && !p.introDone,
      () => {
        hashTimer = window.setTimeout(goHash, 50);
      },
    );

    return () => {
      unsub();
      unsubIntro();
      if (hashTimer) window.clearTimeout(hashTimer);
      ro.disconnect();
      window.removeEventListener("resize", onRemeasure);
      window.removeEventListener("chapters:remeasure", onRemeasure);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
