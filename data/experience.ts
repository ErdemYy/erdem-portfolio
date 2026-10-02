import type { ExperienceEntry } from "@/types/portfolio";

/**
 * Add real education / internships / jobs / certifications here.
 * They render under the journey section as soon as the array is non-empty.
 * Nothing is invented — the array ships empty on purpose.
 */
export const experience: ExperienceEntry[] = [
  // {
  //   id: "edu-1",
  //   kind: "education",
  //   title: "Computer Engineering, B.Sc.",
  //   organization: "University",
  //   period: "2021 — 2025",
  // },
];

/** Phase order; titles and copy: `journey.phases.*` in the dictionaries. */
export const journeyPhaseKeys = ["build", "learn", "experiment", "ship"] as const;
