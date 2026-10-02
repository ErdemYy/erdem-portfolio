"use client";

import { createContext, useContext, type ComponentProps, type RefObject } from "react";
import { Html } from "@react-three/drei";

/**
 * drei's <Html> appends its DOM into the canvas wrapper and removes it again
 * on unmount; when the whole canvas is torn down by a route change those two
 * races can throw. Giving every <Html> a container we own (a sibling of the
 * canvas, see ExperienceCanvas) keeps the lifecycle deterministic.
 */
export const HtmlPortalContext = createContext<RefObject<HTMLDivElement | null> | null>(null);

export default function SceneHtml(props: ComponentProps<typeof Html>) {
  const portal = useContext(HtmlPortalContext);
  return <Html {...props} portal={portal as RefObject<HTMLElement>} />;
}
