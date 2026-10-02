import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  /** accessible full text (the visual lines are split) */
  label?: string;
};

/**
 * Splits a headline into masked lines. Each inner span carries `data-mask`
 * so <Chapter> (or the hero) can slide it up from behind the mask.
 */
export default function MaskLines({
  lines,
  as = "h2",
  className,
  lineClassName,
  label,
}: Props) {
  const Tag = as as ElementType<{
    className?: string;
    "aria-label"?: string;
    children?: ReactNode;
  }>;
  return (
    <Tag className={className} aria-label={label}>
      {lines.map((line, i) => (
        <span key={i} className={cn("mask", lineClassName)} aria-hidden={label ? true : undefined}>
          <span data-mask>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
