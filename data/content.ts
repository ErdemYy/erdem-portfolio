/** Language-independent content constants. (All wording lives in /i18n.) */

/** Technology chips under each "what I build" area — never translated. */
export const buildTags = {
  web: ["REACT", "NEXT.JS", "TYPESCRIPT"],
  mobile: ["FLUTTER", "DART", "MOBILE"],
  backend: ["NODE.JS", "NESTJS", "SQL"],
  systems: ["DOCKER", "POSTGRESQL", "MSSQL"],
} as const;

export const buildAreaKeys = ["web", "mobile", "backend", "systems"] as const;
export const laptopTabKeys = ["projects", "code", "architecture", "debugging"] as const;
export const engineeringKeys = [
  "architecture",
  "security",
  "performance",
  "scalability",
  "automation",
  "problem-solving",
] as const;
