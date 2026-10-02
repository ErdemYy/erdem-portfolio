"use client";

import type { Project } from "@/types/portfolio";
import { cn, realLink } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import TransitionLink from "@/components/ui/TransitionLink";

/** Honest status chip — a concept never looks finished. */
export function StatusChip({ status }: { status: Project["status"] }) {
  const { dict } = useLanguage();
  return (
    <span className="label inline-flex items-center gap-2.5 !text-bone/80">
      <span
        className={cn(
          "block h-[7px] w-[7px] rounded-full border",
          status === "completed" && "border-bone bg-bone",
          status === "in-progress" && "border-signal bg-signal",
          status === "concept" && "border-bone/60 bg-transparent",
        )}
      />
      {dict.status[status]}
    </span>
  );
}

/** Technology names are never translated. */
export function TechList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
      {items.map((t, i) => (
        <li
          key={`${t}-${i}`}
          className={cn(
            "font-mono text-[0.8rem] tracking-wide text-bone/80",
            t.startsWith("[") && "placeholder-text",
          )}
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

/**
 * Link row. Buttons only render for data that exists — no empty buttons,
 * no invented URLs.
 */
export function ProjectLinks({
  project,
  detail = true,
  sourceSelector,
}: {
  project: Project;
  detail?: boolean;
  sourceSelector?: string;
}) {
  const { dict } = useLanguage();
  const github = realLink(project.github);
  const live = realLink(project.live);
  return (
    <div className="pointer-events-auto flex flex-wrap gap-3">
      {detail && (
        <TransitionLink
          href={`/projects/${project.id}`}
          sourceSelector={sourceSelector}
          accent={project.accent}
          className="btn btn-solid"
        >
          {dict.ui.viewProject} →
        </TransitionLink>
      )}
      {github && (
        <a href={github} target="_blank" rel="noopener noreferrer" className="btn">
          {dict.ui.viewSource} →
        </a>
      )}
      {live && (
        <a href={live} target="_blank" rel="noopener noreferrer" className="btn">
          {dict.ui.liveDemo} ↗
        </a>
      )}
    </div>
  );
}

/**
 * Phones: the buttons inside the 3D screen would be ~25px tall once the
 * monitor is scaled to the viewport, so the actions live in a real,
 * thumb-sized bar under the scene (the project itself stays on the monitor).
 */
export function MobileActions({ project }: { project: Project }) {
  const { dict } = useLanguage();
  const github = realLink(project.github);
  const live = realLink(project.live);
  return (
    <div className="touch-actions pointer-events-auto mt-4 grid gap-2.5">
      <TransitionLink
        href={`/projects/${project.id}`}
        accent={project.accent}
        className="btn btn-solid min-h-[48px] justify-center"
      >
        {dict.ui.viewProject} →
      </TransitionLink>
      {(github || live) && (
        <div className={cn("grid gap-2.5", github && live ? "grid-cols-2" : "grid-cols-1")}>
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer" className="btn min-h-[48px] justify-center">
              {dict.ui.viewSource} ↗
            </a>
          )}
          {live && (
            <a href={live} target="_blank" rel="noopener noreferrer" className="btn min-h-[48px] justify-center">
              {dict.ui.liveDemo} ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}
