"use client";

import type { Project } from "@/types/portfolio";
import { pad } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

type Props = {
  project: Project;
  index: number;
  className?: string;
  /** hide the "placeholder" caption (used on tiny surfaces) */
  quiet?: boolean;
};

/**
 * Project visual. Uses `project.image` when provided; otherwise renders a
 * gradient-free technical composition that clearly reads as "screenshot goes
 * here" — never a stock photo.
 */
export default function ProjectVisual({ project, index, className, quiet }: Props) {
  const { dict } = useLanguage();
  if (project.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.image}
        alt={`${project.title} — ${dict.ui.preview}`}
        className={className}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
        loading="lazy"
      />
    );
  }

  const accent = project.accent ?? "#ff5b2e";
  const variant = index % 3;
  const stroke = "rgba(236,234,228,0.16)";

  return (
    <svg
      viewBox="0 0 800 560"
      className={className}
      role="img"
      aria-label={`${project.title} — ${dict.ui.preview}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <rect width="800" height="560" fill="#0d0e11" fillOpacity="1" />
      {/* grid */}
      {Array.from({ length: 15 }, (_, i) => (
        <line key={`v${i}`} x1={i * 57.2} y1="0" x2={i * 57.2} y2="560" stroke="rgba(255,255,255,0.035)" />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 56} x2="800" y2={i * 56} stroke="rgba(255,255,255,0.035)" />
      ))}

      {variant === 0 &&
        [0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={250 + i * 22}
            y={110 + i * 22}
            width={300 - i * 44}
            height={300 - i * 44}
            fill="none"
            stroke={i === 0 ? accent : stroke}
            strokeWidth={i === 0 ? 1.6 : 1}
            transform={`rotate(${i * 7} 400 260)`}
          />
        ))}

      {variant === 1 &&
        Array.from({ length: 9 }, (_, i) => (
          <rect
            key={i}
            x="150"
            y={120 + i * 34}
            width={150 + ((i * 97) % 340)}
            height="14"
            fill={i === 3 ? accent : "rgba(236,234,228,0.13)"}
          />
        ))}

      {variant === 2 && (
        <>
          {Array.from({ length: 8 }, (_, r) =>
            Array.from({ length: 12 }, (_, c) => (
              <circle
                key={`${r}-${c}`}
                cx={170 + c * 40}
                cy={120 + r * 42}
                r="2.2"
                fill={(r + c) % 7 === 0 ? accent : "rgba(236,234,228,0.28)"}
              />
            )),
          )}
          <line x1="170" y1="430" x2="610" y2="120" stroke={accent} strokeWidth="1.4" />
        </>
      )}

      {/* corner marks */}
      {[
        [32, 32, 1, 1],
        [768, 32, -1, 1],
        [32, 528, 1, -1],
        [768, 528, -1, -1],
      ].map(([x, y, dx, dy], i) => (
        <path
          key={i}
          d={`M${x + dx * 22} ${y} L${x} ${y} L${x} ${y + dy * 22}`}
          fill="none"
          stroke="rgba(236,234,228,0.4)"
        />
      ))}

      <text
        x="48"
        y="86"
        fontFamily="var(--font-display), sans-serif"
        fontSize="54"
        fill="none"
        stroke="rgba(236,234,228,0.55)"
        strokeWidth="1"
      >
        {pad(index + 1)}
      </text>
      {!quiet && (
        <text
          x="48"
          y="516"
          fontFamily="var(--font-mono), monospace"
          fontSize="13"
          letterSpacing="3"
          fill="rgba(236,234,228,0.45)"
        >
          {dict.ui.placeholder}
        </text>
      )}
    </svg>
  );
}
