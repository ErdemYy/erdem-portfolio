import type { LocalizedProject } from "@/hooks/useLanguage";
import { useLanguage } from "@/hooks/useLanguage";

/** A phone, running the product — wireframe UI in the project's accent. */
export default function ProjectMobileView({ project }: { project: LocalizedProject }) {
  const { dict } = useLanguage();
  return (
    <div className="flex h-full items-center justify-center gap-10 px-6">
      {/* device */}
      <div className="relative h-[410px] w-[205px] shrink-0 rounded-[30px] border-2 border-white/25 bg-[#0b0c0f] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="absolute left-1/2 top-2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-white/15" />
        <div className="flex h-full flex-col gap-2.5 overflow-hidden rounded-[20px] bg-[#101216] p-3 pt-5">
          <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-white/50">
            <span className="truncate">{project.title.slice(0, 14)}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--a)]" />
          </div>
          <div className="relative h-[92px] shrink-0 overflow-hidden bg-[var(--a)]">
            <div className="absolute -bottom-6 -right-6 h-24 w-24 rotate-12 border-2 border-black/30" />
            <div className="absolute bottom-3 left-3 h-2 w-16 bg-black/40" />
            <div className="absolute bottom-7 left-3 h-3 w-24 bg-black/60" />
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2.5 border border-white/10 p-2">
              <div className="h-8 w-8 shrink-0 bg-white/10" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2 w-4/5 bg-white/25" />
                <div className="h-1.5 w-3/5 bg-white/10" />
              </div>
            </div>
          ))}
          <div className="mt-auto flex justify-between border-t border-white/10 pt-2.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`h-4 w-4 ${i === 0 ? "bg-[var(--a)]" : "bg-white/15"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* platform */}
      <div className="min-w-0 font-mono text-[11px] tracking-[0.2em] text-white/40">
        <div className="mb-3 uppercase">{dict.screen.platform}</div>
        <ul className="space-y-2.5 text-[13px] tracking-wide text-white/85">
          {project.technologies.map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span className="h-2 w-2 bg-[var(--a)]" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
