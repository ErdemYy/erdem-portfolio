import type { LocalizedProject } from "@/hooks/useLanguage";
import { useLanguage } from "@/hooks/useLanguage";
import { realLink } from "@/lib/utils";

const stages = ["concept", "in-progress", "completed"] as const;

/** Architecture / lifecycle overview built from the project's real data. */
export default function ProjectDashboardView({ project }: { project: LocalizedProject }) {
  const { dict } = useLanguage();
  const current = stages.findIndex((s) => s === project.status);
  const repo = realLink(project.github)?.replace(/^https?:\/\//, "");

  return (
    <div className="flex h-full flex-col gap-4 p-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
      {project.figure ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="mb-2">{dict.screen.figure}</div>
          <div className="flex min-h-0 flex-1 items-center justify-center border border-white/10 bg-[#0a0b0e]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.figure} alt={`${project.title} — ${dict.ui.figureAlt}`} className="max-h-full max-w-full object-contain" />
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-2">{dict.screen.stack}</div>
          <div className="grid grid-cols-2 gap-2">
            {project.technologies.slice(0, 8).map((t) => (
              <div key={t} className="flex items-center gap-3 border border-white/10 bg-[#101216] px-3 py-3 text-[12px] tracking-wide text-white/85">
                <span className="h-2 w-2 shrink-0 bg-[var(--a)]" />
                <span className="truncate">{t}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="mb-2">{dict.screen.lifecycle}</div>
        <div className="grid grid-cols-3 gap-2">
          {stages.map((s, i) => (
            <div key={s}>
              <div className={`h-[3px] ${i <= current ? "bg-[var(--a)]" : "bg-white/10"}`} />
              <div className={`mt-1.5 text-[10px] ${i === current ? "text-white" : ""}`}>{dict.status[s]}</div>
            </div>
          ))}
        </div>
      </div>

      {repo && (
        <div className="border border-white/10 bg-[#101216] px-3 py-2.5">
          <div className="mb-1 text-[10px]">{dict.screen.repository}</div>
          <div className="truncate text-[12px] tracking-wide text-white/85">{repo}</div>
        </div>
      )}
    </div>
  );
}
