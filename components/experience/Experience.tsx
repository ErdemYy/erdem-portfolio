"use client";

import dynamic from "next/dynamic";
import ScrollController from "./ScrollController";
import ExperienceOverlay from "./ExperienceOverlay";
import Header from "@/components/ui/Header";
import ProgressIndicator from "@/components/ui/ProgressIndicator";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useExperience } from "@/lib/experience";
import { useLanguage } from "@/hooks/useLanguage";

// Three.js + drei only ever load in the browser, in their own chunk.
const ExperienceCanvas = dynamic(() => import("./ExperienceCanvas"), {
  ssr: false,
});

/** Home page shell: canvas (fixed) + scrolling DOM chapters + chrome. */
export default function Experience() {
  const ready = useExperience((s) => s.ready);
  const webgl = useExperience((s) => s.webgl);
  const { dict } = useLanguage();

  return (
    <>
      <a
        href="#content"
        className="sr-only fixed left-4 top-4 z-[95] bg-bone px-4 py-2 text-ink focus:not-sr-only"
      >
        {dict.navigation.skip}
      </a>

      <ScrollController />
      {ready && webgl && <ExperienceCanvas />}
      {ready && !webgl && <div className="fallback-bg" aria-hidden="true" />}
      <ExperienceOverlay />
      <Header />
      <ProgressIndicator />
      <LoadingScreen />
    </>
  );
}
