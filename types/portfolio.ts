import type { Localized } from "@/i18n/types";

export type PortfolioAsset = {
  id: string;
  name: string;
  path: string;
  type: string;
  author?: string;
  source?: string;
  license?: string;
  /** Untouched original that shipped with the project (kept for re-optimising). */
  originalPath?: string;
  /** What this asset is used for in the experience. */
  role?: string;
};

export type ProjectStatus = "completed" | "in-progress" | "concept";

export type ScreenLayout = "code" | "network" | "dashboard" | "mobile" | "editorial";

export type Project = {
  id: string;
  title: string;
  category: string;
  description: Localized;
  longDescription?: Localized;
  technologies: string[];
  status: ProjectStatus;
  featured?: boolean;
  github?: string;
  live?: string;
  image?: string;
  accent?: string;
  /** Which interface the 3D monitor shows for this project. */
  screenLayout?: ScreenLayout;
  /** Optional node labels for the network layout (defaults to technologies). */
  screenNodes?: string[];
  /** A real figure from the project (shown inside the dashboard screen). */
  figure?: string;
  /* Optional case-study fields — sections are only rendered when provided. */
  problem?: Localized;
  approach?: Localized;
  architecture?: Localized[];
  results?: Localized[];
  screenshots?: string[];
  result?: Localized;
};

export type TechCategoryKey =
  | "frontend"
  | "backend"
  | "database"
  | "mobile"
  | "infrastructure"
  | "languages";

export type TechCategory = { key: TechCategoryKey };

export type Technology = {
  id: string;
  name: string;
  category: TechCategoryKey;
};

export type ExperienceKind =
  | "education"
  | "internship"
  | "experience"
  | "certification";

export type ExperienceEntry = {
  id: string;
  kind: ExperienceKind;
  title: Localized;
  organization?: Localized;
  period?: string;
  description?: Localized;
};
