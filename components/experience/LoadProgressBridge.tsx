"use client";

import { useEffect } from "react";
import { useProgress } from "@react-three/drei";
import { setExperience } from "@/lib/experience";

/**
 * Publishes the real asset loading progress (three's LoadingManager — every
 * GLB byte and texture counts) into the experience store for the loader UI.
 */
export default function LoadProgressBridge() {
  const progress = useProgress((s) => s.progress);
  useEffect(() => {
    setExperience({ loadProgress: progress });
  }, [progress]);
  return null;
}
