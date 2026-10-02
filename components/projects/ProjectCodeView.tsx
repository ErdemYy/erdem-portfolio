import type { LocalizedProject } from "@/hooks/useLanguage";
import { realLink } from "@/lib/utils";

type Seg = [text: string, cls?: string];

const KEY = "text-[#8fb4ff]";
const STR = "text-[#e9e6df]";
const KW = "text-[#ff8a66]";
const DIM = "text-white/35";

/** One sentence, used as the leading comment. */
const firstSentence = (s: string) => (s.split(/(?<=\.)\s/)[0] ?? s).replace(/\s+/g, " ");

/**
 * The project's own data rendered as source code — live, never a screenshot,
 * and never invented: every token comes from data/projects.ts.
 */
export function buildLines(p: LocalizedProject): Seg[][] {
  const repo = realLink(p.github)?.replace(/^https?:\/\//, "");
  const lines: Seg[][] = [
    [[`// ${firstSentence(p.description)}`, DIM]],
    [["const ", KW], ["project", STR], [" = {"]],
    [["  id", KEY], [": "], [`"${p.id}"`, STR], [","]],
    [["  category", KEY], [": "], [`"${p.category}"`, STR], [","]],
    [["  status", KEY], [": "], [`"${p.status}"`, p.status === "in-progress" ? KW : STR], [","]],
    [["  stack", KEY], [": ["]],
    ...p.technologies.map((t): Seg[] => [["    "], [`"${t}"`, STR], [","]]),
    [["  ],"]],
  ];
  if (repo) lines.push([["  source", KEY], [": "], [`"${repo}"`, STR], [","]]);
  lines.push([["} "], ["as const", KW], [";"]]);
  lines.push([]);
  lines.push([["export default ", KW], ["project", STR], [";"]]);
  return lines;
}

export default function ProjectCodeView({ project }: { project: LocalizedProject }) {
  const lines = buildLines(project);
  return (
    <div className="flex h-full flex-col font-mono text-[13px]">
      <div className="flex border-b border-white/10 text-[11px] tracking-[0.18em]">
        <div className="border-r border-white/10 bg-[#14171d] px-4 py-2 text-white shadow-[inset_0_2px_0_0_var(--a)]">
          {project.id}.ts
        </div>
        <div className="px-4 py-2 text-white/30">README.md</div>
      </div>
      <pre className="min-h-0 flex-1 overflow-hidden px-5 py-4 leading-[1.75] text-[#aab3c4]">
        {lines.map((segs, i) => (
          <div key={i} className="flex">
            <span className="w-8 shrink-0 select-none text-white/20">{i + 1}</span>
            <span className="whitespace-pre">
              {segs.length === 0 ? " " : segs.map(([t, c], k) => (
                <span key={k} className={c}>
                  {t}
                </span>
              ))}
            </span>
          </div>
        ))}
      </pre>
      <div className="flex justify-between border-t border-white/10 px-4 py-1.5 text-[10px] tracking-[0.2em] text-white/30">
        <span>main</span>
        <span>TypeScript · UTF-8</span>
      </div>
    </div>
  );
}
