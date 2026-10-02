"use client";

import Chapter from "@/components/sections/Chapter";
import { projects } from "@/data/projects";
import { useLanguage } from "@/hooks/useLanguage";
import { useExperience } from "@/lib/experience";
import { MobileActions } from "./ProjectMeta";
import { pad } from "@/lib/utils";
import type { Project } from "@/types/portfolio";

/**
 * One project = one scroll chapter. It contributes scroll distance and a
 * camera pose; the project itself is shown by <ProjectScreen> on the 3D
 * laptop (the scroll controller tells the screen which chapter is active).
 *
 * The only DOM is a tiny HUD label and screen-reader text — there is
 * deliberately NO project panel or image on the page.
 */
export default function ProjectItem({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const { dict, project: localize } = useLanguage();
  const narrow = useExperience((st) => st.narrow);
  const lp = localize(project);
  const number = projects.findIndex((p) => p.id === project.id) + 1;
  return (
    <Chapter
      id={`project-${project.id}`}
      pose={index % 2 === 1 ? "projectScreenFlip" : "projectScreen"}
      group="work"
      vh={125}
      side="none"
      autoReveal={false}
      label={project.title}
      innerClassName="items-end"
    >
      <div className="w-full px-5 pb-8 md:px-10 md:pb-10 lg:px-16">
        <div className="label flex items-center gap-4">
          <span className="text-signal">{dict.work.project} {pad(number)}</span>
          <span className="h-px w-8 bg-white/20" />
          <span>
            {pad(index + 1)}/{pad(total)}
          </span>
        </div>
        {narrow && <MobileActions project={project} />}
        {/* readable by assistive tech / crawlers; the visual lives on the monitor */}
        <div className="sr-only">
          <h3>{project.title}</h3>
          <p>{lp.description}</p>
          <p>{project.technologies.join(", ")}</p>
        </div>
      </div>
    </Chapter>
  );
}
