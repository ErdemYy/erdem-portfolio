"use client";

import Link from "next/link";
import ProjectVisual from "./ProjectVisual";
import { ProjectLinks, StatusChip, TechList } from "./ProjectMeta";
import DetailEffects from "./DetailEffects";
import type { Project } from "@/types/portfolio";
import { projects } from "@/data/projects";
import { useLanguage } from "@/hooks/useLanguage";
import { cn, pad, realLink } from "@/lib/utils";

function Block({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      data-reveal
      className="grid gap-6 border-t border-line py-12 md:grid-cols-12 md:gap-10 md:py-16"
    >
      <div className="md:col-span-3">
        <div className="label flex gap-4">
          <span className="text-signal">{index}</span>
          <span>{title}</span>
        </div>
      </div>
      <div className="md:col-span-8 md:col-start-5">{children}</div>
    </section>
  );
}

function Copy({ text }: { text: string }) {
  return <p className="text-[clamp(1.1rem,1.6vw,1.5rem)] leading-snug text-bone/85">{text}</p>;
}

/** Case-study page. Every label is translated; only blocks with real data render. */
export default function ProjectDetails({ project: raw }: { project: Project }) {
  const { dict, project: localize } = useLanguage();
  const d = dict.detail;
  const project = localize(raw);

  const index = Math.max(0, projects.findIndex((p) => p.id === project.id));
  const next = projects[(index + 1) % projects.length];
  const github = realLink(project.github);
  const live = realLink(project.live);

  const blocks: { title: string; body: React.ReactNode }[] = [];
  if (project.longDescription) blocks.push({ title: d.overview, body: <Copy text={project.longDescription} /> });
  if (project.problem) blocks.push({ title: d.problem, body: <Copy text={project.problem} /> });
  if (project.approach) blocks.push({ title: d.approach, body: <Copy text={project.approach} /> });
  if (project.architecture?.length)
    blocks.push({
      title: d.architecture,
      body: (
        <ol className="grid gap-3">
          {project.architecture.map((layer, i) => (
            <li
              key={`${layer}-${i}`}
              className="flex items-center gap-5 border border-line px-5 py-4"
              style={{ marginLeft: `${i * 1.25}rem` }}
            >
              <span className="label text-signal">{pad(i + 1)}</span>
              <span className="font-mono text-sm text-bone/90">{layer}</span>
            </li>
          ))}
        </ol>
      ),
    });
  blocks.push({ title: d.technologies, body: <TechList items={project.technologies} /> });
  if (project.screenshots?.length)
    blocks.push({
      title: d.screenshots,
      body: (
        <div className="grid gap-4 md:grid-cols-2">
          {project.screenshots.map((src, i) => (
            <div key={src} className="relative aspect-[10/7] overflow-hidden border border-line bg-graphite">
              <ProjectVisual project={{ ...raw, image: src }} index={index + i + 1} />
            </div>
          ))}
        </div>
      ),
    });
  if (project.results?.length)
    blocks.push({
      title: d.results,
      body: (
        <ul className="grid gap-4">
          {project.results.map((r, i) => (
            <li key={`${r}-${i}`}>
              <Copy text={r} />
            </li>
          ))}
        </ul>
      ),
    });
  if (github || live)
    blocks.push({
      title: github && live ? d.sourceAndLive : github ? d.source : d.live,
      body: <ProjectLinks project={raw} detail={false} />,
    });

  return (
    <article className="relative z-10 px-5 pb-8 pt-28 md:px-10 md:pt-36 lg:px-16">
      <DetailEffects />

      <header className="mb-14 md:mb-20">
        <div data-reveal className="label mb-6 flex flex-wrap items-center gap-4">
          <Link href="/#work" className="link-underline hover:!text-bone">
            ← {d.back}
          </Link>
          <span className="h-px w-8 bg-white/20" />
          <span className="text-signal">
            {d.project} {pad(index + 1)}
          </span>
          <span>{dict.work.filters[project.category as keyof typeof dict.work.filters] ?? project.category}</span>
        </div>

        <h1 data-reveal className="display display-xl max-w-[18ch] text-bone">
          {project.title}
        </h1>

        <div data-reveal className="mt-8 grid gap-8 md:grid-cols-12">
          <p className="body-copy md:col-span-5">{project.description}</p>
          <div className="flex flex-col gap-5 md:col-span-6 md:col-start-7">
            <StatusChip status={project.status} />
            <TechList items={project.technologies} />
            <ProjectLinks project={raw} detail={false} />
          </div>
        </div>
      </header>

      <div
        data-reveal
        id={`visual-${project.id}`}
        className="relative mb-6 aspect-[16/9] w-full overflow-hidden border border-line bg-graphite"
      >
        <ProjectVisual project={raw} index={index + 1} />
      </div>

      <div className="mx-auto max-w-[96rem]">
        {blocks.map((blk, i) => (
          <Block key={blk.title} index={pad(i + 1)} title={blk.title}>
            {blk.body}
          </Block>
        ))}
      </div>

      <Link
        href={`/projects/${next.id}`}
        data-reveal
        className="group mt-8 flex items-end justify-between gap-6 border-t border-line pt-10"
      >
        <div>
          <div className="label mb-3">{d.next}</div>
          <div className={cn("display display-md text-bone transition-colors group-hover:text-signal")}>
            {next.title}
          </div>
        </div>
        <span className="display display-md text-signal" aria-hidden="true">
          →
        </span>
      </Link>
    </article>
  );
}
