"use client";

import Link from "next/link";
import { navigation, site } from "@/data/site";
import { useLanguage } from "@/hooks/useLanguage";
import { realLink } from "@/lib/utils";

/** Minimal footer. */
export default function Footer() {
  const { dict } = useLanguage();
  const github = realLink(site.github);
  const linkedin = realLink(site.linkedin);

  return (
    <footer className="pointer-events-auto relative z-10 border-t border-line bg-ink/80 px-5 py-10 md:px-10 lg:px-16">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="display display-sm !leading-none">{site.nameUpper}</div>
          <div className="label mt-2">{dict.profile.role}</div>
        </div>

        <nav aria-label={dict.navigation.footer} className="flex flex-wrap gap-x-8 gap-y-3">
          {navigation
            .filter((n) => n.target !== "stack")
            .map((n) => (
              <Link key={n.target} href={`/#${n.target}`} className="label link-underline hover:!text-bone">
                {dict.navigation[n.key]}
              </Link>
            ))}
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer" className="label link-underline hover:!text-bone">
              {dict.contact.github}
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="label link-underline hover:!text-bone">
              {dict.contact.linkedin}
            </a>
          )}
        </nav>

        <div className="label">© {site.year}</div>
      </div>
    </footer>
  );
}
