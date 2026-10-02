import type { Project } from "@/types/portfolio";
import ProjectCodeView from "./ProjectCodeView";
import ProjectNetworkView from "./ProjectNetworkView";
import ProjectDashboardView from "./ProjectDashboardView";
import ProjectMobileView from "./ProjectMobileView";
import ProjectEditorialView from "./ProjectEditorialView";
import { caseStudyClick } from "@/lib/transition";
import { cn, pad, realLink } from "@/lib/utils";
import { useLanguage, type LocalizedProject } from "@/hooks/useLanguage";

function View({ project }: { project: LocalizedProject }) {
  switch (project.screenLayout) {
    case "code":
      return <ProjectCodeView project={project} />;
    case "network":
      return <ProjectNetworkView project={project} />;
    case "mobile":
      return <ProjectMobileView project={project} />;
    case "editorial":
      return <ProjectEditorialView project={project} />;
    default:
      return <ProjectDashboardView project={project} />;
  }
}

type Props = {
  /** the raw (bilingual) project — localised inside */
  project: Project;
  /** position in the project list (global, 1-based) */
  number: number;
  /** position within the currently listed projects */
  position: number;
  total: number;
  /** narrow screens: information only, larger type */
  compact?: boolean;
};

/**
 * What the monitor shows for one project: information on the left, a live
 * visualisation (code | network | dashboard | mobile | editorial) on the right.
 */
export default function ProjectScreenContent({ project: raw, number, position, total, compact }: Props) {
  const { dict, project: localize } = useLanguage();
  const project = localize(raw);
  const github = realLink(project.github);
  const live = realLink(project.live);

  return (
    <div className="flex h-full min-h-0">
      <div
        className={cn(
          "flex min-w-0 flex-col",
          compact ? "flex-1 gap-2.5 p-4" : "w-[392px] shrink-0 gap-3.5 p-7",
        )}
      >
        <div className={cn("font-mono uppercase tracking-[0.22em] text-white/40", compact ? "text-[12px]" : "text-[11px]")}>
          <span className="text-[var(--a)]">{dict.work.project} {pad(number)}</span> · {dict.work.filters[project.category as keyof typeof dict.work.filters] ?? project.category} ·{" "}
          {pad(position)}/{pad(total)}
        </div>

        <div
          className={cn(
            "font-sans font-semibold uppercase leading-[0.95] tracking-tight text-white",
            compact ? "text-[28px]" : "text-[36px]",
          )}
        >
          {project.title}
        </div>

        <p className={cn("font-sans leading-snug text-white/65", compact ? "line-clamp-2 text-[16px]" : "line-clamp-4 text-[14.5px]")}>
          {project.description}
        </p>

        <div>
          <div className="mb-1.5 font-mono text-[10px] tracking-[0.25em] text-white/35">{dict.screen.technologies}</div>
          <div className={cn("flex flex-wrap gap-x-4 gap-y-1 font-mono text-white/80", compact ? "text-[14px]" : "text-[12px]")}>
            {project.technologies.slice(0, compact ? 4 : 7).map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-white/75">
          <span
            className={cn(
              "h-[7px] w-[7px] rounded-full border",
              project.status === "completed" && "border-white bg-white",
              project.status === "in-progress" && "border-[var(--a)] bg-[var(--a)]",
              project.status === "concept" && "border-white/60",
            )}
          />
          {dict.status[project.status]}
        </div>

        <div className="mt-auto flex flex-wrap gap-2.5">
          <a
            href={`/projects/${project.id}`}
            onClick={caseStudyClick(`/projects/${project.id}`, project.accent)}
            data-cursor="view"
            className={cn(
              "inline-flex items-center uppercase bg-[var(--a)] font-mono tracking-[0.2em] text-[#0a0b0e] transition-colors hover:bg-white",
              compact ? "px-3.5 py-2.5 text-[13px]" : "px-5 py-3 text-[12px]",
            )}
          >
            {dict.ui.viewProject} →
          </a>
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center uppercase border border-white/25 font-mono tracking-[0.2em] text-white/85 transition-colors hover:bg-white hover:text-[#0a0b0e]",
                compact ? "px-3.5 py-2.5 text-[13px]" : "px-5 py-3 text-[12px]",
              )}
            >
              {dict.ui.viewSource} ↗
            </a>
          )}
          {live && (
            <a
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center uppercase border border-white/25 px-5 py-3 font-mono text-[12px] tracking-[0.2em] text-white/85 transition-colors hover:bg-white hover:text-[#0a0b0e]"
            >
              {dict.ui.liveDemo} ↗
            </a>
          )}
        </div>
      </div>

      {!compact && (
        <div className="min-w-0 flex-1 border-l border-white/10 bg-[#0b0c0f]">
          <View project={project} />
        </div>
      )}
    </div>
  );
}
