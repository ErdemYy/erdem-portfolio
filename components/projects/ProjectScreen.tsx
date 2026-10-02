"use client";

import type { CSSProperties } from "react";
import ProjectScreenContent from "./ProjectScreenContent";
import { projects } from "@/data/projects";
import { useExperience } from "@/lib/experience";
import { useLanguage } from "@/hooks/useLanguage";
import type { Project } from "@/types/portfolio";
import { pad } from "@/lib/utils";

/**
 * The project application running on a 3D monitor.
 *
 *  • `project` given  → that project (e.g. the featured one on the desk monitor)
 *  • otherwise        → whichever project the scroll chapter is on
 *
 * Re-renders only when the project changes (a handful of times per visit) —
 * scrolling itself never touches React.
 */
export default function ProjectScreen({ project }: { project?: Project }) {
  const activeId = useExperience((s) => s.projectId);
  const ids = useExperience((s) => s.projectIds);
  const narrow = useExperience((s) => s.narrow);
  const { dict } = useLanguage();

  const p =
    project ??
    projects.find((x) => x.id === activeId) ??
    projects.find((x) => !x.featured) ??
    projects[0];

  const list = ids.length ? ids : projects.filter((x) => !x.featured).map((x) => x.id);
  const position = project ? 1 : Math.max(1, list.indexOf(p.id) + 1);
  const total = project ? 1 : list.length;
  const number = projects.findIndex((x) => x.id === p.id) + 1;

  return (
    <div
      className="flex h-full w-full flex-col bg-[#0e1014] text-[#c9ced8]"
      style={{ "--a": p.accent ?? "#ff5b2e" } as CSSProperties}
    >
      {/* window chrome */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-2.5">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="ml-2 flex-1 truncate font-mono text-[11px] tracking-[0.22em] text-white/45">
          erdem / {dict.screen.projects} / {p.id}
        </span>
        <span className="font-mono text-[11px] tracking-[0.2em] text-white/40">
          {pad(position)}/{pad(total)}
        </span>
      </div>
      <div className="h-[2px] bg-white/5">
        <div className="h-full bg-[var(--a)] transition-[width] duration-500" style={{ width: `${(position / total) * 100}%` }} />
      </div>

      {/* keyed: a new project "opens" with a clip reveal */}
      <div key={p.id} className="screen-swap min-h-0 flex-1">
        <ProjectScreenContent
          project={p}
          number={number}
          position={position}
          total={total}
          compact={narrow}
        />
      </div>
    </div>
  );
}
