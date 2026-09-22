# Sanovia Essentials

Storefront for **Sanovia Essentials** — minimal everyday watches & jewellery, ordered by WhatsApp.
React 19 · Vite 8 · GSAP 3.15 (+ ScrollTrigger, SplitText) · React Router 7. Plain CSS design tokens; no UI framework.

> **Status: Phase 6 complete — motion + final polish.** The full site (Phases 1–5) is built and verified.
> Phase 6 audited every GSAP animation, fixed two real reduced-motion gaps (a magnetic CTA that ignored
> `prefers-reduced-motion`, and several hover micro-interactions with hand-coded durations that didn't
> collapse with it), added the cursor-follow label + name-underline on product cards from
> `DESIGN-BLUEPRINT.md` §7.5 that Phase 5 hadn't wired up yet, and added `will-change` hygiene to the
> parallax primitives. No visual identity, layout or copy changed. See `docs/ARCHITECTURE.md` §11.
> Design direction lives in [`DESIGN-BLUEPRINT.md`](DESIGN-BLUEPRINT.md); how the code is organised lives in
> [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server. **StrictMode is on** — double-mounting is the everyday test that GSAP cleanup is symmetrical |
| `npm run build` / `preview` | Production build (`dist/`) / serve it |
| `npm run lint` | ESLint incl. `jsx-a11y` and hooks rules |
| `npm run check:contrast` | Parses `src/styles/tokens.css`, resolves every surface, verifies 90 WCAG pairings |
| `npm run check` | contrast → lint → build. Run before every commit |

Open **`/design-system`** in dev for the living style guide + motion lab (tokens, every component on every surface,
live contrast measurement, one demo per animation primitive). It is excluded from production builds.

## Configuration

Copy `.env.example` → `.env.local`. `VITE_WHATSAPP_NUMBER` (digits only), `VITE_SITE_URL`, `VITE_CURRENCY`.
The defaults are the number on the Instagram profile and PKR — **both need client confirmation.**

## Where things go

```
src/
  styles/        tokens · reset · base · typography · layout            (global CSS)
  components/    ui/ layout/ media/ motion/ product/ icons/             (each with co-located CSS)
  sections/      landing-page sections — hero (Phase 3), everything below it (Phase 4)
  pages/         route pages (lazy, code-split): Shop, Product (PDP), Wishlist, Account… ; pages/dev = style
                 guide (DEV only)
  animations/    GSAP: register · tokens · media queries · primitives · hero · page transition
  hooks/         useMotion (THE cleanup boundary) · useSectionMotion · useOverlay · useMediaQuery …
  context/       OrderListContext (cart) · WishlistContext (saved pieces, device-local)
  data/          site · navigation · products (empty until client data, + helpers) · placeholders (dev only)
  utils/         media registry · whatsapp · format · a11y · lazy
  assets/        images/ video/ logos/ icons/   ← drop files here; see src/assets/README.md
assets-src/      master originals (not shipped, git-ignored) + what we still need from the client
scripts/         check-contrast.mjs
```

## Dropping in the hero video

Put `hero.mp4` (and optionally `hero.webm`) in `src/assets/video/hero/`, and a poster at
`src/assets/images/editorial/hero-poster-<width>.avif|webp|jpg`. `<HeroVideo/>` finds them at build time — no code
change. Specs and every other asset convention: [`src/assets/README.md`](src/assets/README.md).

## Browser support

Modern evergreen browsers. The practical floor is set by features the code relies on — the `inert` attribute,
`aspect-ratio`, and animated `grid-template-rows` — which puts it at roughly Chrome/Edge 107+, Safari 16+,
Firefox 112+ (**estimated from feature support; not tested on those versions**). `svh` units have `vh` fallbacks and
`text-wrap: balance` is progressive. `@layer` and native CSS nesting are deliberately **not** used: an unsupported
at-rule would drop a whole stylesheet in an older WebView (e.g. an in-app browser).
