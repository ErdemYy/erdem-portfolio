"use client";

import Chapter from "./Chapter";
import MaskLines from "@/components/ui/MaskLines";
import SectionLabel from "@/components/ui/SectionLabel";
import { engineeringKeys } from "@/data/content";
import { useLanguage } from "@/hooks/useLanguage";
import { plain, rich } from "@/i18n/rich";
import { pad } from "@/lib/utils";

/** 06 — Engineering mindset. Overhead camera over the desk. */
export default function EngineeringSection() {
  const { dict } = useLanguage();
  const e = dict.engineering;
  return (
    <Chapter
      id="engineering"
      group="engineering"
      vh={180}
      side="none"
      label={e.label}
      innerClassName="bg-ink/55 max-md:items-start max-md:pt-20"
    >
      <div className="grid w-full grid-cols-12 gap-y-6 px-5 md:gap-x-10 md:gap-y-10 md:px-10 lg:px-16">
        <div className="col-span-12 md:col-span-4">
          <SectionLabel index="06" className="mb-5 md:mb-8">
            {e.kicker}
          </SectionLabel>
          <MaskLines
            label={plain(e.headline)}
            className="display display-md text-bone max-md:!text-[2.4rem]"
            lines={e.headline.map(rich)}
          />
        </div>

        <ol className="col-span-12 grid gap-x-10 gap-y-4 md:col-span-8 md:grid-cols-2 md:gap-y-7">
          {engineeringKeys.map((key, i) => (
            <li key={key} data-fade className="border-t border-line pt-3 md:pt-4">
              <div className="mb-1.5 flex items-baseline gap-4 md:mb-3">
                <span className="label text-signal">{pad(i + 1)}</span>
                <h3 className="display display-sm !leading-none">{e.items[key].title}</h3>
              </div>
              <p className="text-[0.85rem] leading-snug text-bone/65 md:text-[0.95rem] md:leading-relaxed">
                {e.items[key].text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Chapter>
  );
}
