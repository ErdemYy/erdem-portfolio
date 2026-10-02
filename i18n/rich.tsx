import type { ReactNode } from "react";

/**
 * Headline lines use `*word*` for the serif accent:
 *   "THAT *solves*"  →  THAT <span class="serif text-signal">solves</span>
 */
export function rich(line: string): ReactNode {
  const parts = line.split("*");
  if (parts.length === 1) return line;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="serif text-signal">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** Accessible plain text of a headline. */
export const plain = (lines: readonly string[]) => lines.join(" ").replace(/\*/g, "");
