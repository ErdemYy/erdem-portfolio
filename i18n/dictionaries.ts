import { en } from "./en";
import { tr } from "./tr";
import type { Lang } from "./types";

/** The shape of a dictionary is defined by `en.ts`; `tr.ts` must match it. */
export type Dictionary = typeof en;

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Overlay `over` on `base`. Missing / empty values fall back to `base`, so a
 * forgotten key can never render as `undefined`.
 */
function merge<T>(base: T, over: unknown): T {
  if (over === undefined || over === null || over === "") return base;
  if (isObject(base) && isObject(over)) {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(base)) out[key] = merge(base[key], over[key]);
    return out as T;
  }
  return over as T;
}

/** Each language falls back to the other (TR → EN, EN → TR). */
export const dictionaries: Record<Lang, Dictionary> = {
  tr: merge<Dictionary>(en, tr),
  en: merge<Dictionary>(tr, en),
};
