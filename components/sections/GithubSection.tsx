"use client";

import Chapter from "./Chapter";
import MaskLines from "@/components/ui/MaskLines";
import SectionLabel from "@/components/ui/SectionLabel";
import MagneticButton from "@/components/ui/MagneticButton";
import { site } from "@/data/site";
import { useLanguage } from "@/hooks/useLanguage";
import { plain, rich } from "@/i18n/rich";
import { isPlaceholder, realLink } from "@/lib/utils";

/**
 * 08 — CODE IN THE OPEN. The repositories themselves are browsed on the 3D
 * laptop (RepoBrowser); this chapter only carries the headline and the link.
 */
export default function GithubSection() {
  const { dict } = useLanguage();
  const g = dict.github;
  const profile = realLink(site.github);

  return (
    <Chapter
      id="open"
      pose="github"
      group="open"
      vh={190}
      side="none"
      label={g.label}
      innerClassName="items-end md:items-center max-md:pb-10 max-md:scrim-bottom"
    >
      <div className="w-full px-5 md:px-10 lg:px-16">
        <div className="max-w-[26rem] md:max-w-[22rem] lg:max-w-[26rem]">
          <SectionLabel index="08" className="mb-5">
            {g.kicker}
          </SectionLabel>
          <MaskLines
            label={plain(g.headline)}
            className="display display-md text-bone"
            lines={g.headline.map(rich)}
          />

          <p
            data-fade
            className={`mt-5 break-all font-mono text-sm ${isPlaceholder(site.github) ? "placeholder-text" : "text-bone/80"}`}
          >
            {isPlaceholder(site.github) ? site.github : site.githubLabel}
          </p>

          {profile && (
            <div data-fade className="mt-4">
              <MagneticButton href={profile} target="_blank" rel="noopener noreferrer" variant="solid">
                {dict.ui.visitGithub} ↗
              </MagneticButton>
            </div>
          )}
        </div>
      </div>
    </Chapter>
  );
}
