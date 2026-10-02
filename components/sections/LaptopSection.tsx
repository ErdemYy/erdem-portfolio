"use client";

import Chapter from "./Chapter";
import MaskLines from "@/components/ui/MaskLines";
import SectionLabel from "@/components/ui/SectionLabel";
import { laptopTabKeys } from "@/data/content";
import { useExperience } from "@/lib/experience";
import { useLanguage } from "@/hooks/useLanguage";
import { plain, rich } from "@/i18n/rich";
import { cn, pad } from "@/lib/utils";

/** The camera settles on the laptop; the glass reads through the four tabs as you scroll. */
export default function LaptopSection() {
  const tab = useExperience((s) => s.laptopTab);
  const { dict } = useLanguage();
  const l = dict.laptop;

  return (
    <Chapter id="laptop" group="work" vh={330} side="left" label={l.label}>
      <div className="w-full px-5 md:px-10 lg:px-16">
        <div className="max-w-[40rem]">
          <SectionLabel index="03" className="mb-8">
            {l.kicker}
          </SectionLabel>
          <MaskLines
            label={plain(l.headline)}
            className="display display-lg text-bone"
            lines={l.headline.map(rich)}
          />

          <ol data-fade className="mt-10 grid gap-3">
            {laptopTabKeys.map((key, i) => (
              <li
                key={key}
                aria-current={i === tab ? "true" : undefined}
                className={cn(
                  "flex items-center gap-5 border-b pb-3 transition-all duration-500",
                  i === tab ? "border-signal text-bone" : "border-line text-bone/35",
                )}
              >
                <span className="label !text-inherit">{pad(i + 1)}</span>
                <span className="display display-sm !leading-none">{l.tabs[key]}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Chapter>
  );
}
