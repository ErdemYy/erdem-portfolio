"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { DEFAULT_LANG, fmt, loc } from "@/i18n/config";
import { dictionaries, type Dictionary } from "@/i18n/dictionaries";
import { getLang, setLanguage, subscribeLang } from "@/i18n/language";
import type { Lang, Localized, Paths } from "@/i18n/types";
import type { Project } from "@/types/portfolio";

export type LocalizedProject = Omit<
  Project,
  "description" | "longDescription" | "problem" | "approach" | "architecture" | "results" | "result"
> & {
  description: string;
  longDescription?: string;
  problem?: string;
  approach?: string;
  architecture?: string[];
  results?: string[];
  result?: string;
};

export function localizeProject(p: Project, lang: Lang): LocalizedProject {
  const l = (v?: Localized) => (v === undefined ? undefined : loc(v, lang));
  return {
    ...p,
    description: loc(p.description, lang),
    longDescription: l(p.longDescription),
    problem: l(p.problem),
    approach: l(p.approach),
    architecture: p.architecture?.map((a) => loc(a, lang)),
    results: p.results?.map((r) => loc(r, lang)),
    result: l(p.result),
  };
}

/**
 * Translation access for any component — including the ones inside the 3D
 * screens (separate React roots). `dict` is fully typed; `t("a.b")` is checked
 * against the real key paths and never returns undefined.
 */
export function useLanguage() {
  // server + hydration render use the default language; the stored choice is
  // applied right after mount (behind the loading screen)
  const lang = useSyncExternalStore(subscribeLang, getLang, () => DEFAULT_LANG);
  const dict: Dictionary = dictionaries[lang];

  const t = useCallback(
    (key: Paths<Dictionary>, vars?: Record<string, string | number>): string => {
      let node: unknown = dictionaries[lang];
      for (const part of key.split(".")) {
        node = (node as Record<string, unknown> | undefined)?.[part];
      }
      if (typeof node !== "string") {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[i18n] missing translation: ${key} (${lang})`);
        }
        return key;
      }
      return vars ? fmt(node, vars) : node;
    },
    [lang],
  );

  const project = useCallback((p: Project) => localizeProject(p, lang), [lang]);
  const l = useCallback((v?: Localized) => loc(v, lang), [lang]);

  return useMemo(
    () => ({ lang, dict, t, project, loc: l, setLang: setLanguage }),
    [lang, dict, t, project, l],
  );
}
