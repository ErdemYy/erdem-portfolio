#!/usr/bin/env node
/**
 * Optimises every .glb in public/models into public/models/optimized:
 * meshopt geometry compression + WebP textures capped at 1024px.
 * Originals are never modified or deleted.
 *
 *   npm run optimize:models            # all models
 *   npm run optimize:models -- foo.glb # one model
 */
import { readdirSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const src = join(process.cwd(), "public", "models");
const out = join(src, "optimized");
mkdirSync(out, { recursive: true });

const only = process.argv.slice(2);
const files = readdirSync(src).filter(
  (f) => f.toLowerCase().endsWith(".glb") && (only.length === 0 || only.includes(f)),
);

if (files.length === 0) {
  console.log("No .glb files found in public/models");
  process.exit(0);
}

for (const file of files) {
  console.log(`\n▸ ${file}`);
  const res = spawnSync(
    "npx",
    [
      "--yes",
      "@gltf-transform/cli@latest",
      "optimize",
      join(src, file),
      join(out, file),
      "--compress", "meshopt",
      "--texture-compress", "webp",
      "--texture-size", "1024",
      "--simplify", "false",
      "--join", "false",
      "--flatten", "false",
    ],
    { stdio: "inherit", shell: process.platform === "win32" },
  );
  if (res.status !== 0) {
    console.error(`  ✖ failed: ${file}`);
    process.exitCode = 1;
  }
}
console.log("\nDone. Register new models in data/assets.ts.");
