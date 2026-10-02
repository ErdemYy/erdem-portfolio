"use client";

import Chapter from "./Chapter";
import MaskLines from "@/components/ui/MaskLines";
import SectionLabel from "@/components/ui/SectionLabel";
import { buildAreaKeys, buildTags } from "@/data/content";
import { useLanguage } from "@/hooks/useLanguage";
import { plain, rich } from "@/i18n/rich";

/** 03 — WHAT I BUILD: an intro chapter + one chapter per discipline. */
export default function BuildSection() {
  const { dict } = useLanguage();
  const b = dict.build;
  return (
    <>
      <Chapter
        id="build"
        pose="buildIntro"
        group="build"
        vh={130}
        side="left"
        label={b.kicker}
      >
        <div className="w-full px-5 md:px-10 lg:px-16">
          <SectionLabel index="02" className="mb-8">
            {b.kicker}
          </SectionLabel>
          <MaskLines
            label={plain(b.headline)}
            className="display display-lg text-bone"
            lines={b.headline.map(rich)}
          />
          <ol data-fade className="mt-10 grid max-w-md gap-3">
            {buildAreaKeys.map((key, i) => (
              <li key={key} className="flex items-baseline gap-5 border-b border-line pb-3">
                <span className="label text-signal">0{i + 1}</span>
                <span className="display display-sm !leading-none">{b.areas[key].title}</span>
              </li>
            ))}
          </ol>
        </div>
      </Chapter>

      {buildAreaKeys.map((key, i) => {
        const area = b.areas[key];
        return (
          <Chapter
            key={key}
            id={`build-${key}`}
            pose={key}
            group="build"
            vh={125}
            side="left"
            label={area.title}
          >
            <div className="w-full px-5 md:px-10 lg:px-16">
              <div className="max-w-[42rem]">
                <div data-fade className="label mb-6 flex items-center gap-4">
                  <span className="text-signal">0{i + 1}</span>
                  <span className="h-px w-10 bg-white/20" />
                  <span>{area.kicker}</span>
                </div>
                <MaskLines
                  label={area.title}
                  className="display display-lg text-bone"
                  lines={area.title.split(" / ")}
                />
                <p data-fade className="body-copy mt-8">
                  {area.text}
                </p>

                {key === "backend" && (
                  <ol data-fade className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
                    {b.flow.map((step, n) => (
                      <li key={step + n} className="label flex items-center gap-3 !text-bone/80">
                        {step}
                        {n < b.flow.length - 1 && (
                          <span className="text-signal" aria-hidden="true">
                            →
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                )}

                <ul data-fade className="mt-8 flex flex-wrap gap-2">
                  {buildTags[key].map((t) => (
                    <li key={t} className="label border border-line px-3 py-1.5 !text-bone/80">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Chapter>
        );
      })}
    </>
  );
}
