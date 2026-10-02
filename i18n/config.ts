import type { Lang, Localized } from "./types";

export const languages = [
  { code: "tr", label: "TR", name: "Türkçe", locale: "tr_TR" },
  { code: "en", label: "EN", name: "English", locale: "en_US" },
] as const satisfies readonly { code: Lang; label: string; name: string; locale: string }[];

/** The site opens in Turkish for first-time visitors. */
export const DEFAULT_LANG: Lang = "tr";

export const STORAGE_KEY = "portfolio-language";

export const isLang = (v: unknown): v is Lang => v === "tr" || v === "en";

/** Resolve a Localized value (falls back to the other language, then ""). */
export function loc(value: Localized | undefined, lang: Lang): string {
  if (value === undefined) return "";
  if (typeof value === "string") return value;
  return value[lang] || value[lang === "tr" ? "en" : "tr"] || "";
}

/** "{n} nodes" → "7 nodes" */
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}
