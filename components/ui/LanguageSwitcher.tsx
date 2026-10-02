"use client";

import { languages } from "@/i18n/config";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

/**
 * TR / EN. Small and quiet in the header; two big touch targets in the mobile
 * menu. Switching never navigates — see i18n/language.ts.
 */
export default function LanguageSwitcher({
  variant = "header",
}: {
  variant?: "header" | "menu";
}) {
  const { lang, setLang, dict } = useLanguage();

  if (variant === "menu") {
    return (
      <div role="group" aria-label={dict.ui.language} className="flex gap-3">
        {languages.map((l) => (
          <button
            key={l.code}
            type="button"
            lang={l.code}
            aria-pressed={lang === l.code}
            onClick={() => setLang(l.code)}
            className={cn(
              "min-h-[48px] flex-1 border px-4 font-mono text-[0.8rem] tracking-[0.2em] transition-colors",
              lang === l.code
                ? "border-signal text-bone"
                : "border-line text-mute active:text-bone",
            )}
          >
            {l.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label={dict.ui.language}
      className="flex items-center gap-2 border-l border-line pl-6"
    >
      {languages.map((l, i) => (
        <span key={l.code} className="flex items-center gap-2">
          {i > 0 && <span className="h-3 w-px bg-white/15" aria-hidden="true" />}
          <button
            type="button"
            lang={l.code}
            aria-pressed={lang === l.code}
            aria-label={l.name}
            title={l.name}
            onClick={() => setLang(l.code)}
            className={cn(
              "label relative px-0.5 py-1 transition-colors duration-300",
              lang === l.code ? "!text-bone" : "hover:!text-bone",
            )}
          >
            {l.label}
            <span
              className={cn(
                "absolute inset-x-0 -bottom-px h-px origin-left bg-signal transition-transform duration-300",
                lang === l.code ? "scale-x-100" : "scale-x-0",
              )}
            />
          </button>
        </span>
      ))}
    </div>
  );
}
