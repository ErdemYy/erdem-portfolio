"use client";

import { laptopTabKeys } from "@/data/content";
import { useLanguage } from "@/hooks/useLanguage";
import { fmt } from "@/i18n/config";
import { projects } from "@/data/projects";
import { techRelations } from "@/data/skills";
import { useExperience } from "@/lib/experience";
import { cn, pad } from "@/lib/utils";
import RepoBrowser from "./RepoBrowser";
import ProjectScreen from "@/components/projects/ProjectScreen";

const files = [
  "app/",
  "components/",
  "data/",
  "lib/",
  "services/",
  "package.json",
];

const code = `export async function getProject(id: string) {
  const project = await db.project.findUnique({
    where: { id },
  });

  if (!project) {
    throw new NotFoundError("project", id);
  }

  return toProjectDTO(project);
}`;


export default function LaptopScreen() {
  const laptopTab = useExperience((s) => s.laptopTab);
  const group = useExperience((s) => s.group);
  const chapterId = useExperience((s) => s.chapterId);
  const narrow = useExperience((s) => s.narrow);

  // what the laptop is doing follows the scroll chapter
  if (chapterId.startsWith("project-")) return <ProjectScreen />;
  if (group === "open") return <RepoBrowser />;
  const tab = chapterId === "laptop" ? laptopTab : 0;
  if (narrow) {
    // the IDE is authored for 1000px — shrink it as a whole on narrow screens
    return (
      <div style={{ width: 1000, height: 528, transform: "scale(0.56)", transformOrigin: "0 0" }}>
        <Ide tab={tab} />
      </div>
    );
  }
  return <Ide tab={tab} />;
}

/** Professional IDE chrome — projects, code, architecture, debugging. */
function Ide({ tab }: { tab: number }) {
  const { dict } = useLanguage();
  const ide = dict.laptop.ide;
  const layers = ide.layers;
  const debugSteps = ide.debugSteps;
  return (
    <div className="flex h-full w-full flex-col bg-[#0e1014] font-mono text-[15px] text-[#c9ced8]">
      {/* title bar */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3 text-white/50">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-4 tracking-[0.2em]">{ide.workspace}</span>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* explorer */}
        <aside className="w-[170px] border-r border-white/10 px-4 py-4 text-white/45">
          <div className="mb-3 text-[11px] tracking-[0.3em]">{ide.explorer}</div>
          {files.map((f) => (
            <div key={f} className="py-[3px]">
              {f}
            </div>
          ))}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* tabs */}
          <div className="flex border-b border-white/10">
            {laptopTabKeys.map((key, i) => (
              <div
                key={key}
                className={cn(
                  "border-r border-white/10 px-4 py-2.5 text-[12px] tracking-[0.22em]",
                  i === tab
                    ? "bg-[#14171d] text-white shadow-[inset_0_2px_0_0_#ff5b2e]"
                    : "text-white/35",
                )}
              >
                {dict.laptop.tabs[key]}
              </div>
            ))}
          </div>

          {/* editor */}
          <div className="relative min-h-0 flex-1 overflow-hidden px-6 py-5">
            {tab === 0 && (
              <div className="space-y-2.5">
                {projects.slice(0, 6).map((p, i) => (
                  <div
                    key={p.id}
                    className="grid grid-cols-[34px_1fr_90px_90px] items-center gap-3 border-b border-white/5 pb-2"
                  >
                    <span className="text-white/35">{pad(i + 1)}</span>
                    <span className="truncate text-white/85">{p.title}</span>
                    <span className="text-white/40 uppercase">{dict.work.filters[p.category as keyof typeof dict.work.filters] ?? p.category}</span>
                    <span className="text-[#ff5b2e] uppercase">{dict.status[p.status]}</span>
                  </div>
                ))}
                {projects.length > 6 && (
                  <div className="pt-1 text-[12px] tracking-[0.2em] text-white/35">
                    + {projects.length - 6} {ide.more}
                  </div>
                )}
              </div>
            )}

            {tab === 1 && (
              <pre className="leading-[1.7] text-[#aab3c4]">
                {code.split("\n").map((line, i) => (
                  <div key={i} className="flex">
                    <span className="w-8 shrink-0 select-none text-white/20">
                      {i + 1}
                    </span>
                    <span>{line || " "}</span>
                  </div>
                ))}
              </pre>
            )}

            {tab === 2 && (
              <div className="flex h-full flex-col justify-center gap-3">
                {layers.map((l, i) => (
                  <div key={l} className="flex items-center gap-4">
                    <div
                      className="border border-white/20 px-4 py-2 text-[12px] tracking-[0.25em] text-white/80"
                      style={{ marginLeft: i * 28 }}
                    >
                      {l}
                    </div>
                    {i < layers.length - 1 && (
                      <span className="text-white/25">↓</span>
                    )}
                  </div>
                ))}
                <div className="mt-1 text-[11px] tracking-[0.2em] text-white/30">
                  {fmt(ide.relationships, { n: techRelations.length })}
                </div>
              </div>
            )}

            {tab === 3 && (
              <div className="space-y-3">
                {debugSteps.map((s, i) => (
                  <div key={s} className="flex items-center gap-4">
                    <span className="h-2 w-2 rounded-full bg-[#ff5b2e]" />
                    <span className="w-8 text-white/30">{pad(i + 1)}</span>
                    <span className="tracking-[0.25em] text-white/80">{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* status bar */}
          <div className="flex justify-between border-t border-white/10 px-4 py-2 text-[11px] tracking-[0.2em] text-white/35">
            <span>main</span>
            <span>TypeScript · UTF-8</span>
          </div>
        </div>
      </div>
    </div>
  );
}
