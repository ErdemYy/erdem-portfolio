/**
 * Language-independent profile facts. All wording (role, headline, tagline,
 * bio, location, descriptions) lives in the dictionaries — see /i18n.
 * Anything wrapped in [BRACKETS] is a placeholder and is never rendered as a link.
 */
export const site = {
  name: "Erdem Yiğitsoy",
  /** Pre-uppercased: CSS `uppercase` would turn "i" into "I" instead of "İ". */
  nameUpper: "ERDEM YİĞİTSOY",
  email: "erdem.ygtsy@gmail.com",
  github: "https://github.com/ErdemYy",
  githubLabel: "github.com/ErdemYy",
  linkedin: "https://www.linkedin.com/in/erdem-yi%C4%9Fitsoy-6817472ba/",
  linkedinLabel: "linkedin.com/in/erdem-yiğitsoy",
  year: 2026,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

/** Navigation targets (labels: `navigation.*` in the dictionaries). */
export const navigation = [
  { key: "work", target: "work" },
  { key: "about", target: "about" },
  { key: "stack", target: "stack" },
  { key: "contact", target: "contact" },
] as const;
