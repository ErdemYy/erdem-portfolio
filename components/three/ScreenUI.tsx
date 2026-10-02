"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Quaternion, Vector3, type Group } from "three";
import ScreenAnchor from "./ScreenAnchor";
import SceneHtml from "./SceneHtml";
import { compactPx, type ScreenConfig } from "@/lib/screens";
import { smoothstep } from "@/lib/utils";
import { frame } from "@/lib/experience";

type Props = {
  config: ScreenConfig;
  /** narrow viewports author the interface at fewer, larger pixels */
  compact?: boolean;
  /** world distance over which the screen fades in */
  fade?: [number, number];
  /** when set, the glass is clickable while this returns true */
  interactive?: () => boolean;
  /** 0..1 extra visibility (e.g. the monitor "boots" with its chapter) */
  reveal?: () => number;
  children: ReactNode;
};

const wp = new Vector3();
const wq = new Quaternion();
const normal = new Vector3();
const toCam = new Vector3();

/**
 * Project/IDE interface rendered ON a 3D screen: drei <Html transform> as a
 * child of a ScreenAnchor. Transform, rotation and scale come from the model;
 * perspective from the camera. Fades by distance and viewing angle so it never
 * ghosts through the model.
 */
export default function ScreenUI({
  config,
  compact = false,
  fade = [16, 30],
  interactive,
  reveal,
  children,
}: Props) {
  const anchor = useRef<Group>(null);
  const el = useRef<HTMLDivElement>(null);
  const px = compact ? compactPx : config.px;
  const height = (px * config.height) / config.width;

  useFrame(({ camera }) => {
    const g = anchor.current;
    const node = el.current;
    if (!g || !node) return;
    g.getWorldPosition(wp);
    g.getWorldQuaternion(wq);
    normal.set(0, 0, 1).applyQuaternion(wq);
    toCam.copy(camera.position).sub(wp);
    const dist = toCam.length();
    toCam.normalize();
    const facing = smoothstep(0.12, 0.4, normal.dot(toCam));
    const near = 1 - smoothstep(fade[0], fade[1], dist);
    const vis = facing * near * frame.intro * (reveal ? reveal() : 1);
    node.style.opacity = vis.toFixed(3);
    if (interactive) {
      const active = vis > 0.6 && interactive();
      node.style.pointerEvents = active ? "auto" : "none";
      node.toggleAttribute("inert", !active);
    }
  });

  return (
    <ScreenAnchor ref={anchor} config={config}>
      <SceneHtml
        transform
        center
        // 1 CSS px = (distanceFactor / 400) local units
        distanceFactor={(400 * config.width) / px}
        zIndexRange={[4, 0]}
        pointerEvents="none"
        style={{ width: px, height }}
      >
        <div
          ref={el}
          className="screen-surface"
          style={{ width: px, height, opacity: 0 }}
        >
          {children}
          <span aria-hidden="true" className="screen-glass" />
        </div>
      </SceneHtml>
    </ScreenAnchor>
  );
}
