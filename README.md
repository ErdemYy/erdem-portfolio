# 3D Developer Portfolio

An interactive, scroll-driven WebGL portfolio. One fixed fullscreen canvas is the
spine of the experience — a developer's digital workspace — and every section of
the page is a **camera chapter**: scrolling flies the camera between a desk, a
phone, a server rack, a laptop and a technology constellation, blending light,
fog and bloom as it goes. Reverse scrolling is exact.

Inspired by the *idea* of fullscreen scroll storytelling; the design, code and
copy are original.

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict) |
| 3D | three · @react-three/fiber · @react-three/drei · @react-three/postprocessing |
| Motion | GSAP + ScrollTrigger, Lenis (smooth scroll, driven by the GSAP ticker) |
| Styling | Tailwind CSS v4 + CSS design tokens |
| Models | GLB, meshopt-compressed, WebP textures |

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (all routes prerendered)
npm run start        # serve the production build
npm run typecheck    # tsc --noEmit
npm run lint
```

Requires Node 20+.

## Project structure

```
app/                       routes, metadata, OG image, robots, sitemap
  projects/[slug]/         case-study pages
components/
  experience/              canvas, scene, camera controller, Lenis scroll controller
  three/                   ModelRenderer, Lighting, Environment, Particles, NetworkLines,
                           PostProcessing, ScreenOverlay (DOM on 3D screens), stations/
  sections/                one component per page section (+ Chapter wrapper)
  projects/                showcase, items, filters, featured block, detail page
  ui/                      Header, CustomCursor, LoadingScreen, ProgressIndicator, …
data/                      ★ all content lives here (see below)
hooks/ lib/ types/         store, choreography, world layout, audio, utilities
public/models/             original GLBs          public/models/optimized/  compressed copies
scripts/optimize-models.mjs
```

## How the scroll → 3D system works

* Every `<Chapter>` renders a `<section data-chapter data-pose>`; its height is the
  scroll distance for that camera pose.
* `ScrollController` measures chapters and, per scroll event, writes into a mutable
  `frame` object: which two chapters are being blended, the blend factor and the
  local progress. **React is not re-rendered while scrolling** — only when the
  active chapter changes.
* `CameraController` (runs first in the frame loop) evaluates the two waypoints
  (`lib/choreography.ts`), applies orbit/dolly for the local progress, damps the
  result, adds a tiny pointer parallax and writes a shared `rig`
  (camera + light profile + fog + bloom). `Lighting`, fog and post-processing only
  read the rig.
* Poses are defined relative to stations (`lib/world.ts`), so moving a station
  moves its camera shots with it.

### Camera choreography

| Chapter | Move |
| --- | --- |
| Hero | wide establishing shot of the desk, intro reveal |
| About | slow orbit around the desk |
| What I build | pulled back, then travels station to station (web → mobile → backend → systems) |
| Laptop | closes in on the screen; the IDE tabs advance with scroll |
| Projects | pushes toward focal objects (laptop, PC, desk) |
| Featured | closes in on the desk monitor, which shows the project |
| Tech stack | scene expands; constellation draws in |
| Engineering / Journey | overhead and low-angle desk shots |
| Contact | camera pulls far away |

## Languages (TR / EN)

Every visible string comes from one dictionary pair — nothing is hard-coded in
components, including the interfaces on the 3D monitors.

```
i18n/
  en.ts            ← defines the SHAPE of a dictionary (English)
  tr.ts            ← must match it exactly — TypeScript fails the build if a key is missing
  dictionaries.ts  ← merges them; a missing/empty value falls back to the other language
  language.ts      ← the language store: set/get, persistence, <title>/meta + <html lang> sync
  config.ts        ← languages, default (TR), loc() / fmt() helpers
  rich.tsx         ← `*accent*` markup for serif headline words
hooks/useLanguage.ts          const { lang, dict, t, project, setLang } = useLanguage()
components/ui/LanguageSwitcher.tsx
```

* `dict.about.kicker` is fully typed; `t("about.kicker")` is checked against the real
  key paths. Missing keys never render `undefined` (fallback + a dev-only console warning).
* Project content (`data/projects.ts`) is `Localized`: `{ tr, en }`, or a plain string when
  it is identical (project names and technology names are never translated).
* Status labels, filter names, buttons and every label inside the monitor UIs are
  dictionary entries; internal values (`in-progress`, `ai-data`…) stay language-neutral.
* The store is module-level (not React context) on purpose: the 3D screens are rendered by
  drei `<Html>` in a separate React root where context does not reach.
* **No URL routing (`/tr`, `/en`).** A route change would remount the page — reloading the
  3D scene and resetting the camera. Switching language only fades the text out and in
  (~340 ms), keeping scroll position, camera and models. Open `/?lang=en` to share an English link.
* First visit opens in Turkish; the choice is remembered in `localStorage` (`portfolio-language`)
  and a cookie. `<html lang>`, `<title>`, description and Open Graph / Twitter tags follow the
  language. Build-time (crawler) metadata is Turkish, with an `hreflang` alternate for `?lang=en`.

**Add a string:** add the key to `en.ts`, then to `tr.ts`. **Add a project:** give `description`
(and any optional case-study text) as `{ tr, en }`.

## Projects live on the 3D screens

Projects are not a page panel — they are software running on the models:

* **Desk monitor** — boots into the featured project.
* **Laptop** — shows whichever project the scroll chapter is on (the scroll
  controller writes `projectId` into the store; the screen swaps with a clip
  reveal). In *Code in the open* it becomes a clickable repository browser.
* Each project picks its interface with `screenLayout` in `data/projects.ts`:
  `code` · `network` · `dashboard` · `mobile` · `editorial` (React views in
  `components/projects/Project*View.tsx`, built from the project's real data).

How it is attached: `ScreenUI` (drei `<Html transform>`) is a child of a
`ScreenAnchor` group that is a child of the model, so position / rotation / scale
come from the model and perspective from the camera. Glass geometry (glTF node,
position, rotation, scale, width/height) lives in **`lib/screens.ts`** — change the
model, change only that file. Open the site with `?debugScreens` in development to
see each anchor as a red wireframe plane. Narrow viewports author the interface at
560 px instead of 1000 px and the camera widens its lens until the glass fits.

## Editing content

Everything shown on the site comes from `data/`. Values in `[BRACKETS]` are
placeholders and are never rendered as links.

| File | What it controls |
| --- | --- |
| `data/site.ts` | name, role, tagline, email, GitHub, LinkedIn, location, bio, nav |
| `data/projects.ts` | projects + filter categories |
| `data/skills.ts` | technologies, categories, constellation relations |
| `data/experience.ts` | education / internship / jobs / certifications + journey phases |
| `data/content.ts` | About, "what I build", engineering mindset, laptop tabs |
| `data/assets.ts` | 3D asset registry + licences (also drives the footer credits) |

### Adding a project

Append to `projects` in `data/projects.ts`:

```ts
{
  id: "my-project",              // becomes /projects/my-project
  title: "My Project",
  category: "web",               // web | mobile | backend | ai-data | systems
  description: "One sentence.",
  technologies: ["Next.js", "PostgreSQL"],
  status: "in-progress",         // completed | in-progress | concept — be honest
  github: "https://github.com/…",// optional → "View Source" button
  live: "https://…",             // optional → "Live Demo" button
  image: "/images/my-project.png", // optional → replaces the placeholder composition
  featured: true,                // exactly one project should be featured
}
```

Optional case-study fields (`problem`, `approach`, `architecture`, `results`,
`screenshots`, `result`) fill the detail page; missing ones show a `[PLACEHOLDER]`.
Buttons only render for data that exists.

### Adding skills

Add `{ id, name, category }` to `technologies` in `data/skills.ts`; add pairs to
`techRelations` to draw extra links in the constellation. No skill levels — by design.

### Editing profile info

Edit `data/site.ts`. `site.url` (the production origin, `https://erdemyigitsoy.com`)
drives canonical, Open Graph, sitemap and robots URLs.

## 3D assets

Real files found in `public/models`:

| Asset | Used for | Original → optimised |
| --- | --- | --- |
| Modern Desk Setup | hero environment, monitor shows featured project | 5.99 MB → 0.98 MB |
| Low poly laptop computer | IDE screen overlay (room/table meshes hidden) | 3.55 MB → 0.67 MB |
| Low Poly Mobile Phone | mobile chapter | 86 KB → 16 KB |
| Server Rack (skinned) | backend (×1) and systems (×3 + network mesh) | 772 KB → 100 KB |
| PC Setup | project focal object | 9.05 MB → 0.29 MB |

### Adding a new model

1. Drop the `.glb` into `public/models/`.
2. `npm run optimize:models` — writes a meshopt + WebP copy to `public/models/optimized/`.
3. Register it in `data/assets.ts` (path, author, source, licence).
4. Place it in a station (`components/three/stations/Stations.tsx`) with `<ModelRenderer asset={…} />`.
   `ModelRenderer` handles Suspense, an error boundary (a broken model never crashes the
   site), `SkeletonUtils` cloning (needed for skinned models) and disposal.

FBX / OBJ are not loaded directly. Convert first:
`npx fbx2gltf -i model.fbx -o model.glb` or `npx obj2gltf -i model.obj -o model.glb`,
or import into Blender → *File → Export → glTF 2.0 (.glb)*.

## Mobile & performance tiers

Phones get their own experience, not a shrunken desktop.

**Breakpoints** — mobile-small `<380` (`max-xs:`) · mobile `<768` · tablet `768–1023` (`md:`) ·
desktop `1024–1535` (`lg:`) · large `≥1536` (`2xl:`). JS mirrors them as `bp` in the store;
`narrow` (<900) selects the compact screens, `landscapeShort` (height ≤520 landscape) switches
chapters to content-driven height.

**Performance tiers** (`lib/performance.ts` — every GPU/CPU cost is a field of `perfConfig`):

| | HIGH | MEDIUM | LOW |
| --- | --- | --- | --- |
| who | desktop | tablets, modern phones | weak phones, software GL, data-saver |
| DPR cap | 2 | 1.25 | 1 |
| post-processing | bloom + vignette + grain + SMAA | half bloom (low-res) + vignette | none (renderer tone-maps) |
| particles | 650 | 240 | 0 |
| lights | key · rim · accent · hemi · ambient | same, no pulses | key · hemi · ambient (brighter) |
| env map | 256 | 128 | 64 |
| models | all, streamed behind the hero | only stations around the current chapter | same, 1 chapter look-ahead |

Detection is feature-based (`navigator.deviceMemory`, `hardwareConcurrency`, `pointer: coarse`,
viewport, Save-Data / effective connection type, software-renderer sniff via
`WEBGL_debug_renderer_info`) and every signal is optional. `?perf=low|medium|high` forces a tier
(remembered). At runtime `PerformanceMonitor` steps the tier **down** when the frame rate drops
(never back up).

**Streaming** — on MEDIUM/LOW only the hero desk loads at first paint (1 GLB instead of 5).
Phone, rack and laptop stations mount one chapter before they are needed and are unmounted (GPU
buffers disposed) after the camera has left them.

**Phone composition** — poses carry an optional `m` (portrait) override: a single-focus shot per
chapter instead of the wide desk. Chapters are ~62% as long on phones (never under 100svh).
Project buttons sit in a thumb-sized bar under the scene (the project itself stays on the 3D
monitor). **No WebGL** (or a canvas that fails to create) → a lightweight editorial page with the
same projects, never a black screen.

## Performance

* Models: −90% bytes (meshopt + WebP ≤1024px); hero streams first, the rest loads behind it.
* One draw-call-friendly scene: instanced nodes/pulses, one `LineSegments` per graph, no
  real-time shadows (baked blob shadows), procedural environment (no HDR download).
* DPR clamp (desktop ≤2, mobile ≤1.5) plus `PerformanceMonitor` falling back to 1×.
* Mobile / touch: no post-processing composer (native tone mapping + MSAA), fewer
  particles, pointer parallax off, wider lens instead of dollying through other stations.
* Scroll never triggers React renders; camera/light/fog are mutated imperatively.
* Canvas teardown loses the WebGL context and clears cached GLTFs — verified no leaks over
  repeated route changes.
* Optional audio is detected on the server, so missing files never cause 404s.

`prefers-reduced-motion`: camera orbit/dolly and sway shrink, pointer parallax and
decorative animation stop, particles thin out, Lenis smoothing is disabled and all
content stays visible.

## Audio (optional)

Silent by default; never autoplays. Put `ambience.mp3`, `click.mp3`, `keyboard.mp3`,
`server.mp3` in `public/audio/` and a **SOUND ON/OFF** toggle appears in the header.
See `lib/audio.ts`.

## Attribution

3D models are from Sketchfab, licensed **CC BY 4.0** — credits are shown in the site
footer and listed in `data/assets.ts`:

* "Modern Desk Setup – Game Ready 3D Model" by mandeeprao10576
* "Low poly laptop computer" by imperioame
* "Low Poly Mobile Phone" by k. (k_nelms)
* "Server Rack" by Dreadler
* "PC Setup – Game Ready" by General of Thailand (Melonpolygons)

Fonts: Space Grotesk, JetBrains Mono, Instrument Serif (SIL OFL) via `next/font`.

## Deployment (Vercel)

1. Push the repository and import it in Vercel — the framework preset is detected.
2. No environment variables are needed; the production origin lives in `data/site.ts`.
3. Deploy. `npm run build` prerenders `/`, every `/projects/[slug]`, the OG image,
   `robots.txt` and `sitemap.xml`.

`/models/*` is served with a week-long cache header (`next.config.ts`); rename a file
when you replace a model under the same name.
