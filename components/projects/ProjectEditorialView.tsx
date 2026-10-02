"use client";

import type { LocalizedProject } from "@/hooks/useLanguage";
import { useLanguage } from "@/hooks/useLanguage";
import { pad } from "@/lib/utils";

export default function ProjectEditorialView({ project }: { project: LocalizedProject }) {
  const { dict } = useLanguage();
  return (
    <div className="flex h-full flex-col justify-between p-6">
      <div className="flex items-baseline justify-between font-sans font-semibold leading-none tracking-tighter">
        <span className="text-[64px] text-transparent [-webkit-text-stroke:1.5px_rgba(236,235,230,0.5)]">1820</span>
        <span className="text-[28px] text-[var(--a)]">→</span>
        <span className="text-[64px] text-white">2026</span>
      </div>
      <ol className="grid grid-cols-2 gap-x-6 font-mono text-[12px] tracking-[0.18em] text-white/75">
        {dict.screen.eras.map((c, i) => (
          <li key={`${c}-${i}`} className="flex items-center gap-3 border-t border-white/10 py-2.5">
            <span className="text-[var(--a)]">{pad(i + 1)}</span>
            {c}
          </li>
        ))}
      </ol>
      <div className="font-mono text-[10px] tracking-[0.25em] text-white/30">
        {project.title} · {dict.screen.footnote}
      </div>
    </div>
  );
}
