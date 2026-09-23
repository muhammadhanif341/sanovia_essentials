#!/usr/bin/env node
/**
 * Derives the mobile-optimized WebP hero frame set from the source 1920x1080 JPEG frames.
 *
 * The desktop set (src/assets/video/hero/frames/) stays full-resolution JPEG. On mobile the
 * canvas is rendered far smaller (a portrait band under the header, or a full-bleed landscape
 * strip capped at devicePixelRatio 2) — see src/sections/Hero/hero.css and
 * src/animations/primitives/frameSequence.js. Decoding/drawing 1920x1080 source images onto
 * that much smaller surface was the dominant mobile scroll-jank cost (see docs/ARCHITECTURE.md,
 * "Mobile scroll performance").
 *
 * Re-run this (`node scripts/generate-mobile-hero-frames.mjs`) whenever the desktop frame set
 * (src/assets/video/hero/frames/) changes — it regenerates every mobile frame from scratch.
 * Requires `sharp` (devDependency).
 */
import sharp from 'sharp';
import { readdirSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(here, '..', 'src/assets/video/hero/frames');
const OUT_DIR = join(here, '..', 'src/assets/video/hero-mobile/frames');
const TARGET_WIDTH = 960; // half-linear of 1920 -> 25% of the pixel count; still >2x the CSS
// width of the portrait mobile canvas band at devicePixelRatio 2 (see hero.css), and the far
// more common orientation than mobile landscape full-bleed.
const WEBP_QUALITY = 70; // tuned empirically: q80 produced files *larger* than the source JPEGs
// on this footage (fine metallic/diamond detail compresses poorly at high WebP quality); q70
// is the first step down that reliably beats the source JPEG's size with no visible loss.

mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(SRC_DIR)
  .filter((f) => /^frame-\d+\.jpg$/.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

let srcBytes = 0;
let outBytes = 0;

for (const file of files) {
  const srcPath = join(SRC_DIR, file);
  const outPath = join(OUT_DIR, file.replace(/\.jpg$/, '.webp'));
  srcBytes += statSync(srcPath).size;
  await sharp(srcPath).resize({ width: TARGET_WIDTH }).webp({ quality: WEBP_QUALITY }).toFile(outPath);
  outBytes += statSync(outPath).size;
}

console.log(`${files.length} frames converted`);
console.log(`source (jpg, 1920w): ${(srcBytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`mobile (webp, ${TARGET_WIDTH}w): ${(outBytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`reduction: ${(100 * (1 - outBytes / srcBytes)).toFixed(1)}%`);
