"use client";

import Chapter from "@/components/sections/Chapter";
import { featuredProject } from "@/data/projects";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * FEATURED WORK. The camera closes in on the desk monitor, which boots into
 * the featured project (see DeskScreen). DOM here is only a HUD label and
 * screen-reader text.
 */
export default function FeaturedProject() {
  const { dict, project } = useLanguage();
  const p = project(featuredProject);
  return (
    <Chapter
      id="featured"
      group="work"
      vh={200}
      side="none"
      autoReveal={false}
      label={dict.work.featured}
      innerClassName="items-end"
    >
      <div className="w-full px-5 pb-8 md:px-10 md:pb-10 lg:px-16">
        <div className="label flex items-center gap-4">
          <span className="text-signal">★</span>
          <span className="h-px w-8 bg-white/20" />
          <span>{dict.work.featured}</span>
        </div>
        <div className="sr-only">
          <h3>{p.title}</h3>
          <p>{p.longDescription ?? p.description}</p>
          <p>{p.technologies.join(", ")}</p>
        </div>
      </div>
    </Chapter>
  );
}
