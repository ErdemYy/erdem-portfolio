"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation, site } from "@/data/site";
import { scrollToTarget } from "@/lib/lenis";
import { audio } from "@/lib/audio";
import { setExperience, useExperience } from "@/lib/experience";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSwitcher from "./LanguageSwitcher";
import { cn } from "@/lib/utils";

/** Fixed, deliberately small. Smooth-scrolls on the home page. */
export default function Header({ standalone = false }: { standalone?: boolean }) {
  const pathname = usePathname();
  const onHome = pathname === "/" && !standalone;
  const group = useExperience((s) => s.group);
  const menuOpen = useExperience((s) => s.menuOpen);
  const soundOn = useExperience((s) => s.soundOn);
  const soundAvailable = useExperience((s) => s.soundAvailable);
  const { dict } = useLanguage();

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExperience({ menuOpen: false });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const go = (target: string) => (e: React.MouseEvent) => {
    audio.play("click");
    setExperience({ menuOpen: false });
    if (!onHome) return; // regular link to /#target
    e.preventDefault();
    scrollToTarget(target);
  };

  const home = (e: React.MouseEvent) => {
    audio.play("click");
    setExperience({ menuOpen: false });
    if (!onHome) return;
    e.preventDefault();
    scrollToTarget(0);
  };

  const soundLabel = `${dict.ui.sound} ${soundOn ? dict.ui.on : dict.ui.off}`;

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 md:px-10 md:py-7">
        <Link
          href="/"
          onClick={home}
          className="pointer-events-auto label !text-bone link-underline -my-3 py-3"
          aria-label={`${site.name} — ${dict.navigation.home}`}
        >
          {site.nameUpper}
        </Link>

        <nav
          aria-label={dict.navigation.primary}
          className="pointer-events-auto hidden items-center gap-9 md:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.target}
              href={`/#${item.target}`}
              onClick={go(item.target)}
              className={cn(
                "label link-underline transition-colors",
                onHome && group === item.target ? "!text-bone" : "hover:!text-bone",
              )}
              aria-current={onHome && group === item.target ? "true" : undefined}
            >
              {dict.navigation[item.key]}
            </Link>
          ))}
          {soundAvailable && (
            <button
              type="button"
              onClick={() => audio.toggle()}
              className="label hover:!text-bone"
              aria-pressed={soundOn}
            >
              {soundLabel}
            </button>
          )}
          <LanguageSwitcher />
        </nav>

        <button
          type="button"
          className="pointer-events-auto label -m-3 flex min-h-[48px] min-w-[48px] items-center justify-end !text-bone p-3 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setExperience({ menuOpen: !menuOpen })}
        >
          {menuOpen ? dict.ui.close : dict.ui.menu}
        </button>
      </header>

      {/* compact mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 flex flex-col justify-end gap-8 bg-ink/95 px-6 pb-14 backdrop-blur-sm transition-opacity duration-500 md:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!menuOpen}
      >
        <nav aria-label={dict.navigation.mobile} className="flex flex-col gap-5">
          {navigation.map((item, i) => (
            <Link
              key={item.target}
              href={`/#${item.target}`}
              onClick={go(item.target)}
              tabIndex={menuOpen ? 0 : -1}
              className="display display-md text-bone"
            >
              <span className="label mr-4 align-middle">0{i + 1}</span>
              {dict.navigation[item.key]}
            </Link>
          ))}
          {soundAvailable && (
            <button
              type="button"
              onClick={() => audio.toggle()}
              tabIndex={menuOpen ? 0 : -1}
              className="label mt-4 text-left"
            >
              {soundLabel}
            </button>
          )}
        </nav>
        {/* stays open while the language changes */}
        <div className={menuOpen ? "" : "pointer-events-none"}>
          <LanguageSwitcher variant="menu" />
        </div>
      </div>
    </>
  );
}
