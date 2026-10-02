"use client";

import Chapter from "./Chapter";
import MaskLines from "@/components/ui/MaskLines";
import SectionLabel from "@/components/ui/SectionLabel";
import MagneticButton from "@/components/ui/MagneticButton";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { setExperience, useExperience } from "@/lib/experience";
import { useLanguage } from "@/hooks/useLanguage";
import { plain, rich } from "@/i18n/rich";
import { caseStudyClick } from "@/lib/transition";
import { isPlaceholder, pad, realLink } from "@/lib/utils";

/** Phones: thumb-sized controls for the repository browser on the 3D laptop. */
function RepoActions() {
  const { dict } = useLanguage();
  const index = useExperience((s) => s.repoIndex);
  const total = projects.length;
  const p = projects[index];
  const github = realLink(p.github);
  const go = (d: number) => setExperience({ repoIndex: (index + d + total) % total });

  return (
    <div className="touch-actions pointer-events-auto mt-5 grid gap-2.5">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={dict.ui.previous}
          className="btn min-h-[48px] w-14 justify-center !px-0"
        >
          ‹
        </button>
        <div className="label min-w-0 flex-1 truncate text-center !text-bone">
          {pad(index + 1)}/{pad(total)} · {p.title}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label={dict.ui.next}
          className="btn min-h-[48px] w-14 justify-center !px-0"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer" className="btn btn-solid min-h-[48px] justify-center">
            {dict.ui.viewSource} ↗
          </a>
        )}
        <a
          href={`/projects/${p.id}`}
          onClick={caseStudyClick(`/projects/${p.id}`, p.accent)}
          className="btn min-h-[48px] justify-center"
        >
          {dict.ui.caseStudy} →
        </a>
      </div>
    </div>
  );
}

/**
 * 08 — CODE IN THE OPEN. The repositories are browsed on the 3D laptop
 * (RepoBrowser). On phones the controls sit in a bar under the scene; without
 * WebGL the same repositories are a plain list.
 */
export default function GithubSection() {
  const { dict } = useLanguage();
  const g = dict.github;
  const profile = realLink(site.github);
  const narrow = useExperience((s) => s.narrow);
  const webgl = useExperience((s) => s.webgl);

  return (
    <Chapter
      id="open"
      pose="github"
      group="open"
      vh={190}
      side="none"
      label={g.label}
      innerClassName="items-end md:items-center max-md:pb-8 max-md:scrim-bottom"
    >
      <div className="w-full px-5 md:px-10 lg:px-16">
        <div className="max-w-[26rem] md:max-w-[22rem] lg:max-w-[26rem]">
          <SectionLabel index="08" className="mb-4 md:mb-5">
            {g.kicker}
          </SectionLabel>
          <MaskLines
            label={plain(g.headline)}
            className="display display-md text-bone"
            lines={g.headline.map(rich)}
          />

          <p
            data-fade
            className={`mt-4 break-all font-mono text-sm md:mt-5 ${isPlaceholder(site.github) ? "placeholder-text" : "text-bone/80"}`}
          >
            {isPlaceholder(site.github) ? site.github : site.githubLabel}
          </p>

          {profile && !(narrow && webgl) && (
            <div data-fade className="mt-4">
              <MagneticButton href={profile} target="_blank" rel="noopener noreferrer" variant="solid">
                {dict.ui.visitGithub} ↗
              </MagneticButton>
            </div>
          )}

          {narrow && webgl && <RepoActions />}

          {!webgl && (
            <ul data-fade className="pointer-events-auto mt-6 grid gap-1 border-t border-line pt-4">
              {projects.map((p) => {
                const href = realLink(p.github);
                return href ? (
                  <li key={p.id}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline inline-block py-2 text-bone/85"
                    >
                      {p.title} ↗
                    </a>
                  </li>
                ) : null;
              })}
            </ul>
          )}
        </div>
      </div>
    </Chapter>
  );
}
