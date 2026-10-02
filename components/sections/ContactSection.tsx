"use client";

import Chapter from "./Chapter";
import MaskLines from "@/components/ui/MaskLines";
import SectionLabel from "@/components/ui/SectionLabel";
import MagneticButton from "@/components/ui/MagneticButton";
import { site } from "@/data/site";
import { useLanguage } from "@/hooks/useLanguage";
import { plain, rich } from "@/i18n/rich";
import { scrollToTarget } from "@/lib/lenis";
import { isPlaceholder, mailto, realLink } from "@/lib/utils";

/** 09 — The camera pulls far away; final call to action. */
export default function ContactSection() {
  const { dict } = useLanguage();
  const c = dict.contact;

  const links = [
    { label: c.email, value: site.email, href: mailto(site.email) },
    { label: c.github, value: site.githubLabel, href: realLink(site.github) },
    {
      label: c.linkedin,
      value: realLink(site.linkedin) ? site.linkedinLabel : site.linkedin,
      href: realLink(site.linkedin),
    },
  ];

  return (
    <Chapter id="contact" group="contact" vh={140} side="left" label={c.label}>
      <div className="w-full px-5 md:px-10 lg:px-16">
        <SectionLabel index="09" className="mb-8">
          {c.kicker}
        </SectionLabel>
        <MaskLines
          label={plain(c.headline)}
          className="display display-lg text-bone"
          lines={c.headline.map(rich)}
        />

        <div data-fade className="mt-10 flex flex-wrap gap-3">
          <MagneticButton
            href="#work"
            variant="solid"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("work");
            }}
          >
            {c.viewWork}
          </MagneticButton>
          {links.map((l) =>
            l.href ? (
              <MagneticButton
                key={l.label}
                href={l.href}
                {...(l.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {l.label}
              </MagneticButton>
            ) : null,
          )}
        </div>

        <ul data-fade className="mt-10 grid max-w-xl gap-3 border-t border-line pt-6">
          {links.map((l) => (
            <li key={l.label} className="grid grid-cols-[6rem_1fr] items-baseline gap-4">
              <span className="label">{l.label}</span>
              {l.href ? (
                <a
                  href={l.href}
                  className="pointer-events-auto link-underline break-all text-bone"
                  {...(l.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {l.value}
                </a>
              ) : (
                <span className={isPlaceholder(l.value) ? "placeholder-text" : "text-bone"}>
                  {l.value}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Chapter>
  );
}
