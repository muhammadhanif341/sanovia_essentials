/**
 * Media registry — the single place that knows where images and video live.
 *
 * Conventions (see assets-src/README.md):
 *   src/assets/images/<group>/<name>-<width>.<avif|webp|jpg|png>
 *   src/assets/video/<group>/<name>.<mp4|webm>
 *   src/assets/video/<group>/frames/<name>-<NNN>.<jpg|webp|…>   numbered scroll-scrub sequence
 *
 * Files are discovered at build time with import.meta.glob, so components refer
 * to media by a stable id ("products/tonneau-burgundy/front") and NEVER by path.
 * A missing id resolves to null and callers render <MediaPlaceholder/> — the site
 * runs with zero real assets, which is exactly the Phase 2 state.
 */

const imageFiles = import.meta.glob('/src/assets/images/**/*.{avif,webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const videoFiles = import.meta.glob('/src/assets/video/**/*.{mp4,webm}', {
  eager: true,
  query: '?url',
  import: 'default',
});
// A SEPARATE glob (not the images one above): frame filenames are numbered
// ("frame-001.jpg"), which would collide with the images registry's "-<width>"
// suffix parsing (it would mistake the frame number for a responsive-width variant).
const frameFiles = import.meta.glob('/src/assets/video/**/frames/*.{avif,webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const IMG_ROOT = '/src/assets/images/';
const VID_ROOT = '/src/assets/video/';
const TYPE = {
  avif: 'image/avif',
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

/** id → { avif: [{w,url}], webp: [...], jpg: [...], png: [...] } */
const images = new Map();
for (const [path, url] of Object.entries(imageFiles)) {
  const rel = path.slice(IMG_ROOT.length);
  const m = rel.match(/^(.*?)(?:-(\d+))?\.(avif|webp|jpe?g|png)$/i);
  if (!m) continue;
  const [, id, w, extRaw] = m;
  const ext = extRaw.toLowerCase() === 'jpeg' ? 'jpg' : extRaw.toLowerCase();
  const entry = images.get(id) ?? {};
  (entry[ext] ??= []).push({ w: w ? Number(w) : null, url });
  images.set(id, entry);
}
for (const entry of images.values()) {
  for (const list of Object.values(entry)) list.sort((a, b) => (a.w ?? 0) - (b.w ?? 0));
}

const srcSet = (list) => list.map((f) => (f.w ? `${f.url} ${f.w}w` : f.url)).join(', ');

/**
 * @returns {null | { sources: {type:string, srcSet:string}[], src:string, width:number|null }}
 * `sources` are ordered best-first (avif → webp); `src` is the largest fallback.
 */
export function getPicture(id) {
  const entry = images.get(id);
  if (!entry) return null;
  const sources = ['avif', 'webp']
    .filter((ext) => entry[ext]?.length)
    .map((ext) => ({ type: TYPE[ext], srcSet: srcSet(entry[ext]) }));
  const fallbackList = entry.jpg ?? entry.png ?? entry.webp ?? entry.avif;
  const largest = fallbackList[fallbackList.length - 1];
  return { sources, src: largest.url, width: largest.w };
}

/** @returns {null | { mp4?:string, webm?:string }} */
export function getVideo(id) {
  const mp4 = videoFiles[`${VID_ROOT}${id}.mp4`];
  const webm = videoFiles[`${VID_ROOT}${id}.webm`];
  return mp4 || webm ? { mp4, webm } : null;
}

/**
 * A numbered image sequence for scroll-scrubbed playback, e.g. "hero" →
 * src/assets/video/hero/frames/frame-001.jpg … frame-185.jpg.
 * @returns {string[]} frame URLs sorted in filename order (numeric-aware); [] if none exist
 */
export function getFrameSequence(id) {
  const prefix = `${VID_ROOT}${id}/frames/`;
  return Object.entries(frameFiles)
    .filter(([path]) => path.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, url]) => url);
}

/** Dev helper: what did the registry find? */
export const mediaStats = () => ({
  images: images.size,
  videos: Object.keys(videoFiles).length,
  frames: Object.keys(frameFiles).length,
});
