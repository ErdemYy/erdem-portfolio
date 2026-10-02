"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { applyMeta, getLang, initLanguage } from "./language";

/**
 * Mount once in the root layout. Applies the remembered / `?lang=` language
 * on first load and keeps <title> + social tags right after client-side route
 * changes (Next resets them to the build-time Turkish defaults).
 */
export default function LanguageProvider() {
  const pathname = usePathname();

  useEffect(() => {
    initLanguage();
  }, []);

  useEffect(() => {
    // after Next has applied the new route's metadata
    const id = window.setTimeout(() => applyMeta(getLang()), 60);
    return () => window.clearTimeout(id);
  }, [pathname]);

  // Next re-writes <title>/<meta> from its build-time (Turkish) metadata after
  // hydration and on navigation. Keep ours on top. applyMeta only writes when a
  // value differs, so this settles after one pass and cannot loop.
  useEffect(() => {
    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => applyMeta(getLang()));
    };
    const mo = new MutationObserver(run);
    mo.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["content"],
    });
    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
