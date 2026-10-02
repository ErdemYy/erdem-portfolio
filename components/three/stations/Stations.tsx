"use client";

import { useMemo, useRef } from "react";
import SceneHtml from "../SceneHtml";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import ModelRenderer from "../ModelRenderer";
import NetworkLines from "../NetworkLines";
import FloatingUI from "../FloatingUI";
import MobileLayers from "../MobileLayers";
import ScreenUI from "../ScreenUI";
import DeskScreen from "../screens/DeskScreen";
import LaptopScreen from "../screens/LaptopScreen";
import { assets } from "@/data/assets";
import { technologies, techCategories, techRelations } from "@/data/skills";
import {
  deskPlacement,
  laptopHidden,
  laptopPlacement,
  stations,
  type V3,
} from "@/lib/world";
import { getExperience, useExperience } from "@/lib/experience";
import { useLanguage } from "@/hooks/useLanguage";
import { screenConfig } from "@/lib/screens";
import { perfConfig } from "@/lib/performance";
import { poseWeight as pw } from "@/lib/three-utils";
import { poseWeight, setGroupOpacity } from "@/lib/three-utils";
import { clamp, smootherstep } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  DESK — hero environment, also hosts the web floating UI + monitor  */
/* ------------------------------------------------------------------ */
export function DeskStation({ onReady }: { onReady?: () => void }) {
  const narrow = useExperience((st) => st.narrow);
  return (
    <group position={stations.desk.position}>
      <ModelRenderer
        asset={assets.desk}
        position={deskPlacement.position}
        scale={deskPlacement.scale}
        onReady={onReady}
        fallbackSize={4}
      >
        <ScreenUI
          config={screenConfig.desk}
          compact={narrow}
          fade={[14, 26]}
          interactive={() => getExperience().chapterId === "featured"}
          reveal={() => 0.25 + 0.75 * pw("featured")}
        >
          <DeskScreen />
        </ScreenUI>
      </ModelRenderer>
      <FloatingUI />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  PHONE                                                              */
/* ------------------------------------------------------------------ */
export function PhoneStation() {
  const spin = useRef<Group>(null);

  useFrame(({ clock }, dt) => {
    const g = spin.current;
    if (!g) return;
    const slow = getExperience().reducedMotion ? 0.15 : 1;
    g.rotation.y += Math.min(dt, 0.05) * 0.35 * slow;
    g.position.y = 3 + Math.sin(clock.elapsedTime * 0.8) * 0.1 * slow;
  });

  return (
    <group position={stations.phone.position}>
      <group ref={spin} position={[0, 3, 0]}>
        <ModelRenderer
          asset={assets.phone}
          position={[0, -0.44 * 6, 0]}
          scale={6}
          fallbackSize={2}
        />
      </group>
      <group position={[0, 3, 0]}>
        <MobileLayers />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  BACKEND — rack + request flow                                      */
/* ------------------------------------------------------------------ */
const flowNodes: V3[] = [
  [7.6, 5.4, -2.4],
  [5.6, 4.6, -1.4],
  [3.8, 3.8, -0.4],
  [2.6, 2.4, 0.9],
];
const flowEdges: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
];

export function BackendStation() {
  const { dict } = useLanguage();
  const cfg = perfConfig[useExperience((st) => st.perf)];
  const flowLabels = dict.build.flow;
  const labels = useRef<Group>(null);

  const flow = useRef<Group>(null);

  useFrame(() => {
    const v = poseWeight("backend");
    document.documentElement.style.setProperty("--backend-vis", v.toFixed(2));
    if (labels.current) labels.current.visible = v > 0.02;
    if (flow.current) setGroupOpacity(flow.current, 0.04 + 0.96 * v);
  });

  const nodes = useMemo(() => flowNodes, []);
  const edges = useMemo(() => [...flowEdges, [3, 4] as [number, number]], []);
  const withRack = useMemo<V3[]>(() => [...nodes, [0.6, 3.1, 0.5]], [nodes]);

  return (
    <group position={stations.backend.position}>
      <ModelRenderer
        asset={assets.server}
        position={[0, 3, 0]}
        scale={3}
        fallbackSize={3}
      />
      <group ref={flow}>
        <NetworkLines nodes={withRack} edges={edges} color="#4f8cff" nodeSize={0.1} pulses={cfg.pulses} />
      </group>
      <group ref={labels}>
        {flowLabels.slice(0, 4).map((label, i) => (
          <SceneHtml
            key={label}
            position={[flowNodes[i][0], flowNodes[i][1] + 0.45, flowNodes[i][2]]}
            center
            zIndexRange={[3, 0]}
            style={{ pointerEvents: "none" }}
          >
            <span className="node-label" style={{ opacity: "var(--backend-vis, 0)" }}>
              {label}
            </span>
          </SceneHtml>
        ))}
        <SceneHtml
          position={[0, 6.6, 0]}
          center
          zIndexRange={[3, 0]}
          style={{ pointerEvents: "none" }}
        >
          <span className="node-label" style={{ opacity: "var(--backend-vis, 0)" }}>
            {flowLabels[4]}
          </span>
        </SceneHtml>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  SYSTEMS — a row of racks wired into a mesh                         */
/* ------------------------------------------------------------------ */
const rackX = [-4.2, 0, 4.2];

const systemsNodes: V3[] = [
  [-4.2, 6.1, 0],
  [0, 6.1, 0],
  [4.2, 6.1, 0],
  [-2.1, 7.6, -1.2],
  [2.1, 7.6, -1.2],
  [0, 9, -2.2],
  [-6.2, 4.4, 2.2],
  [6.2, 4.4, 2.2],
  [0, 3.4, 3.4],
];
const systemsEdges: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [1, 3],
  [1, 4],
  [2, 4],
  [3, 5],
  [4, 5],
  [0, 6],
  [2, 7],
  [1, 8],
  [6, 8],
  [7, 8],
];

export function SystemsStation() {
  const group = useRef<Group>(null);
  const cfg = perfConfig[useExperience((st) => st.perf)];

  useFrame(() => {
    // the mesh draws itself in as the systems chapter takes over
    const g = group.current;
    if (!g) return;
    const w = poseWeight("systems");
    setGroupOpacity(g, 0.05 + 0.95 * w);
  });

  return (
    <group position={stations.systems.position}>
      {rackX.map((x) => (
        <ModelRenderer
          key={x}
          asset={assets.server}
          position={[x, 2.8, 0]}
          scale={2.8}
          fallbackSize={2.8}
        />
      ))}
      <group ref={group}>
        <NetworkLines
          nodes={systemsNodes}
          edges={systemsEdges}
          color="#4f8cff"
          nodeSize={0.1}
          pulses={cfg.pulses}
        />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  LAPTOP — IDE on the glass                                          */
/* ------------------------------------------------------------------ */
export function LaptopStation() {
  const narrow = useExperience((st) => st.narrow);
  return (
    <group position={stations.laptop.position}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[8, 0.5, 5.6]} />
        <meshStandardMaterial color="#0f1013" roughness={0.55} metalness={0.4} />
      </mesh>
      <ModelRenderer
        asset={assets.laptop}
        hide={laptopHidden}
        position={laptopPlacement.position}
        scale={laptopPlacement.scale}
        fallbackSize={2.4}
      >
        <ScreenUI
          config={screenConfig.laptop}
          compact={narrow}
          fade={[18, 34]}
          interactive={() => {
            const st = getExperience();
            return st.group === "open" || st.chapterId.startsWith("project-");
          }}
        >
          <LaptopScreen />
        </ScreenUI>
      </ModelRenderer>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  PC — workstation, focal object for the project chapters            */
/* ------------------------------------------------------------------ */
export function PcStation() {
  return (
    <group position={stations.pc.position}>
      <ModelRenderer
        asset={assets.pc}
        position={[0, 0, 0]}
        scale={4}
        fallbackSize={2}
      />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  CONSTELLATION — software engineering at the centre                 */
/* ------------------------------------------------------------------ */
function buildConstellation(maxTechs: number, links: boolean) {
  const nodes: V3[] = [[0, 0, 0]];
  const edges: [number, number][] = [];
  const index = new Map<string, number>();
  const emphasis: Record<number, number> = { 0: 3.4 };
  const labels: { id: string; text: string; pos: V3; kind: "center" | "category" | "tech" }[] = [
    { id: "center", text: "", pos: [0, 0, 0], kind: "center" },
  ];

  const n = techCategories.length;
  techCategories.forEach((cat, ci) => {
    // fibonacci-ish spread so categories surround the centre in 3D
    const y = 1 - (ci / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = ci * 2.399963;
    const dir: V3 = [Math.cos(theta) * r, y * 0.65, Math.sin(theta) * r];
    const R1 = 4.6;
    const cpos: V3 = [dir[0] * R1, dir[1] * R1, dir[2] * R1];
    const cIdx = nodes.push(cpos) - 1;
    edges.push([0, cIdx]);
    emphasis[cIdx] = 2;
    labels.push({ id: cat.key, text: "", pos: cpos, kind: "category" });

    const techs = technologies.filter((t) => t.category === cat.key).slice(0, maxTechs);
    techs.forEach((t, ti) => {
      const a = (ti / techs.length) * Math.PI * 2 + ci;
      const spread = 1.7;
      const tpos: V3 = [
        cpos[0] + dir[0] * 1.5 + Math.cos(a) * spread * 0.9,
        cpos[1] + dir[1] * 1.5 + Math.sin(a) * spread * 0.75,
        cpos[2] + dir[2] * 1.5 + Math.cos(a * 1.7) * spread * 0.9,
      ];
      const tIdx = nodes.push(tpos) - 1;
      index.set(t.id, tIdx);
      edges.push([cIdx, tIdx]);
      labels.push({ id: t.id, text: t.name, pos: tpos, kind: "tech" });
    });
  });

  (links ? techRelations : []).forEach(([a, b]) => {
    const ia = index.get(a);
    const ib = index.get(b);
    if (ia !== undefined && ib !== undefined) edges.push([ia, ib]);
  });

  return { nodes, edges, labels, emphasis };
}

export function Constellation() {
  const { dict } = useLanguage();
  const perf = useExperience((st) => st.perf);
  const narrow = useExperience((st) => st.narrow);
  const cfg = perfConfig[perf];
  const group = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const data = useMemo(
    () => buildConstellation(cfg.constellationTechs, cfg.constellationLinks),
    [cfg.constellationTechs, cfg.constellationLinks],
  );
  useFrame((_, dt) => {
    const g = group.current;
    const s = spin.current;
    if (!g || !s) return;
    const w = poseWeight("stack");
    const k = smootherstep(clamp(w, 0, 1));
    // smaller on phones so the whole cluster fits a portrait frame
    g.scale.setScalar((0.35 + 0.65 * k) * (narrow ? 0.66 : 1));
    setGroupOpacity(g, 0.05 + 0.95 * k);
    if (!getExperience().reducedMotion) s.rotation.y += Math.min(dt, 0.05) * 0.05;
    document.documentElement.style.setProperty("--stack-vis", k.toFixed(2));
  });

  return (
    <group position={stations.constellation.position}>
      <group ref={group}>
        <group ref={spin}>
          <NetworkLines
            nodes={data.nodes}
            edges={data.edges}
            color="#c9d3e6"
            nodeSize={0.075}
            emphasis={data.emphasis}
            pulses={cfg.pulses}
            opacity={0.35}
          />
          {data.labels.map((l) => (
            <SceneHtml
              key={l.id}
              position={l.pos}
              center
              zIndexRange={[3, 0]}
              style={{ pointerEvents: "none" }}
            >
              <span
                className={`node-label node-${l.kind}`}
                style={{ opacity: "var(--stack-vis, 0)" }}
              >
                {l.kind === "center"
                  ? dict.skills.center
                  : l.kind === "category"
                    ? dict.skills.categories[l.id as keyof typeof dict.skills.categories]
                    : l.text}
              </span>
            </SceneHtml>
          ))}
        </group>
      </group>
    </group>
  );
}
