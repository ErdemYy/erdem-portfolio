import { DEFAULT_LANG, STORAGE_KEY, isLang, languages, loc } from "./config";
import { dictionaries } from "./dictionaries";
import type { Lang } from "./types";
import { projects } from "@/data/projects";

/**
 * Language state lives in a tiny module-level store instead of React context:
 * the 3D monitors render their interfaces through drei <Html>, which mounts a
 * SEPARATE React root where context does not reach. `useSyncExternalStore`
 * (see hooks/useLanguage) works in every root.
 *
 * No URL routing on purpose: a /tr ↔ /en route change would remount the whole
 * page — i.e. reload the 3D scene and reset the camera. Switching here only
 * swaps strings.
 */
let current: Lang = DEFAULT_LANG;
const listeners = new Set<() => void>();

export const getLang = () => current;

export const subscribeLang = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

/* ---------------------------- document sync ----------------------------- */

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  if (el.getAttribute("content") !== content) el.setAttribute("content", content);
}

/** <title>, description and Open Graph / Twitter tags follow the language. */
export function applyMeta(lang: Lang = current) {
  if (typeof document === "undefined") return;
  const d = dictionaries[lang];
  let title = d.seo.title;
  let description = d.seo.description;

  const m = window.location.pathname.match(/^\/projects\/([^/]+)/);
  if (m) {
    const p = projects.find((x) => x.id === m[1]);
    if (p) {
      title = `${p.title} — ${d.seo.projectSuffix}`;
      description = loc(p.description, lang);
    }
  }

  if (document.title !== title) document.title = title;
  setMeta("name", "description", description);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:locale", languages.find((l) => l.code === lang)!.locale);
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
}

function commit(lang: Lang) {
  current = lang;
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* private mode — preference just isn't remembered */
    }
    document.cookie = `${STORAGE_KEY}=${lang}; path=/; max-age=31536000; samesite=lax`;
    applyMeta(lang);
  }
  listeners.forEach((l) => l());
}

/* -------------------------------- public -------------------------------- */

const FADE_MS = 170;
let timer: number | undefined;

/**
 * Switch language. Text fades out, swaps, fades back in (CSS, ~340 ms total).
 * Nothing else happens: no navigation, no scroll jump, no 3D reload.
 */
export function setLanguage(next: Lang, opts: { instant?: boolean } = {}) {
  if (next === current) return;
  if (typeof document === "undefined") {
    current = next;
    return;
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (opts.instant || reduced) {
    commit(next);
    return;
  }
  const root = document.documentElement;
  window.clearTimeout(timer);
  root.setAttribute("data-lang-switching", "");
  timer = window.setTimeout(() => {
    commit(next);
    window.requestAnimationFrame(() => root.removeAttribute("data-lang-switching"));
  }, FADE_MS);
}

/**
 * First load: `?lang=en` wins (shareable English link), then the remembered
 * choice, otherwise Turkish. Applied instantly (the loading screen is up).
 */
export function initLanguage() {
  let chosen: Lang = DEFAULT_LANG;
  const fromQuery = new URLSearchParams(window.location.search).get("lang");
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  if (isLang(fromQuery)) chosen = fromQuery;
  else if (isLang(stored)) chosen = stored;
  if (chosen !== current) commit(chosen);
  else {
    document.documentElement.lang = current;
    applyMeta(current);
  }
}
