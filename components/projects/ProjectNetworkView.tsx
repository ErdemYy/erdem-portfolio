"use client";

import type { LocalizedProject } from "@/hooks/useLanguage";
import { useLanguage } from "@/hooks/useLanguage";
import { fmt } from "@/i18n/config";
import { useExperience } from "@/lib/experience";

/** Topology of the project: the project in the middle, its nodes around it. */
export default function ProjectNetworkView({ project }: { project: LocalizedProject }) {
  const { dict } = useLanguage();
  const reduced = useExperience((s) => s.reducedMotion);
  const nodes = (project.screenNodes ?? project.technologies).slice(0, 8);
  const cx = 300;
  const cy = 236;
  const label = project.title.length > 14 ? project.title.split(" ")[0] : project.title;

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-between border-b border-white/10 px-5 py-2 font-mono text-[11px] tracking-[0.2em] text-white/40">
        <span>{dict.screen.topology}</span>
        <span>{fmt(dict.screen.nodes, { n: nodes.length })}</span>
      </div>
      <svg viewBox="0 0 600 440" className="min-h-0 flex-1" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`${project.title} — ${dict.ui.topologyAlt}`}>
        {nodes.map((n, i) => {
          const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(a) * 215;
          const y = cy + Math.sin(a) * 150;
          const b = ((i + 1) / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const x2 = cx + Math.cos(b) * 215;
          const y2 = cy + Math.sin(b) * 150;
          return (
            <g key={n}>
              <line x1={x} y1={y} x2={x2} y2={y2} stroke="rgba(236,235,230,.08)" />
              <line x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(236,235,230,.22)" />
              {!reduced && (
                <circle r="3.2" fill="#fff">
                  <animateMotion dur={`${2.2 + (i % 4) * 0.4}s`} repeatCount="indefinite" path={`M${cx} ${cy} L${x} ${y}`} />
                </circle>
              )}
              <rect x={x - 54} y={y - 17} width="108" height="34" fill="#101216" stroke="rgba(236,235,230,.2)" />
              <circle cx={x - 38} cy={y} r="4" fill="var(--a)" />
              <text x={x - 26} y={y + 4.5} fontFamily="Consolas, monospace" fontSize="12" letterSpacing="1" fill="#e9e6df">
                {n.length > 11 ? `${n.slice(0, 10)}…` : n}
              </text>
            </g>
          );
        })}
        <rect x={cx - 74} y={cy - 28} width="148" height="56" fill="var(--a)" />
        <text x={cx} y={cy + 5} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="14" fontWeight="700" letterSpacing="2" fill="#0a0b0e">
          {label}
        </text>
      </svg>
    </div>
  );
}
