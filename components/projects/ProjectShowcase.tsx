"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Chapter from "@/components/sections/Chapter";
import MaskLines from "@/components/ui/MaskLines";
import SectionLabel from "@/components/ui/SectionLabel";
import ProjectFilters from "./ProjectFilters";
import ProjectItem from "./ProjectItem";
import FeaturedProject from "./FeaturedProject";
import { featuredProject, projects } from "@/data/projects";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getExperience, setExperience } from "@/lib/experience";
import { useLanguage } from "@/hooks/useLanguage";
import { plain, rich } from "@/i18n/rich";

/**
 * 04 — PROJECTS: intro + filters, the featured chapter, then one immersive
 * block per project. Filtering swaps blocks with a short transition and asks
 * the scroll controller to re-measure the chapters.
 */
export default function ProjectShowcase() {
  const { dict } = useLanguage();
  const w = dict.work;
  const [filter, setFilter] = useState("all");
  const list = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const rest = useMemo(
    () => projects.filter((p) => p.id !== featuredProject.id),
    [],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rest.length };
    rest.forEach((p) => (c[p.category] = (c[p.category] ?? 0) + 1));
    return c;
  }, [rest]);

  const visible = useMemo(
    () => (filter === "all" ? rest : rest.filter((p) => p.category === filter)),
    [filter, rest],
  );

  // the laptop screen lists exactly what the chapters list
  useEffect(() => {
    setExperience({ projectIds: visible.map((p) => p.id) });
  }, [visible]);

  const change = (key: string) => {
    if (key === filter) return;
    const el = list.current;
    if (!el || getExperience().reducedMotion) {
      setFilter(key);
      return;
    }
    gsap.to(el, {
      opacity: 0,
      y: 24,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => setFilter(key),
    });
  };

  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = list.current;
    if (el && !getExperience().reducedMotion) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", clearProps: "transform" },
      );
    }
    window.dispatchEvent(new Event("chapters:remeasure"));
    ScrollTrigger.refresh();
  }, [filter]);

  return (
    <>
      <Chapter id="work" pose="work" group="work" vh={130} side="left" label={w.label}>
        <div className="w-full px-5 md:px-10 lg:px-16">
          <SectionLabel index="04" className="mb-8">
            {w.kicker}
          </SectionLabel>
          <MaskLines
            label={plain(w.headline)}
            className="display display-lg text-bone"
            lines={w.headline.map(rich)}
          />
          <div data-fade className="mt-10">
            <ProjectFilters value={filter} onChange={change} counts={counts} />
          </div>
        </div>
      </Chapter>

      <FeaturedProject />

      <div ref={list}>
        {visible.length === 0 ? (
          <Chapter id="project-empty" pose="projectA" group="work" vh={90} side="left">
            <div className="w-full px-5 md:px-10 lg:px-16">
              <p className="label">{w.empty}</p>
            </div>
          </Chapter>
        ) : (
          visible.map((p, i) => (
            <ProjectItem key={p.id} project={p} index={i} total={visible.length} />
          ))
        )}
      </div>
    </>
  );
}
