"use client";

import Chapter from "./Chapter";
import MaskLines from "@/components/ui/MaskLines";
import SectionLabel from "@/components/ui/SectionLabel";
import { techCategories, technologies } from "@/data/skills";
import { useLanguage } from "@/hooks/useLanguage";
import { plain, rich } from "@/i18n/rich";

/**
 * 05 — The constellation itself lives in the 3D scene (the scene expands and
 * the nodes draw in). This is the readable, accessible version of the same data.
 * Category names are translated; technology names never are.
 */
export default function SkillsSection() {
  const { dict } = useLanguage();
  const s = dict.skills;
  return (
    <Chapter id="stack" group="stack" vh={190} side="left" label={s.label}>
      <div className="w-full px-5 md:px-10 lg:px-16">
        <div className="max-w-[34rem]">
          <SectionLabel index="05" className="mb-8">
            {s.kicker}
          </SectionLabel>
          <MaskLines
            label={plain(s.headline)}
            className="display display-md text-bone"
            lines={s.headline.map(rich)}
          />

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6">
            {techCategories.map((c) => (
              <div key={c.key} data-fade>
                <dt className="label mb-2 !text-bone/60">{s.categories[c.key]}</dt>
                <dd className="text-[0.95rem] leading-snug text-bone/90">
                  {technologies
                    .filter((t) => t.category === c.key)
                    .map((t) => t.name)
                    .join("  ·  ")}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Chapter>
  );
}
