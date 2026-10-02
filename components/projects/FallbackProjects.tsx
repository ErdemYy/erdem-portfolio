"use client";

import ProjectVisual from "./ProjectVisual";
import { ProjectLinks, StatusChip, TechList } from "./ProjectMeta";
import { projects } from "@/data/projects";
import { useLanguage } from "@/hooks/useLanguage";
import { pad } from "@/lib/utils";
import type { Project } from "@/types/portfolio";

/**
 * Shown instead of the 3D monitors when WebGL is unavailable: the same
 * projects as a calm editorial list — image, text, links. No 3D, no blank space.
 */
export default function FallbackProjects({ items }: { items: Project[] }) {
  const { dict, project } = useLanguage();
  return (
    <section
      aria-label={dict.work.label}
      className="pointer-events-auto relative z-10 mx-auto grid max-w-5xl gap-14 px-5 pb-20 md:px-10"
    >
      {items.map((raw) => {
        const p = project(raw);
        const n = projects.findIndex((x) => x.id === raw.id) + 1;
        return (
          <article key={raw.id} className="grid gap-6 border-t border-line pt-8 md:grid-cols-2 md:gap-10">
            <div className="aspect-[10/7] overflow-hidden border border-line bg-graphite">
              <ProjectVisual project={raw} index={n} quiet />
            </div>
            <div className="flex flex-col gap-4">
              <div className="label">
                <span className="text-signal">
                  {dict.work.project} {pad(n)}
                </span>
              </div>
              <h3 className="display display-md text-bone">{p.title}</h3>
              <p className="body-copy">{p.description}</p>
              <TechList items={p.technologies} />
              <StatusChip status={p.status} />
              <ProjectLinks project={raw} />
            </div>
          </article>
        );
      })}
    </section>
  );
}
