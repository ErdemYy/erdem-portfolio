"use client";

import Chapter from "./Chapter";
import MaskLines from "@/components/ui/MaskLines";
import SectionLabel from "@/components/ui/SectionLabel";
import { isPlaceholder } from "@/lib/utils";
import { technologies } from "@/data/skills";
import { useLanguage } from "@/hooks/useLanguage";
import { plain, rich } from "@/i18n/rich";

/** 02 — Editorial statement, 3D desk keeps orbiting on the right. */
export default function AboutSection() {
  const { dict } = useLanguage();
  const a = dict.about;
  return (
    <Chapter
      id="about"
      group="about"
      vh={160}
      side="left"
      label={a.label}
      innerClassName="max-md:items-start max-md:pt-20"
    >
      <div className="w-full px-5 md:px-10 lg:px-16">
        <div className="max-w-[56rem]">
          <SectionLabel index="01" className="mb-5 md:mb-7">
            {a.kicker}
          </SectionLabel>

          <MaskLines
            label={plain(a.headline)}
            className="display text-bone text-[clamp(2.2rem,6vw,6.4rem)]"
            lines={a.headline.map(rich)}
          />

          <div data-fade className="mt-7 grid max-w-[34rem] gap-3 md:mt-8">
            {dict.profile.bio.map((para) => (
              <p key={para} className="body-copy max-md:!text-[0.9rem] max-md:!leading-snug">
                {para}
              </p>
            ))}
          </div>

          <dl
            data-fade
            className="mt-7 grid max-w-xl grid-cols-2 gap-x-8 gap-y-4 border-t border-line pt-5"
          >
            <div>
              <dt className="label mb-1">{a.role}</dt>
              <dd className="text-bone">{dict.profile.role}</dd>
            </div>
            <div>
              <dt className="label mb-1">{a.location}</dt>
              <dd className={isPlaceholder(dict.profile.location) ? "placeholder-text" : "text-bone"}>
                {dict.profile.location}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="label mb-1">{a.languages}</dt>
              <dd className="text-[0.95rem] leading-snug text-bone/85">
                {technologies
                  .filter((t) => t.category === "languages")
                  .map((t) => t.name)
                  .join("  ·  ")}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Chapter>
  );
}
