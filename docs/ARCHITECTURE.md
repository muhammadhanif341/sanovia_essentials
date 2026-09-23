# Architecture — Phase 2–6

How the code is organised, the rules that keep it consistent, and what was verified. Design intent is in
[`../DESIGN-BLUEPRINT.md`](../DESIGN-BLUEPRINT.md); this document is about **how it is built**.

## 1. Principles

1. **Semantic tokens, never primitives, in components.** Components read `--surface`, `--fg`, `--accent`… A
   `data-surface` attribute redefines all of them, so any component is correct on any background.
2. **Recompose, don't scale.** Layouts change *structure* per breakpoint (header, menu, grid, drawer, scrollers).
3. **All GSAP goes through `useMotion`.** It is the single cleanup boundary. No component calls `gsap.*` in a render
   body, and nobody calls `.kill()` by hand.
4. **Content is complete without motion.** Reduced-motion users get the finished page; motion is enhancement.
5. **Nothing is invented.** Empty catalogue → empty state. Missing photo → labelled placeholder. Missing price →
   "Message for price". No fake reviews, prices or policies exist in the UI.
6. **Few dependencies.** Runtime: `react`, `react-dom`, `react-router-dom`, `gsap`, two Fontsource font packages.
   Everything else (icons, dialog, accordion, marquee, focus trap) is in-repo.

## 2. Design system

### Tokens — `src/styles/tokens.css`
Colour primitives → **surfaces** (`dark · darker · raised · ivory · cream · plum`) → semantic tokens. Type scale (fluid
`clamp()`), 4px space scale, container/gutter/grid, radii/shape, motion durations, z-index. Breakpoints are
**768 / 1024 / 1440** — CSS can't read custom properties inside `@media`, so the numbers also live in
`src/animations/media.js` (`BP`); keep them in sync.

`npm run check:contrast` parses this file (no duplicated palette in JS), resolves each surface, and checks 15
pairings × 6 surfaces = **90** against WCAG. It also asserts that two documented anti-patterns *still fail*
(logo-gold text on ivory, ivory label on gold), proving the guard can fail.

### Layout — `src/styles/layout.css`, `components/layout/primitives.jsx`
`Container`, `Section` (owns a surface), `Grid` + `GridItem` (4 → 8 → 12 columns; each item declares placement per
breakpoint: `span={{ base: 4, md: 8, lg: 6 }} start={{ lg: 7 }}`), `Stack`, `Cluster`.

### Components
| Group | Contents |
|---|---|
| `ui/` | Button (button / router link / external), TextLink, Tag, Card, Field + TextField/TextareaField/SelectField/CheckboxField, Accordion, Dialog, Typography (`Heading`, `Text`, `Overline`) |
| `layout/` | Header, RollLink, MobileMenu, Footer, Layout, PageHead, primitives |
| `media/` | ShapeMedia (arch/oval/tonneau/circle/pill/rect), Picture, MediaPlaceholder, HeroVideo, Logo *(placeholder)* |
| `product/` | ProductCard (compound), ProductGrid, Price, order controls, OrderListDrawer, WishlistButton, QuickView, Gallery (PDP), VariantPicker, QuantityStepper, Rating, ReviewList |
| `motion/` | PageTransition + TransitionLink, ScrollProgressRing, LampGlow, Magnetic, Marquee, HorizontalScroller, StickyStage, WhatsAppFab |

**Conventions:** plain CSS co-located per group, `sv-` prefixed BEM-ish classes, variants as modifier classes, state as
`data-*` / `aria-*`. Refs are plain props (React 19). No `@layer`, no native nesting (see README → Browser support).

## 3. Animation architecture — `src/animations/`, `src/hooks/`

```
register.js        registers ScrollTrigger + SplitText once; ScrollTrigger.config({ ignoreMobileResize })
tokens.js          dur · ease · stagger · dist · start   (CSS mirrors durations)
media.js           BP + MQ conditions: full · tabletUp · light · motion · reduce · fine · coarse
refresh.js         one refresh policy: fonts.ready, load, orientation, and a ResizeObserver on document height
primitives/
  reveal.js        revealLines · wordIllumination · revealMask · revealFade · initReveals
  parallax.js      initParallax (decorative layers only)
  pointer.js       magnetic · lampGlow           (fine pointer only)
  scrollStages.js  horizontalScroll · stickyStage  (sticky-first, native fallback)
hero.js            heroIntro — composes the primitives via data-hero-* attributes
pageTransition.js  curtainExit · curtainEnter · curtainReset (Promise-returning)
hooks/useMotion.js          gsap.matchMedia(scope) wrapper — THE cleanup boundary
hooks/useSectionMotion.js   usePageMotion · useHeroIntro · useMagnetic · useHorizontalScroll · useStickyStage
```

### How cleanup works
`useMotion` runs in a **layout effect** (hidden initial states apply before first paint) and wraps
`gsap.matchMedia(scope)`. Everything created inside is tracked and **reverted** on unmount, when a media condition
flips (rotate a tablet, toggle reduced-motion), and under StrictMode's double mount. Primitives that add listeners
return a teardown.

### Data-attribute API (what a Phase 3 section writes)
| Attribute | Effect | Hook on the section root |
|---|---|---|
| `data-reveal="lines"` / `"words"` | Masked line/word slide-up (SplitText, reverts on cleanup, keeps `aria-label`) | `usePageMotion` |
| `data-reveal="scrub-words"` | Words illuminate as you scroll | `usePageMotion` |
| `data-reveal="mask"` | Clip-path wipe (`<ShapeMedia reveal>` sets it) | `usePageMotion` |
| `data-reveal` / `="fade"` | Batched fade-up | `usePageMotion` |
| `data-parallax="8"` | ±8 % travel (40 % on phones, 60 % tablets) — `<ShapeMedia parallax>` | `usePageMotion` |
| `data-hero-headline / -media / -detail / -fade / -glow` | Hero intro choreography + lamp glow | `useHeroIntro` |

### Scroll stages — sticky-first
`HorizontalScroller` and `StickyStage` render **the same markup in two modes**. Default = native scroll-snap
carousel / stacked steps. At `full`/`tabletUp` (and motion allowed) JS sets `data-hscroll="active"` /
`data-stage="active"`; CSS then makes the wrapper tall and the stage `position: sticky`, and ScrollTrigger scrubs a
timeline over it — no `pin: true` spacer (more robust in dynamic-toolbar mobile browsers). Cards remain in DOM order;
arrow buttons and `focusin` scroll the *window*; the stage is `overflow: clip` so focus can't scroll it.

### Page transitions — `components/motion/PageTransition.jsx`
`go(to, origin)`: curtain wipes in from the click point **while the next route chunk preloads** → navigate → on commit:
instant scroll-to-top, focus `<main>`, announce the title to a live region, refresh triggers, lift the curtain. Back/
forward and reduced motion skip the curtain but keep the accessibility steps. A 4 s watchdog releases a stalled
transition.

### State-driven UI is CSS
Dialog, menu, accordion, hover states are CSS transitions keyed off `data-state` / `aria-*` — robust and nothing to
clean up. GSAP is for scroll choreography and sequences.

## 4. Accessibility in the foundation
Skip link · landmarks (`header`, two labelled `nav`s, `main`, `footer`) · `<main tabIndex=-1>` focus management ·
`:focus-visible` ring from tokens · WCAG 2.4.11 `scroll-padding-top` · 44px minimum targets (52px on coarse pointers) ·
forced-colours fallbacks · reduced-motion tokens (durations → ~0) + every GSAP path gated · polite live region **outside
`#root`** (which goes `inert` under dialogs) · Dialog: portal, `inert` background, ref-counted scroll lock, focus trap,
Esc, focus return · Accordion: button-in-heading, `aria-expanded/controls`, closed panels `inert` · forms: visible
labels, `aria-describedby/invalid`, errors = icon + text · marquee & hero video pausable (WCAG 2.2.2) · letter-roll
links expose the word once to AT · `jsx-a11y` lint on every build.

## 5. Assets
Discovered at build time by `import.meta.glob` (`src/utils/media.js`); components use ids, never paths. Naming, ratios,
budgets, hero-video spec: [`../src/assets/README.md`](../src/assets/README.md). Originals + client to-do list:
[`../assets-src/README.md`](../assets-src/README.md).

## 6. Deviations from the Phase 1 blueprint (deliberate)
| Blueprint | Built | Why |
|---|---|---|
| Next.js App Router | **Vite + React Router** | You specified React + Vite |
| Tailwind + CSS variables | **CSS variables only** | Not in your stack list; fewer dependencies |
| TypeScript | **JavaScript + JSDoc typedefs** | Same reason; TS is a drop-in later |
| Radix (Dialog/Accordion) | **In-repo Dialog + Accordion** | No dependency; small surface; tested |
| Lucide icons | **In-repo SVG icons** | No dependency |
| CustomEase | **Built-in `expo.*` eases** | One less plugin |
| GSAP-ticker marquee | **CSS marquee** | Compositor-driven; zero per-frame JS |
| Radix-style animated menu | **CSS transitions** | See "State-driven UI is CSS" |
| `next/font` | **Fontsource (self-hosted)** | Equivalent for Vite |

**Consequence to decide on:** a Vite SPA renders client-side. Google indexes it, but **per-product Open Graph / link
previews (Instagram, WhatsApp) need pre-rendered HTML**. Options for Phase 3+: prerender the route list at build time,
or serve product pages through an edge function. Nothing else depends on this.

## 7. What was verified (and what was not)
Verified in a real browser (Chromium in the Claude desktop browser pane), dev and production builds:
- 0 console errors / 0 server errors; `npm run check` green (90/90 contrast, ESLint incl. a11y, build).
- Header recomposes at 320/390/820/1280/1440; grid 4→8→12 cols; product grid 2→3→3→4 up with feature breaks.
- **Reduced-motion path** (the pane has it on by default): all content visible, no curtain, header never hides, route
  changes still reset scroll / focus `<main>` / announce.
- **Motion path** (forced via a temporary harness, since removed): reveals, header hide/show, ring, sticky horizontal
  scroll (linear track translation, pinned stage), sticky story crossfade, curtain transition, live breakpoint flips
  both directions.
- **Cleanup:** ScrollTriggers 6 → 2 (baseline) on unmount → 12 on remount; breakpoint flip reverts data attributes and
  inline styles; StrictMode double-mount clean.
- Menu / drawer: real Tab wrap (both directions), Esc, focus return, inert + scroll lock.
- 8/8 routes reflow at 320px; hero reveal causes **zero layout shift** vs the unsplit baseline.
- Production bundle: no style-guide code, no fixtures, no debug handle; `/design-system` → 404.

Bugs found by that testing and fixed: focus not returning after Esc (inert timing) · long button labels overflowing
phones · stale ScrollTrigger measurements after lazy routes (ResizeObserver refresh) · descender clipping in split
headlines · a table overflowing 320px in the style guide.

**Not verified (needs real devices):** iOS Safari, the Instagram in-app browser (sticky + toolbar behaviour), Android
mid-tier performance, screen-reader output (VoiceOver/TalkBack), real photography and the real logo. First-load JS is
~136 KB gzip (React + Router + GSAP core/ScrollTrigger/SplitText) at the end of Phase 2.

## 8. Phase 3 (partial) — header + hero

Built: the header (`Header.jsx`, `animations/header.js`, `hooks/useHeaderMotion.js`) and the home page's hero
(`sections/Hero/`, `animations/hero.js`). Nav data grew from 5 links to the brief's structure (`data/navigation.js`):
five primary links, four utilities (search, account, wishlist, cart), plus five new page shells so every link
resolves (`Collections`, `Account`, `Wishlist`, and `/about` reusing `Story`). Not built: any section below the hero.

**Header.** Scroll-driven look is two CSS custom properties on `<header>` (`--hp` "glass", `--solid` "readable"),
tweened by GSAP and consumed by CSS as opacity/transform only — `animations/header.js` owns the thresholds, `chrome.css`
owns the paint. `useHeaderMotion` re-runs `headerMotion()` through `useMotion` per route (`overlay` on/off) and per
reduced-motion flip; a non-hero route is solid from the first frame, no scrub.

**Hero.** `position: sticky` (no pin spacer) with the following section sliding over it — `heroExit()` scrubs a
timeline off `ScrollTrigger({ trigger: next, start: 'top bottom', end: 'top top' })` and reports `onCovered` so the
film can pause once fully hidden (verified: paused within one tick of full cover, resumed on scroll-back, `currentTime`
frozen while covered). Two separate wrappers carry `scale` — `[data-hero-media]` (load, time-based) and
`[data-hero-plate]` (scroll, scrubbed) — because a single element's `scale` can't be safely read by a scrub tween while
a time tween is still mid-flight. Recomposed by orientation, not scaled: portrait gets a masked film band under the
header with copy below it; landscape is full-bleed with copy bottom-left and actions bottom-right.

**Film playback** (`hooks/useFilm.js`, `components/media/Film.jsx`, replaces the Phase-2 `HeroVideo` internals —
same component name/API, `<HeroVideo/>` is now a thin wrapper over the two). Plays once and holds the last frame
(`loop: false` by default); reduced motion / Save-Data / a browser-blocked autoplay all fall back to a still frame
plus a play button, never a stalled black box. Pauses off-screen (`IntersectionObserver`) and in background tabs
(`visibilitychange`), independent of the scroll-driven `suspended` (covered-by-sheet) state.

**Mobile menu** (`animations/menu.js`) is now GSAP-choreographed rather than CSS-only: one reversible timeline
(`play()` open / `reverse()` closed) so an interrupted close-then-reopen resumes instead of snapping — verified by
reversing mid-open and re-opening before the reverse completed, which correctly settles fully open. `Dialog` gained
a `motion="external"` mode for this (the caller's GSAP owns the panel; the existing CSS-driven mode is unchanged for
the cart drawer and search) and a `side="top"` variant for the new search overlay.

## 9. Phase 4 — the landing page

Built: everything below the hero, in `src/sections/{BrandIntro,FeaturedCollection,SignatureWatches,
JewelleryEditorial,ScrollStory,CollectionShowcase,BestSellers,BrandStory,Reviews,Social,Newsletter}/`, composed by
`pages/Home.jsx` in brief order. No new page-level motion wiring was needed for most of them — every section reads
its own choreography from `data-reveal` / `data-parallax` data-attributes already wired once by the page's
`usePageMotion(ref)` call (Phase 2). Two sections manage their own ScrollTrigger internally via existing components
(`<StickyStage>`, `<HorizontalScroller>`) and just need to be mounted.

**New primitives, added because the brief asked for animation styles the Phase 2 primitives didn't cover:**
- `initScaleParallax` (`animations/primitives/parallax.js`) — `data-scale-parallax="14"` scrubs a ShapeMedia from a
  soft zoom down to rest as it crosses the viewport (Signature Watches: "scale/parallax"). One direction, no yoyo.
- `data-reveal-delay="0.15"` (`animations/primitives/reveal.js`) — an optional hand-placed stagger offset for
  `lines` / `mask` reveals, for editorial grids that want a deliberate sequence rather than natural scroll order
  (Jewellery Editorial's two overlapping photos; the Social mosaic's six tiles).
- `scrollStoryBuild` (`animations/scrollStory.js`) — the one pinned stage on the page (budget: max 2 per
  DESIGN-BLUEPRINT §7.6), driving `<StickyStage>` for Cinematic Scroll Story. Four frames crossfade + lift, holding
  one at a time; below tablet width or under reduced motion they are just four stacked sections.

**Section-to-brief mapping**, where a literal reading of the brief would have meant inventing data:
- *Featured Collection* and *Best Sellers* are real filters over `data/products.js` (`drop === '01'`, `tag === 'Most
  asked for'`) — honest empty states today, real content the moment product data exists, no invented ranking.
- *Newsletter* has no email backend to submit to (the site is a static SPA — see §6). It composes a WhatsApp message
  from whatever the visitor typed and opens `wa.me`, the same hand-off the "cart" already uses — a real, working
  feature rather than a form that silently goes nowhere.
- *Customer Reviews* invents nothing (DESIGN-BLUEPRINT §12): an honest "screenshots arrive once a customer consents"
  plus a link to the real Instagram profile, where genuine comments already exist.
- *Collection Showcase* links to real destinations (Watches, Jewellery, Drop 01, Collections, About) rather than
  invented collection names.
- The Phase 1 blueprint (§4) had proposed *consolidating* several of these sections (Featured Collection + Signature
  Watches into one drop; Best Sellers as a catalogue flag only; Newsletter as a "Drop List"). The Phase 4 brief
  explicitly asked for all twelve as separate sections, so that supersedes the earlier consolidation note — this
  version keeps the flag-based, no-invented-ranking spirit of that idea (Best Sellers) while giving each section its
  own space and animation treatment as briefed.

**A structural bug found and fixed during verification:** the hero's `position: sticky` stays sticky-eligible for
the full height of its containing block. In Phase 3, that block was just Hero + the one placeholder section, so it
was invisible. Nesting eleven more sections directly in the same wrapper (the first draft of `Home.jsx`) made the
hero sticky-eligible for the whole ~15,000px page — any later section not itself positioned with a higher stacking
order (a plain, non-`<Section>` wrapper) would render the hero's video *underneath* it, bleeding through. Fixed by
wrapping only `<Hero/>` + `<BrandIntro/>` in an inner `.hero-stage` div, matching Phase 3's original, verified
containing block; confirmed by screenshot before/after and a headless sweep of computed styles.

**Verified** (headless Chromium, 7 viewports 390×844–1920×1080 × {motion, reduced-motion} = 14 runs): 0 console
errors, 0 horizontal overflow, `npm run check` green. ScrollTrigger count returns to baseline after navigating away
and back (56 → 2 → 56, no leak). The pinned Scroll Story shows exactly one frame dominant at every sampled scroll
position (crossfade, never two-at-once outside the transition itself); the Horizontal Scroller's track genuinely
translates against scroll. 80 sequential Tab presses reach every interactive element in the expected order with no
trap and no crash. Reduced motion: all sections fully visible with no scrub, matching principle #4 ("content is
complete without motion").

**Not verified:** real devices, screen readers, and the site's behaviour once real product/photo data starts
filling the honest-empty sections above.

## 10. Phase 5 — the e-commerce experience

Built: the product data model + helpers (`data/products.js`), a rebuilt Shop listing (`pages/Shop.jsx` +
`pages/shop.css`), premium product cards with wishlist + quick view (`components/product/{ProductCard,
WishlistButton,QuickView}.jsx`), a full product detail page (`pages/Product.jsx` + `components/product/{Gallery,
Rating,ReviewList,VariantPicker,QuantityStepper}.jsx`), a wishlist system (`context/WishlistContext.jsx` +
`pages/Wishlist.jsx`), an honest Account page (`pages/Account.jsx`), and a site-wide WhatsApp contact button
(`components/motion/WhatsAppFab.jsx`). The existing cart (`context/OrderListContext.jsx`, "the order list" —
Commerce model A) and cart drawer (`components/product/OrderListDrawer.jsx`) were extended, not rebuilt: they
already covered quantity/remove/subtotal/checkout from Phase 2–3.

**Product data model** (`data/products.js`): the `Product` typedef grew `isNew`, `availability`, `images.gallery`,
`rating`, `reviews` — all optional, all honest about absence (`rating: null` renders "No reviews yet", not a
fabricated 0-star row). Helpers: `getRelatedProducts` (same category, real cross-sells only), `getNewArrivals` /
`getBestSellers` (flag-driven — `isNew` is set by a person, never inferred from a date; "Most asked for" is the
same honest tag Phase 4's landing section already used), `availabilityMeta` (maps `made-to-order` / `low-stock` /
`coming-soon` / `out-of-stock` to a `Tag` + whether ordering is enabled). The catalogue itself (`products = []`)
stays empty until the client supplies data — every screen below was built and verified against that empty state
AND against a temporary in-memory fixture set (never committed) standing in for real photography.

**Listing** (`pages/Shop.jsx`): category pills (All/Watches/Jewellery/New Arrivals/Best Sellers, the last two
reading `SHOP_VIEWS` in `data/products.js` rather than being real `category` values), an inline debounced search
box (in addition to the header's sitewide search overlay), a sort select (Featured/Newest/Price ↑/Price ↓ — unpriced
pieces always sort last, never first, regardless of direction), and a filter disclosure (hide out-of-stock/coming
soon; min/max price, hidden entirely when `site.showPrices` is off). All of it is real filtering/sorting logic over
`data/products.js`, verified against a populated fixture set — not decorative UI waiting for a future wire-up.

**Product card** (`components/product/ProductCard.jsx`): gained a wishlist heart (top-right corner, `WishlistButton`)
and a "Quick view" pill that rises from the image's bottom edge on hover/focus-within (hidden on touch — tapping the
card reaches the PDP just as fast, so nothing is lost). Both sit above the card's stretched link via z-index, same
pattern the existing "Add to cart" action already used. `QuickView` reuses the cart's own `<Dialog side="drawer">`
so it feels like the same product system, not a second one.

**PDP** (`pages/Product.jsx`): `<Gallery>` is one markup for two layouts — native swipe/snap carousel with 44px
arrows and dot indicators below 1024px, a plain vertical stack beside a `position: sticky` info column at 1024px+
(DESIGN-BLUEPRINT §6.4) — no JS breakpoint switch, just CSS. Falls back to `[primary, hover]` or one placeholder
frame when a product has no `images.gallery` yet. Info column: variant pills (`VariantPicker`, only rendered when
variants are real), a shared `QuantityStepper` (also now used by the cart drawer, replacing its bespoke inline qty
markup), "Order on WhatsApp" (the brief's "buy now" — immediate, no cart detour, **now carries the chosen qty and
variant**) and "Add to cart" side by side, an accordion (Details / Shipping & care / Reviews), and `getRelatedProducts`
under "Wear it with." Reviews render real entries when `product.reviews` has any, otherwise the same honest
"hasn't been reviewed yet, we only publish with consent" stance as the landing page's Reviews section — never a
fabricated rating.

**Wishlist** (`context/WishlistContext.jsx`): a real, working feature, not a stub — localStorage-persisted slugs,
resolved live against `data/products.js` on every render, so a since-removed product quietly drops out instead of
showing broken data. Deliberately does **not** claim to sync across devices; the Wishlist page and the Account page
both say "on this device" in plain language. Header/mobile-menu badges show the live count.

**Account** (`pages/Account.jsx`) — the brief's "prepare architecture for login/signup/guest checkout/orders,
don't fake backend functionality": real, accessible sign-in/create-account forms (proper labels, `autoComplete`,
`type="email"`/`type="password"`, client-side `required`) that a backend could be wired into directly later, but
submitting one today shows an honest inline message instead of a fake success — there is no backend. Guest
checkout needs no explaining because it's already the default: the cart's WhatsApp hand-off never required an
account. Order history is a clearly-labelled "arrives with accounts" placeholder, not a fabricated empty table.

**WhatsApp FAB** (`components/motion/WhatsAppFab.jsx`): one quiet, low-contrast-until-hovered circular button,
fixed bottom-right site-wide, number from `site.whatsapp.number` (→ `VITE_WHATSAPP_NUMBER`). Mounted inside the
normal `Layout` tree (not portaled) so it correctly goes `inert` with the rest of the page whenever a dialog opens,
same as Header/Footer — it can never float clickable above an open cart/menu/search overlay.

**Verified:** `npm run check` green (90/90 contrast, lint, build) against the real, empty catalogue. A temporary,
never-committed fixture set (3 products spanning both categories, every availability state, a variant pair, a
rating+review, a null price) was loaded into `data/products.js` to exercise the built UI, verified via DOM/state
inspection and screenshots, then the file was reverted to `products = []` before this write-up — end-to-end
flows confirmed working: wishlist toggle (persists across routes and viewport size, reflected in the header badge,
the PDP, and the Quick View dialog simultaneously), Quick View and the cart drawer opening with full content, Shop's
availability filter and price sort (unpriced-last confirmed both directions), the New Arrivals / Best Sellers views,
PDP variant + quantity → "Add to cart" (confirmed the exact chosen qty and variant landed in the cart's localStorage
record), related products (same category, self excluded), and the Account sign-in form's honest not-connected
message. Zero console errors across every route in both the populated-fixture and real-empty-catalogue states.
Zero horizontal overflow at 1440px on the PDP two-column layout. `npm run check` was run both mid-verification and
again after reverting to the real empty catalogue.

**Not verified:** real devices, screen readers, and (as with Phase 4) the site's behaviour once real product/photo
data starts filling these screens.

## 11. Phase 6 — motion + final polish

The brief: audit every GSAP animation, improve micro-interactions, make the scroll experience cinematic without
animating everything, optimise performance, respect `prefers-reduced-motion`, and fix anything that "feels
generic" — without redesigning anything. No section's copy, layout or colour changed in this phase.

**GSAP audit.** Every section (`sections/**/*.jsx`) turned out to already be a pure consumer of the shared
primitives (`data-reveal` / `data-parallax` / `data-scale-parallax` / `<StickyStage>` / `<HorizontalScroller>`) —
none of them touch `gsap` directly, so auditing `animations/primitives/*.js` + `animations/{hero,header,menu,
pageTransition,scrollStory}.js` (Phases 2–4) *was* the full audit. Findings and fixes:

- **`useMagnetic` ignored `prefers-reduced-motion`** (`hooks/useSectionMotion.js`): it gated only on `fine`
  (mouse-like pointer), so the hero's magnetic "Shop the collection" button still pulled toward the cursor for a
  visitor with reduced motion enabled and a mouse — contradicts DESIGN-BLUEPRINT §7.10 ("no cursor effects"
  under reduced motion). Now gates on `fine && !reduce`, matching every other pointer-driven primitive.
- **Two hardcoded CSS durations bypassed the reduced-motion token collapse.** `tokens.css` collapses
  `--dur-fast/base/slow/cine` to `0.001s` under `prefers-reduced-motion: reduce`, and most of the app's
  transitions already reference those tokens — but `media.css`'s image hover-zoom used a literal `1.2s` instead
  of `var(--dur-cine)` (now fixed), and several `chrome.css` hover/focus micro-interactions (icon-button ring,
  icon lift, tooltip, burger, per-letter roll-link, header nav underline) use hand-tuned durations *outside* the
  token scale on purpose (0.3–0.65s, some with custom cubic-béziers) — retuning them to a token would change how
  they feel for everyone, not just fix reduced motion. Instead, the existing `@media (prefers-reduced-motion:
  reduce)` block in `chrome.css` now explicitly collapses just those transitions, leaving their non-reduced feel
  untouched.
- **`will-change: transform` added to the two parallax primitives** (`initParallax`, `initScaleParallax`),
  toggled on/off via each ScrollTrigger's `onToggle` so the compositor layer only exists while the tween can
  actually run — DESIGN-BLUEPRINT §7.8 asked for this and it had never been wired up. (`data-parallax` itself
  is still unused by any shipped section — same as Phase 5 — this only affects `data-scale-parallax`, live on
  Signature Watches.)

**Micro-interactions — two additions, both closing a gap between DESIGN-BLUEPRINT §7.5 and what Phase 5 actually
shipped, not new invention:**

- **Cursor-follow label** on product cards (`components/product/ProductCard.jsx` →
  `animations/primitives/pointer.js` `cursorFollow()`, wired by `useCursorFollow`): a small "View" chip
  (same glass-chip chrome as the wishlist button / gallery arrows) tracks the pointer while it's over the card
  image. Fine pointer + motion-allowed only; touch and reduced motion never mount it. This is the brief's
  explicit "cursor interactions" ask, and DESIGN-BLUEPRINT §7.5 had already spec'd a card-hover cursor label —
  it just hadn't been built. (The blueprint's label was "Order"; changed to "View" because the card's click
  target is the PDP link, not an add-to-cart — "Order" would have promised something the click doesn't do.)
- **Product name underline draws in on hover/focus** (`product.css` `.sv-pcard__link-text`) — DESIGN-BLUEPRINT
  §7.5 also called for this; implemented as a `background-image` underline (not a positioned pseudo-element,
  which would have collided with the stretched-link `::after` that already makes the whole card clickable).
- **Add-to-cart icon pop**: the Plus→Check swap on "add to cart" now has a small scale-in (`controls.css`
  `.sv-btn__icon svg`) — it replays automatically because the swap is a different icon component (a fresh DOM
  node), not a re-render of the same node. Token-based duration, so it already collapses under reduced motion.
- Everything else audited (wishlist heart, quantity stepper, cart drawer, forms, dialogs, accordion) was already
  token-based, already reduced-motion-safe, and already had deliberate press/hover feedback — no changes.

**Scroll experience — stillness vs. movement.** Re-read every section against the brief's "don't animate
everything" instruction. `BrandIntro` (the sheet directly after the hero) is already pure typography by design —
its own code comment says so: "the hand-off from a full-bleed film to a quiet light surface IS the composition;
a second image here would compete with the hero's." `Newsletter` and `Reviews` already carry only a single fade
reveal each. This contrast (cinematic hero → calm sheet → editorial sections → the one pinned Scroll Story → calm
Newsletter/footer) was already the Phase 3/4 design; Phase 6 confirmed it rather than changing it.

**Performance.** Confirmed already in place: every non-priority image is `loading="lazy" decoding="async"`, the
hero/LCP image is `eager` + `fetchPriority="high"` (`components/media/Picture.jsx`); all scroll-driven UI (header
glass/solid/hide, scroll-progress ring) is imperative GSAP, never React state, so scrolling never triggers a
re-render; per-viewer state (wishlist) is read inside the leaf component that needs it, not lifted, so a wishlist
change re-renders one button, not a grid. Added the `will-change` toggling above.

**Verified:** `npm run check` green (90/90 contrast, lint, build). Interaction verification used the existing
`/design-system` dev page (its own placeholder fixtures, never the real catalogue) in the Browser pane, with a
temporary `window.matchMedia` override in `main.jsx` (reverted immediately after) to force `prefers-reduced-
motion: no-preference`, since the pane itself always reports reduced-motion — confirmed via `gsap.getProperty()`
and direct `PointerEvent` dispatch (the pane's synthetic `hover`/`click` actions don't reliably fire real
`pointerenter`/`pointermove`, so JS pointer-tracking primitives need to be checked that way; CSS-only `:hover`
states update correctly either way). Cursor-follow label, title underline, magnetic CTA (`x` moved by exactly the
expected `dx × strength`), add-to-cart icon swap + cart badge bump, and Quick View all confirmed working. Zero
console errors across Home, Shop, Product (404), Wishlist and the design-system page. Test cart/wishlist
localStorage state was cleared before finishing.

**Not changed:** any visual token, layout, copy, or the hand-tuned timing/easing of the existing hero/menu/header
choreography — it was already built to DESIGN-BLUEPRINT §7 and re-timing it without a concrete defect would be
redesign, not polish, which the brief explicitly ruled out.

## 12. Phase 7 — product catalogue + admin-ready service layer

The brief: `data/products.js` had shipped intentionally empty since Phase 5 — every product screen was built and
verified against a temporary, never-committed fixture set, then reverted (§10). This phase populates it with a
real, professionally-written 16-product demo catalogue, and — the more consequential half of the brief — inserts
a service layer between it and every UI component, so a future Admin Portal (or any real backend) can replace the
data source without any component changing. No visual system, copy outside product content, navigation, or the
Hero/animation work changed.

**The service layer** (`services/productRepository.js`, new): every product query a screen needs —
`getProduct(slug)`, `getProductsByCategory`, `getProductsByDrop`, `getFeaturedProducts`, `getBestsellers`,
`getNewArrivals`, `getRelatedProducts`, `searchProducts`, `SHOP_VIEWS`, `availabilityMeta` — is a named function
here now, not an inline `.filter()` scattered across component files. `data/products.js` is the data SOURCE (today
a static array); the repository is the SERVICE that sits between it and the UI:

```
UI components (Shop.jsx, ProductCard.jsx, sections/…)
      ↓ import from
services/productRepository.js
      ↓ reads
data/products.js   (today: a static array — tomorrow: a real API/DB call, same function signatures)
```

All 12 components that previously imported `data/products.js` directly (`Shop.jsx`, `Product.jsx`,
`ProductCard.jsx`, `QuickView.jsx`, `Wishlist.jsx`, `SearchDialog.jsx`, `BestSellers.jsx`, `SignatureWatches.jsx`,
`JewelleryEditorial.jsx`, `FeaturedCollection.jsx`) now import from the repository instead — a mechanical,
same-signature change, plus three real cleanups the brief asked for directly: `BestSellers.jsx` and
`FeaturedCollection.jsx` re-implemented their own inline filters (`products.filter(p => p.tag === 'Most asked
for')`, `products.filter(p => p.drop === '01')`) instead of calling a shared query — now call
`getBestsellers()` / `getProductsByDrop('01')`; `SearchDialog.jsx` likewise now calls `searchProducts()`.
`data/products.js` itself is no longer imported by any UI file — only the repository touches it.

**Product model** (`data/products.js`): the typedef grew `id` (stable, independent of `slug` — a future DB
primary key), `subcategory`, `compareAtPrice`, `sku`, `stock`, `featured`, `bestseller` (replacing the
`tag === 'Most asked for'` string match with a real boolean — `tag` still exists, now purely display text),
`thumbnail`, `shortDescription`, `specifications`, `createdAt`/`updatedAt`. `isNew` and `availability` were kept
as-is rather than renamed to the brief's `newArrival`/`available` — they already are that field, already fully
wired through every screen, and renaming working code for a label match isn't a functional change.
`compareAtPrice` is real, not decorative: `components/product/Price.jsx` only renders the struck-through "was"
price when it's actually greater than the current price. `specifications` renders as a definition list in the
PDP's existing "Details" accordion tab (`pages/Product.jsx`) — no new tab, no layout change. `sku` renders as a
small line under the price. Every rated product's `rating.count` is held equal to its `reviews.length` — this
catalogue never shows a review count it doesn't back with real review text (same "no invented social proof"
principle as `getBestSellers`/reviews always did); products without written reviews get `rating: null` ("No
reviews yet"), not a fabricated average.

**The 16 demo products** (8 watches, 8 jewellery) are written in the brand's established voice — grounded,
specific, no "experience luxury like never before" copy — spanning every `availability` state, 4 in Drop 01, 5
flagged `bestseller`, 4 `isNew`, 4 `featured`, 3 with a real `compareAtPrice` discount, 4 with real written
reviews (ratings elsewhere are honestly `null`). Every product's `images.*` ids follow the real, documented
`products/<slug>/<view>` convention (`assets/README.md`) — at the time this catalogue was written, no id resolved
to a file, and every product deliberately showed the honest `MediaPlaceholder` "Photo needed" treatment rather
than fabricated photography (see the hand-off note at the end of this section). **That has since changed: §13
documents the AI-generated photography now in place for all 16 products**, added after the client explicitly
authorized it.

**Admin mutations — intentionally not implemented.** `productRepository.js` exports `createProduct`,
`updateProduct`, `deleteProduct`, `setProductPublished` with the exact signatures an Admin Portal's
product-management screens would call — every one of them throws, on purpose, rather than mutating the in-memory
array. A function that "saves" to a JS array that resets on every page refresh, with no auth check, visible to
any visitor with devtools open, is a decorative admin panel wearing a real one's clothes — the brief explicitly
ruled this out ("Do NOT pretend that a local frontend-only admin login is secure"). **No `/admin` route, login
page, or dashboard UI was built.** What's actually required before one can be, in order:

1. **A real backend** — Supabase/Firebase/a custom API + Postgres or similar. The product shape above (a flat
   object per product, string/number/boolean/array fields, no client-only state) maps directly onto a single
   `products` table/collection; no redesign of the model is needed to persist it.
2. **Authenticated write access** — an API route or database rule that only an authenticated admin session can
   call, never the public anon key/client alone. Session/JWT/cookie-based, verified server-side.
3. **An admin login flow** — real credential auth (Supabase Auth, NextAuth-equivalent, or a custom email+password
   + session), not a client-side password check against a hardcoded value.
4. **Protected admin routes** — a route guard that checks a verified server-side session before rendering any
   product-management UI, redirecting unauthenticated visitors; this app's public routes (`routes.jsx`) have no
   such concept today and none should be added without #2/#3 existing first.
5. **Image upload + storage** — `images.primary/hover/gallery` are currently registry ids resolved at *build*
   time from files already in the repo (`utils/media.js`); an admin "upload a product photo" flow needs real file
   storage (S3/Supabase Storage/Cloudinary/etc.) serving at *runtime*, which `utils/media.js`'s
   `import.meta.glob` approach cannot do — this is a second, separate integration from the product data API.
6. Once 1–5 exist, `productRepository.js`'s query functions become `async` (real I/O isn't synchronous) and each
   consuming component gains a loading/error state around its call — see the file's own top-of-file comment for
   exactly which functions and what changes; the function names, shapes and filtering semantics were already
   designed to match what a real API should expose, so this is mechanical, not a rewrite.

**Verified:** every populated section (Featured Collection, Signature Watches, Jewellery Editorial, Best Sellers,
Shop grid + all four category/segment views, header search, PDP + related products, Wishlist, Quick View, cart)
confirmed live against the real 16-product catalogue — correct counts, correct filtering/sorting (price
ascending/descending, unpriced-last logic untriggered since every demo product is priced), correct
compareAtPrice strikethrough, correct disabled "Add to cart" on the four non-orderable pieces, correct SKU/
specifications/reviews on the PDP, correct category-scoped related products, wishlist/cart correctly capturing
the selected variant and quantity. Zero console errors across every route, both desktop and mobile viewports, no
horizontal overflow. The Hero frame sequence (unrelated to this phase) reverified unaffected. `npm run check`
green (contrast, lint, build).

**Hand-off note on photography (superseded — see §13):** this phase's brief asked for "temporary imagery
consistent with the brand" if real photography is missing. This codebase had repeatedly, deliberately never used
stock or fabricated photography for products (`components/media/MediaPlaceholder.jsx`'s own comment: "Stock
photography is deliberately not used: it would misrepresent the products") — inventing photo-realistic images of
watches and jewellery that don't exist, presented as if they were real Sanovia pieces, would be exactly that. The
existing, already-verified `MediaPlaceholder` treatment (a labelled, on-brand card naming the exact shot needed)
was used instead for all 16 products' imagery, and the client was told explicitly that generating stand-in
photography was a brand-presentation decision for them to make, not one to default into. The client then made
that decision explicitly (next brief: "Create/source appropriate premium product imagery ... using whatever
image-generation ... capability is available") — §13 documents what was generated as a result.

## 13. Phase 8 — AI-generated demo product photography

Every product's `images.primary` / `images.hover` / `images.gallery` id (already declared in Phase 7's product
data, see above) now resolves to a real file — the `MediaPlaceholder` "Photo needed" state described just above
no longer appears for any of the 16 products. Nothing in `data/products.js`, `services/productRepository.js`, or
any component changed to make this happen — the registry (`utils/media.js`) already resolved these ids from
`src/assets/images/**` via `import.meta.glob`; this phase only added the files.

**Source:** AI-generated (Cloudinary's image-generation API, FLUX.2 Klein 9B model, `standard` tier), per the
client's explicit go-ahead described above. Not stock photography, not photos of real third-party products —
each image was generated from a prompt built from that product's own `description`/`specifications` (case shape,
plating, dial colour, strap/chain material) so the photo actually matches the copy, styled consistently: dark
espresso-to-black gradient background, soft directional studio lighting, editorial/catalogue framing, no text/
logos/watermarks, no visible faces on any worn/lifestyle shot.

**Coverage:** 35 unique images across all 16 products — every `front`/`primary` shot, every `wrist`/`worn` shot,
plus `detail`/`clasp` macro shots for the products whose `images.gallery` already listed them (Tonneau Signature
Watch, Oval Steel Watch, Circle Rose Gold Watch, Layered Chain Necklace). One additional image,
`editorial/drop-01-hero`, was generated for the homepage Featured Collection spotlight (`sections/
FeaturedCollection/FeaturedCollection.jsx`) — an id that section already referenced but that had no file, so it
was still showing "Drop 01 photo needed" on every visit; that component's id and markup are unchanged, only the
file was added.

**Location:** `src/assets/images/products/<slug>/<view>.jpg` (unsuffixed — no responsive width variants were
generated; see "Known follow-up" below) and `src/assets/images/editorial/drop-01-hero.jpg`, exactly matching the
existing naming convention in `assets/README.md`.

**Deliberately out of scope:** the five `CollectionShowcase` category-navigation cards (Watches/Jewellery/Drop 01/
Collections/About — `id={null}` by design, not tied to any product), the `BrandStory` lifestyle photo, and the
Instagram social-strip stills were left as `MediaPlaceholder`s. None of these are product photography — they're
editorial/social imagery outside `data/products.js` — and generating stand-ins for them wasn't part of the
client's ask, which was specifically about product imagery and the product data architecture.

**Known follow-up (not done here — out of scope for "add the missing photography"):** each file is a single
unsuffixed JPEG (300–600 KB), not the `<name>-<width>.<avif|webp|jpg>` responsive multi-format set the asset
budget table in `assets/README.md` calls for (≤120 KB @ 800w for a product image). The registry supports a single
unsuffixed file today (that's what's used here) so nothing is broken, but shipping these at full size to every
device is real weight — before production launch, run each through a resize/compress pass into the documented
`-480/-800/-1200` AVIF/WebP/JPEG set.

## 14. Phase 9 — full e-commerce checkout (WhatsApp demoted to support)

The brief: stop using WhatsApp as the way to complete a purchase — build a real Cart → Information → Shipping →
Payment → Confirmation checkout, with a centralized pricing/shipping/tax/discount engine and a payment-provider
abstraction, while changing nothing about the Hero, nav, product cards or existing sections. WhatsApp keeps a
role, but only as support ("Need help? Chat with us"), never as the purchase path.

**What "the cart" is now.** `context/OrderListContext.jsx` (still named for the WhatsApp-era "order list" model —
renaming the hook across every call site wasn't worth the diff) already had real add/remove/qty/persist logic
from Phase 2–3; it gained an `image` id and a `stock` cap per line (added qty is now capped at the product's
tracked `stock`, not just the flat `MAX_QTY`) and a `subtotal` selector. `components/product/OrderListDrawer.jsx`
is unchanged in structure but its primary action is now **"Proceed to Checkout"** (→ `/checkout`), with "Continue
shopping" beside it and WhatsApp reduced to a small "Need help? Chat with us" link that asks a support question,
never places an order. The PDP (`pages/Product.jsx`) makes the same swap: **"Add to cart" is the primary CTA**;
the former one-tap "Order on WhatsApp" buy-now button is gone for orderable products, replaced by a secondary
"Ask a question on WhatsApp" link. `OrderOnWhatsApp` (components/product/OrderControls.jsx) still exists and is
still used, but only for the *not-orderable* case (out-of-stock/coming-soon/made-to-order asks) — support, not a
purchase path, which is fine because nothing is purchasable there anyway.

**New services (all following productRepository.js's exact seam: named functions today reading local
config/localStorage, the same function names later reading a real backend):**
- `data/shipping.js` + `services/shippingService.js` — configurable methods (Standard/Express) and a
  free-shipping threshold. No component hardcodes a shipping price.
- `data/tax.js` + `services/taxService.js` — a single configurable rate (0% today, TBC with client, same honesty
  convention as `data/site.js`'s other TBC fields), applied to subtotal-minus-discount.
- `data/promoCodes.js` + `services/discountService.js` — demo codes (`SANOVIA10`, `SAVE500`) with type
  (percentage/fixed), minimum order, expiry and a usage limit field (enforcement is demo-only — see the file's
  own doc comment on what real enforcement needs).
- `utils/pricing.js` — **the** centralized `calculateOrderTotals()`: subtotal → discount → shipping → tax →
  total. The cart drawer, checkout page, order confirmation and order creation all call this one function, so
  the same total is never computed two different ways.
- `utils/validation.js` — email/phone/required-field/card-detail validators used by every checkout form.
- `services/paymentService.js` — a `PaymentProvider` abstraction (`createSession`/`confirmPayment`). Cash on
  Delivery is real (no gateway involved, payment collected on delivery). Card and Digital Wallet run through a
  clearly-labelled **test-mode simulation** (no gateway credentials exist in this project) — test card
  `4242 4242 4242 4242` simulates success, `4000 0000 0000 0002` simulates a decline, so failure handling is
  genuinely exercisable. Swapping in a real gateway later is adding one provider file and registering it in
  `LIVE_PROVIDERS`, gated by `VITE_PAYMENTS_LIVE` — no checkout UI change required. See §18 (Security) below.
- `services/orderService.js` — `createOrder()` generates a human-readable order number (`SAN-2026-000123`) and
  persists to localStorage (demo persistence — the file's doc comment spells out exactly what a real backend
  must add: server-side re-validation, auth-gated reads, auth-gated status mutations). Critically,
  `revalidateCartItems()` re-checks every cart line against the **live catalogue** right before an order is
  created — availability, stock, and **price** all come from `data/products.js` at order time, never the price
  the cart happened to cache, which is the browser-side version of "never trust frontend prices" (a real backend
  must still repeat this server-side; the comment says so explicitly).

**Checkout page** (`pages/Checkout.jsx`, route `/checkout`) — three in-page steps (Information → Shipping →
Payment) with a 5-node progress indicator (`components/checkout/CheckoutSteps.jsx`: Cart done → Information →
Shipping → Payment → Confirmation) and an always-visible, desktop-sticky `OrderSummary`
(`components/checkout/OrderSummary.jsx`) with a working promo-code field. Shipping/payment method selection uses
`components/checkout/OptionList.jsx` (native radios styled as cards — real keyboard/AT behaviour for free).
Guards: an empty cart shows "add a piece before checking out" instead of a blank form; "Place Order" disables
itself and guards against a second submit while a request is in flight (no duplicate orders on a double-click);
a failed/declined payment shows the exact reason and leaves every field intact so the customer can just fix and
retry, without losing their cart. On success the cart is cleared and the browser is sent to
`/order-confirmation?order=<orderNumber>` — a query param, not just router state, so a refresh or a shared link
still resolves the order (`pages/OrderConfirmation.jsx` reads it straight from `orderService.getOrder()`).

**Security note (brief §18):** this remains a static, backendless site. Stock/price re-validation, payment
confirmation and order persistence all currently run in the customer's own browser — good enough to make the
checkout flow genuinely functional and testable end-to-end, but **not** a substitute for server-side
verification. Every file that stands in for a future backend (`orderService.js`, `paymentService.js`,
`discountService.js`) says so directly in its own doc comment, the same pattern `productRepository.js`
established in Phase 7.

**Verified:** full flow tested end-to-end in a real browser (not just read) — add to cart → qty change → cart
drawer (real thumbnail, correct line subtotal) → checkout → validation (empty fields, invalid email, both
blocked with inline messages) → shipping method change and promo code (`SANOVIA10`) both recompute the total
immediately → payment step: a declined test card shows a clear retry-able error, a successful test card creates
a real order and lands on a working, refreshable/deep-linkable confirmation page with correct order number,
totals, address and payment/order status → cart persists across a real page refresh → checkout correctly blocks
on an empty cart → a double-click on "Place Order" produced exactly one order (confirmed via localStorage) →
zero console errors and zero horizontal overflow at 375px, 768px and 1440px. `npm run check` (contrast/lint/
build) green throughout.

**Not done (explicitly out of scope / needs real infrastructure before production):** a real payment gateway
(Stripe or similar — architecture is ready, credentials are not), transactional email (order confirmation/admin
notification — no email provider configured), a real backend for order storage and server-side re-validation, an
admin UI to act on `updateOrderStatus`/`updatePaymentStatus` (the functions exist, unauthenticated, in
`orderService.js`), and country/state pickers beyond a short illustrative list.
