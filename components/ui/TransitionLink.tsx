"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { routeTransition } from "@/lib/transition";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** CSS selector (relative to document) of the element that should expand. */
  sourceSelector?: string;
  accent?: string;
};

/** Link that morphs a source element into the next page. Falls back to Link. */
export default function TransitionLink({
  href,
  sourceSelector,
  accent = "#ff5b2e",
  onClick,
  children,
  ...rest
}: Props) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    )
      return;
    const source = sourceSelector
      ? document.querySelector(sourceSelector)
      : e.currentTarget;
    const rect = (source ?? e.currentTarget).getBoundingClientRect();
    if (routeTransition.start({ rect, color: accent, href })) {
      e.preventDefault();
    }
  };

  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
