"use client";

import type { KeyboardEvent } from "react";
import ProjectVisual from "@/components/projects/ProjectVisual";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { caseStudyClick } from "@/lib/transition";
import { getExperience, setExperience, useExperience } from "@/lib/experience";
import { useLanguage } from "@/hooks/useLanguage";
import { cn, pad, realLink } from "@/lib/utils";

const statusDot: Record<string, string> = {
  completed: "bg-bone border-bone",
  "in-progress": "bg-signal border-signal",
  concept: "bg-transparent border-bone/60",
};

/**
 * The repositories, running on the laptop. Fully interactive DOM on the 3D
 * glass: pick a project (click, arrows or ‹ ›), then visit its source or open
 * its case study. Lives in its own React root (drei <Html>), so it must not
 * depend on router context — navigation goes through routeTransition.
 */
export default function RepoBrowser() {
  // selection is shared with the phone action bar (GithubSection)
  const sel = useExperience((st) => st.repoIndex);
  const setSel = (n: number) => setExperience({ repoIndex: n });
  const compact = useExperience((st) => st.narrow);
  const { dict, project: localize } = useLanguage();
  const p = localize(projects[sel]);
  const github = realLink(p.github);
  const total = projects.length;

  const step = (d: number) => setSel((getExperience().repoIndex + d + total) % total);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  return (
    <div
      className="flex h-full w-full flex-col bg-[#0e1014] font-mono text-[14px] text-[#c9ced8] outline-none"
      onKeyDown={onKey}
      tabIndex={0}
      role="region"
      aria-label={dict.screen.repositories}
    >
      {/* browser bar */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3 text-white/50">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-3 flex-1 border border-white/10 bg-black/30 px-4 py-1.5 tracking-wide text-white/70">
          {site.githubLabel} <span className="text-white/30">/ {dict.screen.repositories}</span>
        </span>
        <button
          type="button"
          aria-label={dict.ui.previous}
          onClick={() => step(-1)}
          className="h-8 w-8 border border-white/15 text-white/70 transition-colors hover:border-[#ff5b2e] hover:text-white"
        >
          ‹
        </button>
        <span className="w-12 text-center tracking-[0.2em] text-white/45">
          {pad(sel + 1)}/{pad(total)}
        </span>
        <button
          type="button"
          aria-label={dict.ui.next}
          onClick={() => step(1)}
          className="h-8 w-8 border border-white/15 text-white/70 transition-colors hover:border-[#ff5b2e] hover:text-white"
        >
          ›
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* list */}
        <ul className={cn("w-[290px] shrink-0 border-r border-white/10 py-2", compact && "hidden")} role="listbox" aria-label={dict.screen.projects}>
          {projects.map((proj, i) => (
            <li key={proj.id} role="option" aria-selected={i === sel}>
              <button
                type="button"
                onClick={() => setSel(i)}
                onMouseEnter={() => setSel(i)}
                className={cn(
                  "flex w-full items-center gap-3 border-l-2 px-4 py-[9px] text-left transition-colors",
                  i === sel
                    ? "border-[#ff5b2e] bg-white/[0.05] text-white"
                    : "border-transparent text-white/50 hover:text-white/80",
                )}
              >
                <span className="w-5 text-[11px] text-white/30">{pad(i + 1)}</span>
                <span className="flex-1 truncate tracking-wide">{proj.title}</span>
                <span className={cn("h-[7px] w-[7px] rounded-full border", statusDot[proj.status])} />
              </button>
            </li>
          ))}
        </ul>

        {/* detail */}
        <div data-c={compact} className="flex min-w-0 flex-1 flex-col p-6 gap-4 data-[c=true]:gap-2.5 data-[c=true]:p-4">
          <div className="flex gap-6">
            <div className={cn("aspect-[10/7] w-[340px] shrink-0 overflow-hidden border border-white/10 bg-black/30", compact && "hidden")}>
              <ProjectVisual project={p} index={sel + 1} quiet />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-[#ff5b2e]">
                {dict.work.filters[p.category as keyof typeof dict.work.filters] ?? p.category} · {dict.status[p.status]}
              </div>
              <div className={cn("mb-3 font-sans font-semibold uppercase leading-[1] tracking-tight text-white", compact ? "mb-1.5 text-[22px]" : "text-[26px]")}>
                {p.title}
              </div>
              <p className={cn("font-sans leading-snug text-white/65", compact ? "line-clamp-2 text-[15px]" : "line-clamp-4 text-[14px]")}>
                {p.description}
              </p>
            </div>
          </div>

          {!compact && (
          <div>
            <div className="mb-1.5 text-[10px] tracking-[0.25em] text-white/35">{dict.screen.technologies}</div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-white/75">
              {p.technologies.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
          )}

          <div className="mt-auto flex flex-wrap gap-3">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 uppercase bg-[#ff5b2e] px-5 py-3 text-[12px] tracking-[0.22em] text-[#0a0b0e] transition-colors hover:bg-white"
              >
                {dict.ui.viewSource} ↗
              </a>
            )}
            <a
              href={`/projects/${p.id}`}
              onClick={caseStudyClick(`/projects/${p.id}`, p.accent)}
              className="inline-flex items-center gap-2 uppercase border border-white/25 px-5 py-3 text-[12px] tracking-[0.22em] text-white/85 transition-colors hover:bg-white hover:text-[#0a0b0e]"
            >
              {dict.ui.caseStudy} →
            </a>
            {realLink(p.live) && (
              <a
                href={realLink(p.live)!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 uppercase border border-white/25 px-5 py-3 text-[12px] tracking-[0.22em] text-white/85 transition-colors hover:bg-white hover:text-[#0a0b0e]"
              >
                {dict.ui.liveDemo} ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
