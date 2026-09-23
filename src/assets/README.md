# src/assets — shipped media

Everything here is bundled (hashed, cache-busted) and referenced **by id, never by path**, through
[`src/utils/media.js`](../utils/media.js). Files are discovered at build time with `import.meta.glob`,
so **dropping a file in the right folder with the right name is the whole integration** — no code change.
Until a file exists, the UI renders a labelled `MediaPlaceholder` that says which shot is needed.

```
src/assets/
  images/
    products/<slug>/<view>-<width>.<ext>     product photography      id: products/<slug>/<view>
    editorial/<name>-<width>.<ext>           hero stills, velvet, macro, packing      id: editorial/<name>
    lifestyle/…                              hands, wood table, lamp-light mood
    social/…                                 "On the table" strip stills
    reviews/…                                customer-review screenshots (consent required)
    placeholder/…                            (reserved) dev-only fixtures
  video/
    hero/hero.mp4  hero.webm                 THE HERO VIDEO — placeholder in place; see below
    loops/<name>.mp4                         short muted loops (packing, macro)
  logos/                                     real brand marks (SVG preferred)
  icons/                                     SVG sources; runtime icons are React components in components/icons
```

## Image naming — the srcset is built from the filename

`<name>-<width>.<format>` — one file per width per format. Example for a product front view:

```
products/tonneau-burgundy/front-480.avif   front-480.webp   front-480.jpg
products/tonneau-burgundy/front-800.avif   front-800.webp   front-800.jpg
products/tonneau-burgundy/front-1200.avif  front-1200.webp  front-1200.jpg
```

Referenced as `products/tonneau-burgundy/front`. The registry emits `<picture>` with AVIF → WebP → JPEG
sources and a `srcset` from every width it finds. A single unsuffixed file (`front.jpg`) also works.

| Use | Ratio | Widths | Budget |
|---|---|---|---|
| Hero arch / LCP image | 3:4 | 800, 1200, 1600 | **≤ 200 KB** at the size served to a phone |
| Product card & PDP | 4:5 | 480, 800, 1200 | ≤ 120 KB @ 800w |
| Grid feature | 5:4 or 1:1 | 800, 1200 | |
| Macro / cinematic | 16:9 (shoot landscape — do **not** crop a portrait) | 1600, 2400 | |
| Social strip | 4:5 | 480, 800 | |

Naming: lowercase, hyphens, no spaces — `{drop}-{product}-{variant}-{view}` for products
(e.g. `drop01-tonneau-burgundy-front`).

## Hero video — SUPERSEDED for the Hero itself (Phase 7)

**The `<Hero/>` section no longer uses this.** It was rebuilt around a scroll-scrubbed canvas frame
sequence (`useHeroFrames` → `hooks/useSectionMotion.js`, `animations/primitives/frameSequence.js`,
frames in `video/hero/frames/`), per explicit client direction that the hero must be scroll-driven,
never autoplay/click-to-play video. The `useFilm()` / `<FilmVideo/>` / `<FilmControl/>` / `<HeroVideo/>`
stack below is still real, working code — kept as a general-purpose "film" primitive available to
OTHER sections later (see the dev Motion Lab demo) — but it is no longer reachable from any
production route.

**Consequence found in the Phase 7 QA audit:** `video/hero/hero.mp4` (~1.3 MB) and
`images/editorial/hero-poster-1280.{jpg,webp}` (~63 KB) are matched by `import.meta.glob` in
`utils/media.js` regardless of whether any live code path calls `getVideo()`/`getPicture()` with
those ids — so despite being unreachable from any production route, they still get bundled and
shipped to every visitor. Recommended: delete those three files (the `frames/` folder and
`editorial/hero-hold-*` must stay — the frame sequence and its fallback still use them). Left in
place for now — deleting shipped assets needs an explicit go-ahead, not a QA pass.

Drop these in `src/assets/video/hero/` if/when the general-purpose film primitive is used elsewhere:

| File | Spec |
|---|---|
| `hero.mp4` | H.264 High@4.0, BT.709, no audio track, plays once and holds its last frame |
| `hero.webm` | Optional VP9/AV1 alternative (not currently present) |
| `../images/editorial/hero-poster-<w>.avif/.webp/.jpg` | First frame — poster, and what plays before autoplay is allowed to start (seamless hand-off) |
| `../images/editorial/hero-hold-<w>.avif/.webp/.jpg` | Best still — shown under reduced motion / Save-Data / a blocked autoplay, in place of the poster (also the Hero frame sequence's own fallback if frame assets are ever missing — keep this one) |

`useFilm()` + `<FilmVideo/>` / `<FilmControl/>` (`src/hooks/useFilm.js`, `src/components/media/Film.jsx`)
own this: autoplay is gated on reduced-motion and Save-Data, the film pauses off-screen and in
background tabs, and a pause/play/replay control is always present (WCAG 2.2.2). `<HeroVideo/>` wraps
the same pieces inside a `<ShapeMedia>` mask for use elsewhere (e.g. the style guide).

**The file removed above was a placeholder, not final footage** (for whenever this primitive is used
for real): it was encoded from a 300-frame JPEG sequence the client supplied
(`ezgif-157b660b95a7750a-jpg/`, itself an exported GIF/video, not a camera original) — there is no
higher-resolution source to re-encode from. It also showed a third-party **"SHARLY"-branded watch**,
visible on the dial — a stock/reference animation, not a Sanovia product. Any future real use of this
primitive needs real footage, not a re-drop of the old placeholder.

Re-encode command (ffmpeg ≥ 6, H.264, ~1.3 MB at 1280×720/30fps/10s):

```bash
ffmpeg -framerate 30 -i frame-%03d.jpg \
  -vf "hqdn3d=2:2:6:6,scale=in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709:flags=lanczos,format=yuv420p" \
  -c:v libx264 -profile:v high -level 4.0 -preset veryslow -crf 26 -g 120 -keyint_min 30 \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -movflags +faststart -an hero.mp4
```

The `scale=in_range=pc:out_range=tv:in_color_matrix=bt601` step matters: JPEG frames are full-range
BT.601; skipping it crushes blacks and shifts colour once played back as limited-range BT.709 video
(browsers assume BT.709/limited-range for H.264 with no explicit tag). Poster/hold frames should be
extracted from the **encoded** video (`ffmpeg -i hero.mp4 -frames:v 1 …`), not the source frames, so
they match playback exactly.

## Static, unhashed files → `public/`

Only things that need a stable URL: `favicon.svg`, `robots.txt`, `og-image.jpg`, `manifest`. Do not put
photography in `public/`.
