import type { PortfolioAsset } from "@/types/portfolio";

/**
 * Asset inventory — real files found in /public/models.
 * `path` points at the meshopt + WebP optimised copy (~90% smaller);
 * `originalPath` is the untouched Sketchfab export.
 *
 * To add a model: drop the .glb in /public/models, optionally run
 *   npx @gltf-transform/cli optimize in.glb public/models/optimized/out.glb
 *     --compress meshopt --texture-compress webp --texture-size 1024 --simplify false
 * and register it here.
 */
export const assets = {
  desk: {
    id: "desk",
    name: "Modern Desk Setup – Game Ready 3D Model",
    path: "/models/optimized/modern_desk_setup__game_ready_3d_model.glb",
    originalPath: "/models/modern_desk_setup__game_ready_3d_model.glb",
    type: "glb",
    role: "Hero environment — personal workspace",
    author: "mandeeprao10576",
    source:
      "https://sketchfab.com/3d-models/modern-desk-setup-game-ready-3d-model-346abd870f044ccf955a68bae0365c4a",
    license: "CC-BY-4.0",
  },
  laptop: {
    id: "laptop",
    name: "Low poly laptop computer",
    path: "/models/optimized/low_poly_laptop_computer.glb",
    originalPath: "/models/low_poly_laptop_computer.glb",
    type: "glb",
    role: "Code / projects — carries the IDE screen overlay",
    author: "imperioame",
    source:
      "https://sketchfab.com/3d-models/low-poly-laptop-computer-c8dff1ee9ef14a1fa27e8fd5ea44af8e",
    license: "CC-BY-4.0",
  },
  phone: {
    id: "phone",
    name: "Low Poly Mobile Phone",
    path: "/models/optimized/low_poly_mobile_phone.glb",
    originalPath: "/models/low_poly_mobile_phone.glb",
    type: "glb",
    role: "Mobile development",
    author: "k. (k_nelms)",
    source:
      "https://sketchfab.com/3d-models/low-poly-mobile-phone-4ff99cf17b164e7b9790638c5d2ef4ce",
    license: "CC-BY-4.0",
  },
  server: {
    id: "server",
    name: "Server Rack",
    path: "/models/optimized/server_rack.glb",
    originalPath: "/models/server_rack.glb",
    type: "glb",
    role: "Backend / infrastructure",
    author: "Dreadler",
    source:
      "https://sketchfab.com/3d-models/server-rack-eac42015fd8641aaa88e5a0ff50b0814",
    license: "CC-BY-4.0",
  },
  pc: {
    id: "pc",
    name: "PC Setup – Game Ready",
    path: "/models/optimized/pc_setup_-_game_ready.glb",
    originalPath: "/models/pc_setup_-_game_ready.glb",
    type: "glb",
    role: "Systems workstation",
    author: "General of Thailand (Melonpolygons)",
    source:
      "https://sketchfab.com/3d-models/pc-setup-game-ready-4126abfe9895488181dbde961e836788",
    license: "CC-BY-4.0",
  },
} satisfies Record<string, PortfolioAsset>;

export type AssetKey = keyof typeof assets;
export const assetList: PortfolioAsset[] = Object.values(assets);

/** Optional audio — the app works fine when these files do not exist. */
export const audioAssets = {
  ambience: "/audio/ambience.mp3",
  click: "/audio/click.mp3",
  keyboard: "/audio/keyboard.mp3",
  server: "/audio/server.mp3",
} as const;
