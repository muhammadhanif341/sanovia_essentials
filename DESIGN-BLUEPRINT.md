# SANOVIA ESSENTIALS — DESIGN BLUEPRINT

**Phase 1 — Reference analysis + design direction** · Prepared 2026-09-21 · Status: **awaiting approval (Phase 2 not started)**

Design dials used with `ui-ux-pro-max`: **Variance 7 / Motion 8 / Density 3** (asymmetric editorial · cinematic choreography · spacious).

---

## 0. Evidence base — read this first

Everything below is derived from **one asset**: a phone screenshot of the `@sanovia_essentials` Instagram business profile. Nothing else was supplied (`reference/` does not exist; the project folder was empty).

| Confidence | What it covers |
|---|---|
| **Observed** (directly visible) | Logo disc, bio text, 4 story highlights, 6 grid tiles, on-image overlay text, packaging, product shapes, warm palette, portrait formats |
| **Inferred** (reasoned, not stated) | Target customer, price tier, "luxury level", founder identity, what sells best, Pakistan/PKR market |
| **Unknown** | Product names, prices, categories, catalogue size, original photo files, real logo file, shipping/returns policy, whether checkout is intended |

Caveats that affect every decision:

- Grid tiles are ~245 px thumbnails, cropped by Instagram and overlaid with reel icons. **No image here is usable as a production asset.** Colours below are read by eye and must be sampled from original files.
- The screenshot is dark mode because Instagram is. **The dark background, blue "Follow" button, tab bar, and status bar are Instagram UI, not brand.** They are excluded from all brand analysis.
- 15 posts / 135 followers: this is an early-stage brand. The design should feel *aspirational but honest* — no faux-heritage claims, no invented press logos, no fabricated reviews.

### 0.1 What the screenshot shows

| # | Item | What is visible |
|---|---|---|
| L | **Logo disc** (profile photo) | Deep espresso-brown circle; "SANOVIA" in champagne-gold classical serif caps; "ESSENTIALS" tiny, very widely tracked caps beneath |
| B | **Bio** | "Jewellery/watches · Minimal everyday essentials 🤎 · By @sania.living_ · Need help? Whatsapp +92… · Shop via Catalog / Dm ⭐" + `wa.me/c/…` catalog link |
| H1 | Highlight "Review" | Collage of customer chat screenshots |
| H2 | Highlight "Packing order…" | Grey poly-mailers on a wood table |
| H3 | Highlight "Watch drop 1" | Gold rectangular watch on a cushion in a navy box |
| H4 | Highlight "Collection 01" | Necklace/pendant collage with numbered "1 / 2 / 3" overlay (a "which do you like most?" poll) |
| T1 | Reel — "Let's pack an order ✨ ASMR edition" | Hand holding a **kraft box with a black round SANOVIA sticker**; wood table; gold script overlay |
| T2 | Reel | Grey poly-mailers stacked on a walnut table; navy box + jewellery tray behind |
| T3 | Reel | **Ring light + warm amber lamp glow** in a dark room (behind-the-scenes) |
| T4 | Reel | Group of vintage-style gold watches (rectangular, oval, silver stretch band, brown leather strap) on a white plinth; navy box with watch on cushion |
| T5 | Reel — "The one watch that's enough for every outfit" | Hand holding a **gold tonneau watch with a burgundy dial**; serif-italic overlay |
| T6 | Carousel | **Cream velvet crescent bust** with layered crystal-pendant necklaces on **deep plum fabric**, dried gypsophila |

---

## 1. Brand direction

### 1.1 Analysis

**Brand personality — warm, intimate, tactile.** The account is a person's hands, a wood table, a lamp, a box being taped shut. The voice is conversational ("Let's pack an order", "which one do you like the most?"). This is *warm luxury* — closer to a trusted friend with good taste than a maison. A cold, austere luxury template would betray it.

**Luxury level (inferred) — "quiet, accessible luxe".** Signals: gold-tone vintage-style watches, velvet displays, gift-ready boxes, "minimal everyday essentials". Counter-signals: poly-mailers, kraft packaging, phone-shot BTS, WhatsApp ordering. Price tier is unknown. The site should deliver a *premium feel* without positioning as haute luxury.

**Target customer (inferred).** Women roughly 18–35, Instagram-native, mobile-first, buying for themselves or as gifts, comfortable ordering through WhatsApp/DM. Note the number is a `+92` (Pakistan) line. *Likely* arrival path: Instagram bio link → in-app browser on a mid-range phone. This shapes performance and animation budgets (§8, §13).

**Jewellery/watch positioning.** Small-face, retro gold-tone watches (rectangular, oval, tonneau) and delicate layered necklaces — a **"quiet vintage gold"** look worn daily rather than occasion pieces. The tagline they already use: *"Minimal everyday essentials."*

**Visual mood.** Warm-dark and candle-lit: espresso browns, walnut wood, amber lamp light, champagne gold, with plum velvet and cream as editorial counterpoints.

**Photography — three registers, currently inconsistent:**

| Register | Where | Character | Role on site |
|---|---|---|---|
| **A. Styled still-life** | T6 (velvet + dried flowers), H3 | Plum backdrop, cream display, soft directional light, props | **Editorial / hero language** |
| **B. POV hand + macro** | T5, T1 | Hand enters frame, shallow depth, product 40–60 % of frame | **Hero + "Closer" language** |
| **C. Clean group on plinth** | T4 | White block, objects arranged on a diagonal, generous negative space | **Catalogue / range shots** |
| **D. Process / BTS** | T1–T3, H2 | Phone-shot, wood table, lamp glow, authentic clutter | **Trust language** (packing story) |

The feed mixes these without a unifying grade. **The website's job is to unify them**: one warm colour grade, a fixed backdrop palette (espresso / plum / cream / walnut), soft directional light.

**Composition observed.** Portrait-first (4:5 and 9:16). Central subject, diagonal arrangements, hand entering from the side, big negative space on the plinth shot. **Consequence: the hero cannot be a landscape banner.** It must be built around vertical imagery.

**Product presentation observed.** Watches on cushions inside gift boxes; jewellery on a sculptural cream bust; hands for scale. Presentation says *gift-ready* and *tactile*.

**Typography observed.** Logo: classical serif caps + micro-tracked caps sub-line (typeface not identified). On-image text: a serif italic (T5) — brand-consistent — and a chunky gold script (T1) which is an *Instagram editor font*, not brand.

**What makes it visually distinctive** (and worth building on):
1. The **circle** (logo disc, black box sticker, ring light) meeting **watch-case shapes** (oval, tonneau, rectangle) → a shape vocabulary.
2. **Amber lamp-light in a dark room** (T3) → a cinematic lighting motif.
3. **The hand** as recurring human-scale device (T1, T5).
4. **Packing as content** → a trust mechanic most jewellery sites lack.
5. **Numbered drops** ("Watch drop 1", "Collection 01") → a natural editorial structure.

### 1.2 Concept — **"Quiet Gold"**

> *A dressing table at night, lit by one lamp.* Espresso dark, one warm pool of light, gold used like a whisper. Objects are lifted out of boxes and placed into hands.

Three pillars, each traceable to the reference:

| Pillar | Reference source | Site expression |
|---|---|---|
| **Lamp-light** | T3 lamp glow | Warm radial light on dark sections; follows the cursor on desktop; slow idle drift on touch |
| **The hand** | T1, T5 | Hands-in-frame photography direction; "lifted from the box" reveal motion; CTA microcopy in first person |
| **Case shapes** | Logo disc, watch cases | Image masks in **arch / oval / tonneau / circle** — the site's signature shape language instead of rounded-rectangle cards |

**Emotional keywords:** warm · hushed · tactile · editorial · cinematic · gifted.
**Avoid:** cold minimalism, chrome/glass effects, glitter, faux-heritage, "luxury template" symmetry.

### 1.3 Voice (for placeholder copy — final copy is the client's)

Short, warm, first-person plural, lower drama. Headline candidates:
1. **"Minimal everyday essentials."** ← brand's own words (recommended)
2. "The one watch for every outfit." ← adapted from T5
3. "Small things, worn daily." ← new, for approval

### 1.4 What we do **not** carry over from Instagram

Blue CTA · bottom tab bar · story rings · 3-column square grid · reel play glyphs · bold UI sans · IG-editor script overlay font · emoji as icons · follower/post counters.

---

## 2. Color system

Hex values are **eyeballed from a low-res screenshot** and are a starting point. **Sample the real logo file and product photos before locking.** Contrast ratios below were **computed** (WCAG 2.x relative luminance), not estimated.

### 2.1 Tokens

| Token | Hex | Reference source | Role |
|---|---|---|---|
| `--espresso-950` | `#160D08` | Room in T3 | Footer, deepest surface, hero base |
| `--espresso-900` | `#1E120B` | — | **Primary dark surface** |
| `--espresso-800` | `#2A1A11` | — | Raised dark surface (cards, nav on scroll) |
| `--espresso-700` | `#3A2417` | **Logo disc** | Borders on dark, logo-disc fill |
| `--walnut-600` | `#5A3A28` | Wood table (T1, T2) | Image placeholders, dividers, wood-toned overlays |
| `--champagne-400` | `#C9A66B` | **"SANOVIA" wordmark** | **Primary accent on dark** (text, fills) |
| `--champagne-300` | `#E2C99A` | — | Hover / highlight on dark; focus ring on dark |
| `--champagne-500` | `#B08A4E` | Gold watches | Non-text gold: borders, icons, input borders on dark |
| `--brass-700` | `#7D5A22` | — | **Gold as *text* on light surfaces** |
| `--brass-800` | `#654716` | — | Small gold text on light (higher margin) |
| `--ivory-50` | `#F7F1E7` | Cream velvet (T6) | **Light surface / primary text on dark** |
| `--cream-100` | `#EDE3D3` | Velvet bust | Secondary light surface |
| `--sand-200` | `#DCCDB5` | — | Muted text / hairlines on dark |
| `--ink` | `#1C120C` | — | Text on light |
| `--plum-800` | `#33223B` | Plum fabric (T6) | Jewellery-editorial section base |
| `--plum-700` | `#4A3352` | Plum fabric | Editorial accent surface |
| `--burgundy-600` | `#7A1F2B` | Watch dial (T5) | Rare accent: "Limited", "Sold out", the one detail in the hero |
| `--burgundy-300` | `#D98A93` | — | Burgundy on dark |
| `--mailer-300` | `#C7D0D8` | Poly-mailers | Cool neutral, **only inside the packing story** |
| `--error-dark` / `--error-light` | `#E58A7A` / `#A32E22` | — | Form errors |
| `--success-dark` / `--success-light` | `#9DBB8A` / `#4A6B3A` | — | Confirmations |

Excluded on purpose: Instagram blue (`~#3D5AFE`), Instagram dark-mode grey. Navy (`~#1F2F5C` box) and kraft (`~#B9873F`) appear only *inside photography*, not in UI.

### 2.2 Verified contrast (computed)

| Pair | Ratio | Verdict |
|---|---|---|
| ivory-50 on espresso-900 | **16.30** | AA/AAA text |
| champagne-400 on espresso-900 | **7.98** | AA text |
| champagne-300 on espresso-900 | 11.39 | AA text |
| champagne-500 on espresso-900 | 5.75 | AA text · OK for UI borders/icons |
| champagne-400 on espresso-700 | 6.33 | AA text |
| sand-200 on espresso-800 | 10.72 | AA text (muted copy) |
| espresso-900 on champagne-400 (button label on gold) | 7.98 | AA text |
| ink on ivory-50 | 16.38 | AA/AAA text |
| espresso-700 on ivory-50 | 12.94 | AA text |
| **brass-700 on ivory-50** | **5.57** | AA text ← *use this for gold text on light* |
| brass-700 on cream-100 | 4.92 | AA text (tight; keep ≥16 px) |
| burgundy-600 on ivory-50 | 9.08 | AA text |
| ivory-50 on plum-700 | 9.91 | AA text |
| champagne-300 on plum-700 | 6.92 | AA text |
| champagne-400 on plum-800 | 6.39 | AA text |
| error-dark / error-light | 7.19 / 6.29 | AA text |
| success-dark / success-light | 8.64 / 5.41 | AA text |

**Failures to design around:**

| Pair | Ratio | Rule |
|---|---|---|
| ❌ champagne-400 on ivory-50 | **2.04** | **Never use logo-gold as text on light.** Use `brass-700`. |
| ❌ champagne-500 on ivory-50 | 2.84 | Not even for large text. |
| ❌ ivory on champagne-400 | 2.04 | Gold fills take **espresso** labels, never ivory. |
| ❌ white on WhatsApp green `#25D366` | 1.98 | Do **not** fill buttons with WhatsApp green. Use a gold button + monochrome WhatsApp glyph. |

### 2.3 Usage ratio and rhythm

- Across the home page: **~55 % espresso family · ~25 % ivory/cream · ~8 % plum · ~2 % burgundy · ~10 % photography**. Gold is *never* a large fill except the primary button.
- Gold appears as: hairlines, overlines, numerals, primary button, hover states, focus ring. If gold is everywhere it stops reading as gold.
- **Page rhythm (background sequence):** dark → dark → dark → full-bleed photo → **plum** → **ivory interlude** (packing story → grid → notes) → dark → dark → footer. Dark-led with a deliberate light passage keeps the cinematic mood while giving product grids a neutral field.
- Gradients: only (a) the lamp-glow radial (`champagne-400` @ 10–18 % → transparent), (b) image scrims for text-on-photo. No decorative gradients.
- Skill cross-check: `ui-ux-pro-max` "E-commerce Luxury" palette (`#1C1917 / #A16207 / #FAFAF9`) validates the dark + gold intent, but the palette here is derived from the logo, not the generic match.

---

## 3. Typography system

### 3.1 Families

| Role | Family | Why |
|---|---|---|
| **Display / editorial** | **Cormorant** (variable, roman + *italic*) | Matches the logo's classical serif caps; luxury-fashion pairing in `ui-ux-pro-max` typography DB ("Luxury Serif"); italic covers the T5 overlay voice |
| **UI / body / labels** | **Jost** (variable) | Geometric, light, fashion-forward. Recommended over the DB's top pairing (Montserrat): Montserrat's wide letterforms fight Cormorant's narrow serif at small sizes and it is the default "luxury template" sans. *This is a judgement call — Montserrat is an acceptable swap.* |
| **Wordmark** | The **real logo file** | Never retype "SANOVIA" in Cormorant. Logo typeface is unidentified. |

Both are Google Fonts (free). Load with `next/font` (self-hosted, subset Latin, `display: swap`, size-adjusted fallbacks).

**Cormorant rules:** it is thin. **Weight ≥ 500 below 28 px; ≥ 400 above.** On dark backgrounds thin serifs blur — bump size or weight rather than opacity. Never use Cormorant for body copy or UI.

### 3.2 Scale (fluid, `clamp()`)

| Style | Family / weight | Size (mobile → desktop) | Line-height | Tracking | Use |
|---|---|---|---|---|---|
| `display-xl` | Cormorant 500 | `clamp(3.25rem, 1.2rem + 9.2vw, 10rem)` | 0.92 | −0.02em | Hero headline (≤ 3 lines on mobile) |
| `display-l` | Cormorant 500 | `clamp(2.5rem, 1rem + 5.5vw, 6rem)` | 0.98 | −0.015em | Statement, section openers |
| `h1` | Cormorant 500 | `clamp(2.25rem, 1.2rem + 3.6vw, 4.5rem)` | 1.05 | −0.01em | Page titles |
| `h2` | Cormorant 500 | `clamp(1.75rem, 1rem + 2.4vw, 3rem)` | 1.1 | 0 | Section titles |
| `h3` | Cormorant 500 | `clamp(1.375rem, 1rem + 1vw, 1.875rem)` | 1.2 | 0 | Product names, card titles |
| `quote` | Cormorant 500 *italic* | `clamp(1.5rem, 1rem + 1.6vw, 2.5rem)` | 1.25 | 0 | Pull-quotes, reviews, the one italic word in a headline |
| `body-l` | Jost 300–400 | `clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)` | 1.6 | 0 | Intro paragraphs |
| `body` | Jost 400 | 1rem (→ 1.0625rem ≥ 1280) | 1.65 | 0 | Default (**min 16 px**) |
| `small` | Jost 400 | 0.875rem | 1.5 | 0.01em | Captions, meta |
| `overline` | Jost 500 **UPPERCASE** | 0.75rem (12 px) | 1.3 | **+0.22em** | Section labels, "DROP 01", nav — echoes the logo's "ESSENTIALS" line |
| `numeral` | Cormorant 400 | `clamp(4rem, 2rem + 12vw, 14rem)` | 0.8 | 0 | Ghost numerals "01 02 03", 6–10 % opacity |
| `price` | Jost 500, tabular-nums | 1rem–1.125rem | 1 | 0.02em | Prices (currency to confirm) |

### 3.3 Typographic behaviours

- **One italic word per headline**, in `champagne-300` on dark / `brass-700` on light — a signature move ("Minimal *everyday* essentials.").
- `text-wrap: balance` on headings, `text-wrap: pretty` on body. Headline measure ≤ 14 ch per line at display sizes; body ≤ 62 ch.
- Overlines are the **only** all-caps text and always tracked. Never track lowercase.
- No text below 12 px; overlines are 12 px only because contrast is ≥ 7:1.
- Text on photography always sits on a scrim (≥ 4.5:1 measured against the *lightest* region behind it).
- **Urdu/RTL:** not in scope unless approved (§14). It would add a Nastaliq/Naskh face, RTL layout mirroring, and different line-heights.

---

## 4. Spacing system

**Base unit 4 px; scale in 8-pt steps.** Density dial = 3/10 → spacious, marketing-grade.

| Token | px | Typical use |
|---|---|---|
| `--space-1` | 4 | Icon gaps |
| `--space-2` | 8 | Min gap between touch targets |
| `--space-3` | 12 | Chip padding |
| `--space-4` | 16 | Base gutter mobile, control padding |
| `--space-5` | 24 | Card padding, grid gap mobile |
| `--space-6` | 32 | Grid gap tablet |
| `--space-7` | 48 | Block spacing, grid gap desktop |
| `--space-8` | 64 | Between text and media groups |
| `--space-9` | 96 | Section padding (mobile) |
| `--space-10` | 128 | Section padding (laptop) |
| `--space-11` | 192 | Section padding (desktop) / hero rhythm |

- **Section padding-block:** `clamp(96px, 12vw, 192px)`. Deliberately generous — silence is part of the luxury signal.
- **Page margin (gutter):** `clamp(20px, 5vw, 80px)`.
- **Grid:** 12 col ≥ 1024 · 8 col 768–1023 · 4 col < 768. Column gap 24 / 32 / 48. Content max-width **1440**, full-bleed allowed for imagery; above 1920 the layout letterboxes, it does not scale further.
- **Radius:** `0` for editorial rectangles · `9999px` for pills/buttons/chips · **shape masks** (`arch`, `oval`, `tonneau`, `circle`) for imagery. **No 8–16 px "SaaS" radii.**
- **Borders:** 1 px hairline, `champagne-400` @ 20–30 % on dark; `ink` @ 12 % on light. Hairlines do structural work in place of shadows/cards.
- **Shadows:** none, except a soft warm glow (`champagne-400` @ 12 %, blur 60 px) behind hero objects.
- **Z-index scale:** content 0 · sticky elements 10 · nav 50 · drawer 60 · overlay/menu 70 · page-transition curtain 90 · toast 100.
- **Scroll offsets:** `scroll-padding-top` = nav height + 16 px so anchored/focused elements are never hidden (WCAG 2.4.11).

---

## 5. Component philosophy

1. **Shape over surface.** Distinctiveness comes from masks and hairlines, not cards and shadows. If a component needs a box, it gets a hairline.
2. **Warm, not glossy.** No glassmorphism, no frosted blur, no neon. (The `ui-ux-pro-max` design-system query returned "Liquid Glass" as its style match; **rejected** — it's Apple-platform chrome and off-mood. Blur only for the nav-on-scroll scrim, and only if performance allows.)
3. **Photography is the interface.** Components are quiet frames; imagery carries emphasis.
4. **One animation engine.** GSAP only. Patterns from other libraries are *ported*, never installed alongside (§9, §10).
5. **Own the primitives, borrow the patterns.** shadcn/Radix supplies accessible behaviour (Dialog/Sheet, Accordion, Tabs); visual layer is fully custom — nothing should look like default shadcn.
6. **Every interactive element has all states**: default · hover · focus-visible · active · disabled · loading. Hover is never the only affordance (touch).
7. **Icons:** SVG (Lucide, 1.25–1.5 px stroke) or custom. **No emoji as UI** — the bio's 🤎/⭐ stay on Instagram.

### 5.1 Primitive inventory

| Component | Spec |
|---|---|
| **Button — primary** | Pill, `champagne-400` fill, `espresso-900` label (7.98:1), Jost 500 overline style; hover: `champagne-300` fill sweeping up from bottom (scaleY pseudo-element, 400 ms); min height **48 px** |
| **Button — ghost** | Pill, 1 px `champagne-400` hairline, ivory label; hover fills |
| **Button — WhatsApp order** | Primary button + monochrome WhatsApp glyph. **Not** WhatsApp green (1.98:1). Check WhatsApp brand guidelines for glyph use before launch |
| **Text link** | Underline is a hairline that draws left→right on hover (scaleX, origin flips), 350 ms |
| **Nav** | See §6.3 |
| **ShapeMedia** | `<img>`/video in `arch` / `oval` / `tonneau` / `circle` / `rect` mask; fixed aspect ratio reserved (no CLS); optional second image for hover swap; blur-up placeholder in `walnut-600` |
| **ProductCard** | ShapeMedia + `numeral` index + name (`h3`) + price + quick-order affordance. Hover (fine pointer): swap to second image (on-hand shot), underline draws, cursor label "Order". Touch: tap → PDP. No wishlist, no star ratings (no data to back them) |
| **Tag** | Overline-style chip: "Drop 01", "Limited" (burgundy), "Most asked for" |
| **SectionHeader** | Overline + `display-l`/`h2` with one italic word + optional hairline rule |
| **Marquee** | Text-only ticker; **pauses on hover/focus; static when reduced-motion**; never carries essential info |
| **Drawer (Order list)** | Radix Dialog/Sheet; lists chosen items; "Send on WhatsApp" composes a prefilled `wa.me` message |
| **Form field** | Visible label above (never placeholder-only), 48 px height, hairline border `champagne-500`/`brass-700`, error text adjacent with icon + text |
| **Accordion (FAQ / product details)** | Radix Accordion, hairline dividers, plus/minus glyph rotation |
| **Toast** | "Added to order list", `aria-live="polite"`, 4 s, dismissible |
| **Cursor label** | Desktop fine-pointer only; small circle that becomes a label ("Order", "Drag", "Play") — **native cursor stays visible** |

---

## 6. Section architecture

### 6.1 Sitemap

| Route | Purpose |
|---|---|
| `/` | Home — the editorial experience (§6.2) |
| `/shop` | All products · filters (category, drop) · sort |
| `/shop/[category]` | Watches · Jewellery (sub-categories TBC) |
| `/drops/[n]` | Editorial landing per drop (Drop 01, Collection 01…) — mirrors how the brand already names releases |
| `/product/[slug]` | PDP (§6.4) |
| `/story` | Brand story · "how we pack" · founder note |
| `/help` | Shipping · returns · care · sizing · FAQ · contact |
| `/order` | *(only if commerce model A — §14)* Order-list review → WhatsApp handoff |
| `/404`, `/privacy`, `/terms` | Utility |

**Commerce model is the single biggest open decision (§14).** The bio says *"Shop via Catalog / Dm"* and links to a WhatsApp catalog — ordering is currently conversational. Recommended launch model: **"Order list" → prefilled WhatsApp message** (mirrors real operations, no payment integration). Full cart/checkout is a later, separate scope.

### 6.2 Home page — custom composition (not hero → 3 cards → testimonials → footer)

The brief's suggested list is **modified**: *Featured Collection + Signature Watches* merged into one horizontal "Drop 01"; *Best Sellers* becomes a flag inside the catalogue grid ("Most asked for" — honest for an early brand with no sales dashboard); *Brand Story* is delivered through the packing story and a short founder note rather than a standalone "About" band; *Newsletter* becomes a **Drop List** (fits their drop model).

| # | Section | Surface | Composition | Motion (details §7) | Asset dependency |
|---|---|---|---|---|---|
| S0 | **Intro** (first visit only) | espresso-950 | Logo disc draws (stroke) → fills → curtain lifts. **≤ 900 ms**, tied to real font/hero readiness, skippable, never on return visits | Timeline + `sessionStorage` flag | Logo (vector) |
| S1 | **Hero — "Minimal everyday essentials."** | espresso-900 + lamp glow | Asymmetric: overline + display headline bottom-left; **tall arch image** (portrait, right-of-centre) overlapped by a **small oval detail image**; one hairline; CTA pair; scroll cue. Nav transparent | Load choreography; cursor lamp glow; layered parallax | 1 portrait hero (hand + watch) + 1 detail macro |
| S2 | **Statement** (brand intro) | espresso-900 | One paragraph in `display-l`, left-aligned, ragged; words illuminate dim→ivory as you scroll; three overline "facts" beneath (e.g. *Watches · Jewellery · Gifts*) | Scroll-scrubbed word illumination | none |
| S3 | **Drop 01 — Signature Watches** | espresso-800 | **Horizontal track**: 5–7 tall panels, each = tonneau/oval/rect mask, giant ghost numeral, name, price, quick-order. Header + progress hairline fixed above | Sticky/pinned horizontal scroll (desktop/laptop); native snap carousel (tablet/mobile) | 5–7 product shots, 4:5 |
| S4 | **Closer** ("one watch, closely") | espresso-950 | Full-bleed dial macro; three hairline callouts (case · bracelet · size — *facts from client*) | Scrub scale + caption cascade, **no pin** | 1 macro still. **Cut this section if no macro exists** |
| S5 | **On Velvet — Jewellery editorial** | plum-800 | Asymmetric collage of 4–5 images at different sizes/offsets; sticky text column at left; overline "COLLECTION 01"; italic pull-quote | Multi-speed parallax; clip-path reveals; bg cross-fade espresso → plum | 4–5 styled stills (velvet/bust register) |
| S6 | **Packed by hand** — scroll story | ivory-50 / cream-100 | Sticky stage: 4 steps — *placed in tissue → boxed → sealed with the round sticker → mailed*. Big step index "01 / 04", one sentence each | **Pinned/sticky, scrubbed**, still-frame crossfades (not video) | 4–6 packing stills (T1 register, cleaner) |
| S7 | **Collection 01 — Catalogue** | ivory-50 | **Broken 12-col grid** with mixed aspect ratios (4:5, 1:1, 3:4 arch); category chips (All · Watches · Necklaces · …); "Most asked for" tag; feature tile every ~6 items | Batch reveals; **Flip** filter; hover image swap | Cutout/plinth shots per SKU (C register) |
| S8 | **Notes** — reviews | cream-100 | Customer chat screenshots recomposed as tilted paper notes (±3°) plus one large serif-italic pull-quote; **only real reviews with consent** | Slow drift by row; carousel on mobile | H1 screenshots + consent |
| S9 | **On the table** — social strip | espresso-900 | Film-strip of 6–8 tiles (4:5), overline "@sanovia_essentials", link out. **Not** an Instagram UI clone: no counts, no icons row, no profile header | Paused-on-hover marquee; muted hover-preview if video supplied | Reel stills/mp4 |
| S10 | **Order the easy way** | espresso-800 | Split: left — "Need help choosing? Message us." + WhatsApp CTA (magnetic); right — **Drop List** signup ("Tell me when Drop 02 lands") | Reveal; magnetic CTA | WhatsApp number |
| S11 | **Footer** | espresso-950 | Oversized cropped wordmark bleeding off the bottom; nav columns; shipping/returns; social; small print | Wordmark rises on scroll-scrub | Logo (vector) |

**Pin budget:** `ui-ux-pro-max` GSAP guidance — *"don't pin more than 1–2 sections"* — is adopted. Pinned/sticky scroll-driven stages: **S3 and S6 only.** S4, S5, S8 use scrubbed transforms without pinning.

Hero wireframe (desktop 1440, illustrative only):

```
┌────────────────────────────────────────────────────────────────────────┐
│ ◯ SANOVIA    Watches  Jewellery  Drop 01        Story   Order list (0) │
│                                                                        │
│  DROP 01 · WATCHES & JEWELLERY                    ╭──────────╮ ╭───╮    │
│                                                   │          │ │   │    │
│  Minimal                                          │   tall   │ ╰───╯    │
│  everyday                                         │   arch   │  oval    │
│  essentials.                                      │  (hand + │  detail  │
│                                                   │  watch)  │          │
│  [ Order on WhatsApp ]   Browse Drop 01 →         │          │          │
│  ── scroll               ·· lamp glow tracks cursor ··       ╰──────────╯│
└────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Navigation

- **Desktop/laptop:** three-zone bar — left links (Watches · Jewellery · Drop 01), **centre logo disc + wordmark**, right (Story · Order list (n) · WhatsApp). Transparent over hero → `espresso-900` @ 92 % after 80 px. **Hide on scroll-down, reveal on scroll-up.** Logo disc doubles as a **scroll-progress ring** (a watch-hand-like sweep, hairline).
- **Tablet/mobile:** logo left, order-list + menu button right. Menu opens a **full-screen espresso overlay**: large `h1` serif links, staggered; WhatsApp CTA pinned at the bottom with safe-area padding; Esc/close returns focus to the trigger; focus is trapped while open.
- **Mobile PDP:** sticky bottom bar "Order on WhatsApp" (respects `env(safe-area-inset-bottom)` and does not cover focused fields).

### 6.4 Product detail page

Mobile: swipeable gallery (4:5) with dot indicators and 44 px arrows. Desktop: two-column, **sticky info column** beside a vertical image stack (masks preserved). Info: overline (drop), `h1` name, price, variant swatches (strap/colour — *if real*), primary "Order on WhatsApp", secondary "Add to order list", accordion (details · size & fit · care · shipping/returns), "Wear it with" (2–3 pairings — real cross-sells only). Shared-element transition from grid card image → PDP hero is a **stretch goal** (§7.9).

---

## 7. Animation strategy

**Principles**

1. **Motion conveys meaning**: light (lamp), lift (object out of box), reveal (unwrapping). No motion for decoration alone.
2. **Cinematic but interruptible**: nothing blocks scroll or interaction. Load choreography ≤ 1.6 s and is interactive from t=0.
3. **Only animate `transform`, `opacity`, `clip-path`** (and `filter` sparingly). Never width/height/top/left.
4. **Progressive enhancement**: content is fully visible without JS; JS opts in to hidden-initial states (§10.4).
5. **Reduced motion is a first-class design**, not an afterthought (§7.10).
6. **Budget**: max 2 pinned/sticky stages on home; max ~400 split-text nodes per page; only headline-length copy is split.

### 7.1 Motion tokens

| Token | Value | Use |
|---|---|---|
| `dur.fast` | 0.2 s | Hover feedback, focus |
| `dur.base` | 0.4 s | Buttons, links, small reveals |
| `dur.slow` | 0.7 s | Card reveals, filter Flip |
| `dur.cine` | 1.2 s | Image masks, hero elements |
| `dur.epic` | 1.8 s | Intro, footer wordmark |
| `ease.out` | `CustomEase "0.16,1,0.3,1"` (≈ expo.out) | Entrances |
| `ease.inOut` | `CustomEase "0.76,0,0.24,1"` | Transitions, curtain |
| `ease.scrub` | `none` (linear) | Scroll-linked tweens (smoothing via `scrub: 0.6–1`) |
| `stagger.s / m / l` | 0.04 / 0.08 / 0.14 s | Chars-or-words / lines / cards |
| `dist.s / m / l` | 16 / 40 / 80 px | Reveal offsets |

Exits are **shorter than entrances** (~60–70 %). Hover in/out are asymmetric (in 200 ms, out 350 ms).

### 7.2 Hero (load + scroll)

Load timeline (≈1.5 s, `ease.out`):
1. t=0.0 — lamp-glow radial fades 0→1 (1.2 s).
2. t=0.1 — headline **SplitText lines**, mask-up `yPercent 110→0`, stagger `m`.
3. t=0.3 — arch image `clip-path` opens from the bottom; inner image `scale 1.25→1` (1.4 s).
4. t=0.5 — oval detail image fades/scales in, offset.
5. t=0.8 — overline, CTAs, nav fade-up.

Scroll: arch image `yPercent 0→-8`, oval `0→-18` (faster = depth), headline lines drift `xPercent ±3`, hero dims via overlay opacity (not a bg-colour tween).
Pointer (fine): lamp glow follows cursor via `gsap.quickTo` (0.6 s, `power3.out`), radius breathes ±8 % on idle. Touch: slow sine drift (12 s loop), no pointer tracking.

### 7.3 Typography

- **Headlines:** SplitText `lines` → mask reveal on enter (`start: "top 85%"`), once. Revert on cleanup. Never split paragraphs.
- **Statement (S2):** SplitText `words`; scrub `opacity 0.18→1` + colour `sand-200 @ 45 % → ivory`, stagger across the paragraph, `start: "top 75%" end: "bottom 45%"`, `scrub: true`. No pin.
- **Numerals:** ghost numerals translate at 1.4× track speed in S3.
- SplitText is free in GSAP ≥ 3.13; verify `aria` handling at implementation (default should preserve an accessible label).

### 7.4 Image reveals

Standard reveal = `clip-path: inset(100% 0 0 0)` → `inset(0)` (0.9 s, `ease.out`) with inner image `scale 1.2→1` (1.3 s). Masks: arch/oval reveals use the shape as the clip end-state. Batch via `ScrollTrigger.batch` for grids (stagger `s`). Above-the-fold images do **not** wait for scroll and do not depend on JS to be visible.

### 7.5 Product showcases

- **S3 horizontal:** see §7.6. Cards enter with the track, image parallax ±8 % (via `containerAnimation`).
- **Card hover (fine pointer):** second image crossfade 0.6 s; image `scale 1.04` over 1.2 s; name underline draws; cursor label "Order".
- **Filter (S7):** `Flip.getState` → toggle → `Flip.from` (0.7 s, `ease.inOut`, `fade: true`, `absolute: true`) — grid rearranges rather than flashing.
- **Add to order list:** button glyph morphs to a check (0.3 s), count in nav bumps (`scale 1→1.25→1`), toast announces.

### 7.6 Horizontal movement (S3)

- Desktop/laptop: **sticky-first** — a tall wrapper (`height ≈ track distance + 100svh`) with a `position: sticky` stage; one ScrollTrigger scrubs the track `x` from 0 to `-(scrollWidth − innerWidth)`, `ease: none`, `scrub: 0.6`, `invalidateOnRefresh`. Sticky is preferred over `pin: true` because it avoids pin-spacer layout shifts in dynamic-toolbar mobile browsers (Instagram's in-app browser).
- Keyboard/AT: track is a labelled region; **Prev/Next buttons** move the window scroll to each card's computed position; `focusin` on a card syncs scroll. All cards remain in DOM order.
- Tablet/mobile: **no GSAP horizontal** — native `overflow-x: auto; scroll-snap-type: x mandatory` with ~1.15 cards visible (peek), plus arrow buttons (44 px).

### 7.7 Scroll storytelling

- **S6 Packed by hand:** sticky stage, one scrubbed timeline (~400 vh desktop, ~300 vh tablet). Each step crossfades a still (`opacity`, tiny `scale 1.04→1`), swaps a one-line caption (SplitText lines), advances the "0n / 04" index, and draws a hairline progress bar. Frames are **stills**, not video/canvas — light, robust, cacheable. Mobile: no pin — four stacked mini-chapters, each revealed with the standard image reveal.
- **S4 Closer:** image `scale 1→1.25` + slight `x` drift across viewport transit; three captions appear at progress 0.2 / 0.5 / 0.8 with hairline leader lines (`scaleX 0→1`). No pin.
- **S5 On Velvet:** background overlay `opacity` 0→1 as section enters (espresso → plum); collage images at speeds −6 / +4 / −12 / +8 `yPercent`; text column CSS-sticky.

### 7.8 Parallax rules

Background/decorative layers only — **never body copy or interactive controls**. Deltas 5–15 % (`yPercent`). ≤ 4 layers per section. Layers clipped by `overflow: hidden` on the wrapper. `will-change: transform` set on the layer during scroll only.

### 7.9 Page transitions

- **v1 (in scope): curtain.** Link click → espresso panel wipes in with `clip-path: circle(0% at <click x,y>) → circle(150%)` (0.7 s, `ease.inOut`, logo disc centred) → route change + scroll to top → panel retracts upward (0.6 s). Total ≤ 1.0 s. On `popstate` (back/forward): skip exit, 200 ms crossfade. Reduced motion: 150 ms crossfade.
- **v2 (stretch): shared-element** grid card → PDP hero via **Flip** (`data-flip-id`), desktop only, with automatic fallback to the curtain. `ui-ux-pro-max` notes both routes must render the same `data-flip-id`; in Next.js App Router this is non-trivial — treat as stretch, not a promise.
- On every route change: kill route-scoped ScrollTriggers, `ScrollTrigger.refresh()` after new content and images settle.

### 7.10 Reduced motion & touch

`prefers-reduced-motion: reduce` → no pinning, no parallax, no scrubbing, no marquee movement, no cursor effects; reveals become ≤ 200 ms opacity fades or are simply present. S3 becomes the native carousel; S6 becomes stacked steps. `(pointer: coarse)` — regardless of width (iPad Pro) — disables hover-dependent effects (cursor label, magnetic, hover swap becomes a visible dot indicator).

### 7.11 Optional: smooth-scroll library

**Default: off.** ScrollTrigger scrub smoothing is sufficient; smooth-scroll libraries can conflict with native touch scrolling, in-app browsers, and assistive tech. If desired, enable only for `(pointer: fine)` with touch left native. Decision in §14.

---

## 8. Responsive strategy

### 8.1 Breakpoints

| Class | Range | Design width | Test widths |
|---|---|---|---|
| **Mobile** | < 768 | **390** (primary design target) | 360, 375, 390, 430 |
| **Tablet** | 768–1023 | 820 | 768, 820, 1024 (portrait iPad) |
| **Laptop** | 1024–1439 | 1280 | 1024, 1280, 1366 |
| **Desktop** | ≥ 1440 | 1536 (letterbox > 1920) | 1440, 1536, 1920, 2560 |

**Mobile-first CSS**, but *design* priority is mobile because Instagram traffic lands there. Layout reflows cleanly to 320 px with zero page-level horizontal scroll.

### 8.2 Area-by-area

| Area | Mobile | Tablet | Laptop | Desktop |
|---|---|---|---|---|
| **Hero** | Stacked: headline (≤3 lines) over a portrait arch image (≈ 62 svh), oval detail overlaps the arch corner; CTAs full-width; lamp glow idles | Two-column 5/7 split, arch right; oval overlaps | 12-col: text cols 1–5, arch 7–10, oval 10–12 | Same, larger type, wider negative space |
| **Navigation** | Logo + order-list + menu → full-screen overlay; bottom order bar on PDP | Same as mobile with larger overlay type | Full 3-zone bar | Full bar, larger spacing |
| **Product grid** | **2-up**, 4:5, compact info; a full-width feature tile every 6 items | **3-up** (2-up portrait) | **3-up** broken grid | **4-up** broken 12-col with mixed aspects |
| **Drop 01 (S3)** | Native snap carousel, 1.15 cards, arrows | Native snap, 2.2 cards | **Sticky horizontal scrub** | Sticky horizontal scrub, ghost numerals |
| **Editorial (S5)** | Single column; images full-bleed, staggered widths; reveal only | 2-column, 2 parallax speeds | 3-speed collage + sticky text | Full 4–5 image collage |
| **Packing story (S6)** | Four stacked chapters | Sticky stage, ~300 vh | Sticky stage, ~400 vh | Sticky stage, larger stills |
| **Reviews (S8)** | Snap carousel of notes | Two rows, slight tilt | Three-row drift | Same, wider |
| **Typography** | Fluid scale; hero ≤ 3 lines; body 16 px | Fluid | Fluid | Capped at `display-xl` 160 px |
| **GSAP** | Reveals + 40 % parallax; no cursor; no char split | Reveals + 60 % parallax | Full | Full |
| **Footer** | Wordmark 100 % width, cropped 15 % | Same | Same | Same, hairline columns |

### 8.3 Instagram in-app browser & mid-range Android (assumed, verify)

- Use **`svh`/`dvh`**, never raw `100vh`. Set `ScrollTrigger.config({ ignoreMobileResize: true })` so the toolbar collapsing doesn't trigger constant refreshes.
- Avoid `backdrop-filter` beyond the nav; avoid large blurred elements; keep filter animation off.
- `env(safe-area-inset-*)` on any fixed bar. No fixed element may cover a focused field.
- Videos: muted, `playsinline`, poster frame, lazy, ≤ ~1.5 MB per loop.
- Test in: Instagram in-app browser (iOS + Android), Safari iOS, Chrome Android on a low-tier device, plus 4× CPU throttle on desktop.

---

## 9. 21st.dev component recommendations

**Method & limits.** Searched the 21st.dev catalogue with the MCP (metadata only). I read **descriptions and previews' metadata**, not source; **no component code was retrieved** (retrieval is metered per the tool description, and Phase 1 doesn't need it). The catalogue search for a warm brown/gold **theme returned nothing**, so the palette stays bespoke. Installing any component needs a 21st.dev API key.

**Key finding:** most listings that state their engine use **Motion / Framer Motion**; only one found is explicitly GSAP (*Text Reveal Block*). Since GSAP is the single animation engine (§5.4), the rule is **adopt the pattern, re-implement in GSAP, restyle to Quiet Gold**. Nothing is copied wholesale.

### 9.1 Recommended (pattern-level)

| Need | Candidate (ID · author) | Fit | What we take | What we change |
|---|---|---|---|---|
| **Full-screen mobile menu** | [Immersive Full Screen Navigation](https://21st.dev/@hyperiux/components/immersive-full-screen-nav) (27229 · hyperiux) | ★★★ | Overlay-nav structure; staggered large links | Espresso/serif styling; focus trap + Esc; GSAP timeline |
| **Compact nav / menu toggle** | [Liquid Morph Floating Menu](https://21st.dev/@aayush-duhan/components/liquid-morph-floating-menu) (16369 · aayush-duhan) | ★★☆ | Pill that expands into a dark menu; **letter-roll link hover** | Drop "liquid/glossy" look; recolour; check a11y |
| **Order-list drawer / filter sheet (mobile)** | [Drawer](https://21st.dev/@coss.com/components/drawer) (11444 · coss.com) | ★★★ | Swipe gestures, snap points, all edges | Restyle; use for order list and mobile filters |
| **Nav a11y baseline** | [Navbar with Dropdowns](https://21st.dev/@shadcnblockscom/components/shadcnblocks-com-navbar1) (606 · shadcnblockscom) | ★★☆ | Radix semantics reference only | Not visually used |
| **Hero composition** | [Editorial Collage Hero](https://21st.dev/@felipemenezes098/components/hero-04) (19074 · felipemenezes098) | ★★★ | Layered overlapping images + serif headline → matches arch + oval | Replace rectangles with shape masks; asymmetric; GSAP load timeline |
| **Hero layout reference** | [Editorial Hero](https://21st.dev/@felipemenezes098/components/hero-05) (19075) · [Editorial Image Hero](https://21st.dev/@felipemenezes098/components/hero-07) (19077) | ★★☆ | Left tagline / right headline tension | Portrait-first, not landscape image band |
| **Lamp glow** | [Cursor Spotlight](https://21st.dev/@pulkitxm/components/cursor-spotlight) (18361 · pulkitxm) · [Spotlight Background](https://21st.dev/@ruixen.ui/components/spotlight-background) (7645) | ★★★ | Radial light following cursor; "breathing" radius on idle | Warm champagne light, `quickTo`, touch idle drift |
| **Product card structure** | [Product Card (compound)](https://21st.dev/@deltacomponents/components/product-card) (28199 · deltacomponents) | ★★★ | Composable image-well / title / price API | Remove wishlist; add shape mask, numeral, order affordance |
| **Product hover swap** | [Reveal on hover](https://21st.dev/@youcefbnm/components/reveal-on-hover) (1816) | ★★☆ | Image scale + hidden-content reveal | Simplify to second-image crossfade |
| **Variant imagery** | [ProductCard (multi-colour)](https://21st.dev/@youcefbnm/components/product-card) (1635) | ★☆☆ | Idea for strap/colour swatches → image swap | Only if real variants exist |
| **Horizontal scroll (S3)** | [Scroll Horizontal Gallery](https://21st.dev/@motiondotdev/components/motion-scroll-horizontal) (24623 · motion.dev) | ★★★ | **Sticky + scroll-linked x** (the exact approach in §7.6) | **Port to GSAP ScrollTrigger**; add keyboard controls |
| **Horizontal alt** | [Horizontal Scroll Gallery](https://21st.dev/@pulkitxm/components/horizontal-scroll-gallery) (20139) | ★★☆ | Pinned-track reference | Compare implementation before choosing |
| **Headline reveal** | [Text Reveal Block](https://21st.dev/@soralabs/components/text-reveal-block) (19260 · soralabs) | ★★★ | **Only GSAP-native find**: SplitText + ScrollTrigger line wipe | Re-skin; likely champagne wipe or plain mask |
| **Line/word mask reveal** | [Text Reveal (Mask)](https://21st.dev/@soralabs/components/text-reveal-mask) (19257) | ★★★ | Mask-and-slide by line/word with inline emphasis (our italic word) | Port to GSAP |
| **Statement scrub (S2)** | [Scroll word reveal](https://21st.dev/@motiondotdev/components/motion-scroll-word-reveal) (24525 · motion.dev) | ★★★ | Per-word scroll reveal | Port to GSAP scrub |
| **Magnetic CTA** | [Magnetic](https://21st.dev/@ibelick/components/magnetic) (649 · ibelick) · [Magnetic Button](https://21st.dev/@bundui/components/magnetic-button) (1507) | ★★☆ | Pull-toward-cursor behaviour | GSAP `quickTo`; **primary CTAs only**, fine pointer only |
| **Custom cursor** | [Custom Cursor](https://21st.dev/@soralabs/components/custom-cursor) (18283 · soralabs) | ★★☆ | Ring morphs over interactive targets | Label states ("Order"/"Drag"); keep native cursor |
| **Ticker (S9)** | [Logo Marquee](https://21st.dev/@ddoemonn/components/logo-marquee) (23537 · ddoemonn) | ★★★ | **Pauses on hover/focus; respects reduced motion** — a11y baseline | Text/tiles instead of logos |
| **Reviews layout** | [Staggered Testimonials Grid](https://21st.dev/@efferd/components/testimonials-3) (18942) · [Testimonial Section](https://21st.dev/@uvain/components/pastel-testimonial-section) (26878) | ★☆☆ | Staggered offset idea; "one quote always open" for mobile | Our notes are screenshots, not avatar cards |
| **Footer** | [Large Name Footer](https://21st.dev/@arihantcodes_1f7b8c4d/components/large-name-footer) (872) | ★★★ | Oversized brand wordmark footer | Real logo asset, cropped, scrub rise |
| **FAQ** | shadcn/Radix Accordion directly | ★★★ | Accessible behaviour | Full restyle — no 21st component needed |

### 9.2 Reviewed and rejected

| Candidate | Why not |
|---|---|
| LumaBar, Floating Nav, Bottom Menu (glass pill / icon nav) | Futuristic/glass mood; wrong brand; icon-only nav hurts clarity |
| Navbar Menu (hover mega-menu), Rich Navigation Menu | SaaS-style dropdowns; we have ≤ 5 nav items |
| Product Reveal Card (ratings, discount badges), Product Card (tilt + glow) | Conversion-widget aesthetic; ratings/discounts would be fabricated; tilt is gimmicky |
| Pixelated Image Reveal, Shave Reveal Hero | Novelty effects; off-brand |
| Circular Split Roll, 3D Parallax Unfurling Gallery | Over-choreographed; heavy on low-end phones |
| Text Blur Reveal | Animating blur is costly on mid-range Android |
| Particle Wordmark | Iframe/particles; performance + a11y risk |

---

## 10. GSAP architecture

### 10.1 Stack (proposed — confirm in §14)

| Layer | Choice | Note |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | SSG/ISR product pages for SEO; `next/font`, `next/image` (AVIF/WebP). No stack was detectable — project is empty — so this is a recommendation. 21st.dev patterns assume React + Tailwind |
| Styling | Tailwind + CSS variables (§2–4 tokens) | Tokens in `:root`, not raw hex in components |
| A11y primitives | Radix via shadcn (Dialog/Sheet, Accordion) | Restyled |
| Icons | Lucide | 1.25–1.5 px stroke |
| Animation | `gsap` **≥ 3.13** + `@gsap/react` | |
| GSAP plugins | `ScrollTrigger`, `SplitText`, `Flip`, `CustomEase` (opt: `Observer`, `ScrollToPlugin`, `Draggable`) | Since 3.13 **all plugins are free**, including SplitText, for commercial use ([release notes](https://gsap.com/blog/3-13/)). Draggable deferred |
| Smooth scroll | **None** by default | §7.11 |
| Data | Typed local JSON/MDX for launch; CMS later | ~15–40 SKUs doesn't need a backend |

### 10.2 File layout

```
src/
  lib/gsap/
    register.ts      # registerPlugin once (client only), ScrollTrigger.config, CustomEase
    tokens.ts        # dur, ease, stagger, dist  (mirror of §7.1)
    media.ts         # matchMedia condition strings: FULL, LIGHT, REDUCE, FINE, COARSE
    refresh.ts       # central ScrollTrigger.refresh policy
  hooks/
    useSectionMotion.ts   # useGSAP + gsap.matchMedia + scope + cleanup wrapper
  animations/
    primitives/      # revealLines, revealMask, parallax, magnetic, quickFollow, marquee
    sections/        # hero, statement, dropHorizontal, closer, velvet,
                     # packStory, catalogue, notes, filmStrip, footer
  components/motion/
    PageTransition.tsx   ScrollProgressRing.tsx   CursorLabel.tsx   LampGlow.tsx
```

### 10.3 Contracts (illustrative — not implemented)

```ts
// lib/gsap/register.ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

let ready = false;
export function registerGsap() {
  if (ready || typeof window === "undefined") return gsap;
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip, CustomEase);
  ScrollTrigger.config({ ignoreMobileResize: true });
  CustomEase.create("sanovia-out", "0.16,1,0.3,1");
  CustomEase.create("sanovia-inout", "0.76,0,0.24,1");
  ready = true;
  return gsap;
}
```

```ts
// animations/sections/<section>.ts — every section follows this shape
export function initSection(scope: HTMLElement, mm: gsap.MatchMedia) {
  mm.add(
    {
      full:   "(min-width:1024px) and (prefers-reduced-motion:no-preference)",
      light:  "(max-width:1023px) and (prefers-reduced-motion:no-preference)",
      reduce: "(prefers-reduced-motion:reduce)",
    },
    (ctx) => {
      const { full, light, reduce } = ctx.conditions as Record<string, boolean>;
      if (reduce) return;            // content already visible
      /* build timelines / ScrollTriggers scoped to `scope` */
      return () => {/* optional teardown (SplitText.revert etc.) */};
    }
  );
}
```

### 10.4 Rules

1. **Scope + cleanup:** all animation lives inside `useGSAP(..., { scope })`; `matchMedia` contexts revert automatically; SplitText instances are `revert()`ed on cleanup.
2. **All ScrollTriggers created inside a `matchMedia` branch** so breakpoint/reduced-motion changes rebuild cleanly.
3. **No-flash progressive enhancement:** elements are visible by default. A tiny inline script adds `html.motion-ok` before first paint *only* if JS is on and reduced-motion is off; CSS under `.motion-ok [data-reveal]` sets initial hidden states. No-JS/crawlers/reduced-motion see final content. (Matches the skill's warning: *don't hide SEO-relevant content by default without a fallback*.)
4. **Only transform / opacity / clip-path.** `will-change` applied during animation, removed after.
5. **Refresh policy (`refresh.ts`):** call `ScrollTrigger.refresh()` once after `document.fonts.ready`, once after above-fold images decode, and debounced on `resize`/orientation and on route enter. All media has reserved aspect ratio so refresh rarely moves anything.
6. **Sticky-first** for S3/S6; `pin: true` only if sticky proves insufficient in testing. `invalidateOnRefresh: true`, function-based `end` for measured distances.
7. **Batching:** grids use `ScrollTrigger.batch`; ≤ ~8 staggered children per group (skill guidance).
8. **`markers` off** outside dev. No `ScrollTrigger.normalizeScroll` unless iOS in-app jitter is *observed* in testing.
9. **Route changes:** `PageTransition` owns exit/enter timelines and calls a shared `killRouteTriggers()` then `refresh()`.

### 10.5 Pattern map (skill presets → Sanovia use)

| `ui-ux-pro-max` GSAP preset (tier) | Where used |
|---|---|
| Scroll Reveal – scrub + pin (Complex) | S6 (sticky variant) |
| Parallax Scroll (Subtle / Standard) | S1, S4, S5 |
| Scroll Reveal – enter (Subtle/Standard) | Cards, captions, S7 batch |
| Stagger List – SplitText (Complex) | Headlines (S1, S5, S10) — headline-length only, reverted on cleanup |
| Page Transition – Flip (Complex) | §7.9 v2 stretch; v1 uses curtain |

---

## 11. Asset usage strategy

**Bottom line: none of the pixels in the screenshot are production assets.** They are ~245 px thumbnails with Instagram overlays. Everything below is *how each observed image informs direction*, plus **what originals are needed**. Do not duplicate: one master original per shot, exported to the sizes below.

### 11.1 Categorisation

| Ref | Observed asset | Category | Informs / becomes | Status |
|---|---|---|---|---|
| L | Logo disc | **Brand mark** | Nav, favicon, intro, cursor label, footer, `og:image` | Need **vector/PNG, transparent, light + dark versions** |
| T5 | Hand + burgundy-dial watch, serif-italic overlay | **Hero / editorial** | **Hero image (S1)** and "Closer" (S4) direction; the overlay line is on-voice | Need original still, portrait 4:5, in focus, dial detail |
| T6 | Velvet bust + necklaces on plum | **Hero / editorial** | **S5 On Velvet** + establishes plum accent and styled still-life register | Need 4–5 stills in this register |
| H3 | Gold watch in navy box | **Editorial / product** | "Drop 01" identity; gift-box framing | Need original |
| T4 | Watch group on white plinth | **Product presentation** | Catalogue/range shots (S3, S7); diagonal arrangement, negative space | Need per-SKU cutouts + 1 group shot |
| H4 | Collection 01 necklace collage w/ numbers | **Product / interaction reference** | Numbered-collection system; "which do you like?" idea | Reference; recompose |
| T1 | Kraft box, black round sticker, hand | **Lifestyle / process** | **S6 step 3** (sticker seal); confirms circle-mark packaging | Need cleaner packing sequence |
| T2, H2 | Poly-mailers on wood | **Lifestyle / process** | S6 step 4 (mailed); authenticity | Need cleaner still; keep the wood/warm grade |
| T3 | Ring-light + lamp glow | **Mood reference only** | **The lamp-glow motif** (§1.2) — atmosphere, not content | Reference only; not used as an image |
| H1 | Review chat screenshots | **Social proof source** | S8 Notes | Need **customer consent**; redact names/numbers |
| — | Instagram UI (blue Follow, tabs, status bar, reel glyphs, highlight rings) | **Reference only — exclude** | Nothing | Never reused |
| — | Chunky gold script overlay (T1) | **Reference only — exclude** | Nothing (IG editor font) | Never reused |

### 11.2 Shot list to request from the client (Phase 2 dependency)

1. **Logo:** vector/PNG, light + dark, and the black sticker version.
2. **Hero:** 3 portrait stills of hand + watch (register B), warm grade, plain espresso/plum/wood background.
3. **Per SKU:** front (dial), 3/4 angle, side/clasp, on-wrist/hand, in-box — cutout on plinth (register C), consistent light direction.
4. **Macro:** 1–2 dial/texture closeups (S4).
5. **Jewellery styled stills:** 4–5 on velvet/bust with props (register A).
6. **Packing sequence:** 5–6 frames — tissue → box → sticker → mailer (register D, tidied).
7. **Video (optional):** reels as mp4; 5–8 s muted loops.
8. **Data sheet:** name, category, price + currency, colours/sizes, stock, description, dimensions, care.
9. **Policy copy:** shipping, returns, COD/payment, delivery times.
10. **Review screenshots** with written consent.

### 11.3 Export & delivery spec

| Use | Ratio | Export | Notes |
|---|---|---|---|
| Hero arch | 3:4 | 1600 w (AVIF + WebP + JPEG fallback), ≤ 200 KB LCP | `fetchpriority=high`, preload |
| Product card | 4:5 | 800 / 1200 w | Blur-up in `walnut-600` |
| Grid feature | 1:1 or 3:4 | 1200 w | |
| Cinematic / macro | 16:9 crop **from** portrait master is *not* viable — shoot a landscape variant | 2400 w | Only if S4 is kept |
| Video loop | 4:5 or 9:16 | H.264 MP4 ≤ 1.5 MB, ≤ 720p, muted | Poster frame required |
| Logo | — | SVG | |

Naming: `drop01-tonneau-burgundy-front.avif` (`{drop}-{product}-{variant}-{view}`). Originals stay in `reference/originals/`; optimised output in `public/media/`.

### 11.4 Placeholder policy (Phase 2 decision)

Until originals arrive: **tonal placeholder blocks** (walnut/plum/cream) in the correct aspect ratio *and correct shape mask*, labelled with the shot needed. Stock photography would misrepresent the products and is not recommended. (An Unsplash MCP is available if you *do* want stock for mood-only, clearly non-product slots.)

---

## 12. Accessibility requirements

Target: **WCAG 2.2 AA**, verified — not assumed.

### 12.1 Perceivable
- **Contrast:** all text ≥ 4.5:1 (3:1 for ≥ 24 px / 18.66 px bold); UI boundaries and focus indicators ≥ 3:1. Use the table in §2.2 — **gold text on light surfaces uses `brass-700`, never logo-gold.**
- **Text on imagery** always on a scrim tested against the *lightest* underlying pixels.
- **Alt text:** every product image has descriptive alt (colour, shape, view); decorative textures/ghost numerals `alt=""`/`aria-hidden`. Review screenshots need transcribed text.
- **Reflow:** usable at 320 px width and 400 % zoom with no two-dimensional page scroll (carousels excepted, with controls).
- **Text spacing:** layout survives 1.5 line-height / 0.12em letter-spacing overrides.
- **Colour is never the only signal** (sold-out, selected variant, errors).

### 12.2 Operable
- **Keyboard:** every control reachable and operable; logical order; no traps. The S3 horizontal track has Prev/Next buttons and syncs on focus; the mobile menu traps focus and returns it on close.
- **Focus visible:** 2 px ring, `champagne-300` on dark / `espresso-700` on light, 2 px offset; never removed.
- **Focus not obscured (2.4.11):** `scroll-padding-top` + `scroll-margin` so sticky nav / bottom order bar never cover the focused element.
- **Skip link** to main content; landmarks (`header`, `nav`, `main`, `footer`); one `h1` per page, ordered headings.
- **Target size:** ≥ **44 × 44 px** for touch controls (exceeds WCAG 2.5.8's 24 px minimum), 8 px minimum spacing.
- **Pause/stop/hide (2.2.2):** any auto-moving content > 5 s (marquee, loops) pauses on hover/focus and has a visible pause control; video is muted by default, no autoplay with sound.
- **No motion-only or hover-only affordances;** gestures (swipe) have button equivalents.

### 12.3 Understandable
- Forms: **visible label above each field**, helper text, error message adjacent with icon + text, `aria-describedby`, `autocomplete` tokens, `inputmode` on phone. Drop-List signup states consent plainly.
- Predictable navigation; consistent nav across pages; page transitions never move focus unexpectedly — after route change focus goes to `h1`/main and the change is announced.
- Plain-language microcopy; currency and units explicit.

### 12.4 Robust
- Semantic HTML first; ARIA only to fill gaps. Radix components for dialog/accordion. Order-list count and toasts use `aria-live="polite"`.
- SplitText output keeps an accessible name (verify at implementation); revert on unmount.
- Pinned/sticky storytelling content must **exist in DOM order and be readable without the scroll effect**.
- **Reduced motion honoured** (§7.10) and tested with OS setting and DevTools emulation.
- External links (WhatsApp, Instagram) state they open externally.

### 12.5 Verification checklist (Phase 2 exit criteria)
axe / Lighthouse a11y pass · full keyboard walkthrough · VoiceOver (iOS) + TalkBack (Android) spot-check · reduced-motion emulation · 200 % / 400 % zoom · 320 px reflow · contrast of every token pair re-measured against **real** brand colours · in-app Instagram browser check.

---

## 13. Performance budgets (targets to validate in Phase 2)

| Metric | Target |
|---|---|
| LCP (Slow 4G, mid-range Android) | ≤ 2.5 s — hero image ≤ 200 KB, preloaded |
| CLS | < 0.1 — every media element has reserved aspect ratio |
| INP | < 200 ms |
| Animation | 60 fps scroll on a low-tier phone; no long tasks > 50 ms from GSAP setup; split-text nodes ≤ ~400/page |
| Images | AVIF/WebP, responsive `srcset`, lazy below fold; blur-up placeholders |
| Fonts | 2 families, variable files, `next/font` self-hosted, `display: swap` with metric-matched fallbacks |
| JS | GSAP core + ScrollTrigger on first load; SplitText/Flip **dynamically imported** by the sections that need them |
| Video | Lazy, poster, ≤ ~1.5 MB per loop, none autoplaying above the fold |

Figures for bundle sizes are intentionally not asserted here — measure in Phase 2.

---

## 14. Open decisions (need your answer before Phase 2)

| # | Decision | Recommendation |
|---|---|---|
| 1 | **Commerce model** — (A) *Order list → prefilled WhatsApp message* vs (B) full cart + checkout + payments | **A** for launch; matches "Shop via Catalog / DM". B is separate scope (payment gateway, order management). |
| 2 | **Stack** — Next.js App Router + TS + Tailwind + GSAP | Confirm. (Nothing in the project constrains it.) |
| 3 | **Photography** — will you supply originals per §11.2? Placeholder policy — tonal blocks vs stock for mood slots | Tonal placeholders; supply originals |
| 4 | **Catalogue facts** — categories, count, currency (PKR?), whether prices are shown, variants | Needed to design S3/S7/PDP filters |
| 5 | **Dark-led vs light-led** — espresso-led with an ivory interlude (proposed) vs ivory-led with espresso accents | Dark-led (matches logo + lamp concept) |
| 6 | **Smooth-scroll library** on desktop | Off by default |
| 7 | **Language** — English only, or English + Urdu (RTL)? | English-only for v1 unless you say otherwise; Urdu changes type and layout scope |
| 8 | **Founder/story** — is "By @sania.living_" a named founder to feature in `/story`? Photo? | Optional short founder note |
| 9 | **Reviews** — consent to reuse customer screenshots? | Only with written consent; otherwise hide S8 |
| 10 | **Brand-name styling** — "SANOVIA Essentials" (profile) vs "SANOVIA ESSENTIALS" (logo) | Wordmark from logo file; "Sanovia Essentials" in running text |
| 11 | **Sections that depend on assets** you may not have: S4 (macro), S6 (packing stills), S9 (video) | Each has a defined fallback/cut (§6.2) |

Risks: (i) design is grounded in one low-res screenshot — colours and shapes must be re-verified against originals; (ii) portrait-only imagery constrains landscape layouts; (iii) heavy motion on low-end phones inside an in-app browser — mitigated by §7.10, §8.3, §13; (iv) any invented copy, review, or press mention would damage trust — placeholders will be visibly marked.

---

## Appendix A — How the `ui-ux-pro-max` outputs were used (traceability)

| Query | Result | Decision |
|---|---|---|
| `--design-system` "luxury jewellery watches e-commerce editorial minimal" (dials 7/8/3) | Pattern **"Feature-Rich Showcase"**; style **"Liquid Glass"**; palette Primary `#1C1917`, Accent `#A16207`; type **Cormorant / Montserrat**; motion **Page Transition (Flip, expo.inOut)** | **Pattern rejected** (a generic feature-grid template — the very thing the brief says to avoid). **Style rejected** (Apple-platform chrome). Palette used only as a sanity check on "dark + gold". Type adopted with Jost swap. Page-transition preset adopted as v2 stretch |
| `--domain style` "editorial minimalism luxury dark warm cinematic" | 1 result: "Minimalism & Swiss Style" (black/white, sans, 0 radius, no shadows) | Partially useful: grid discipline, hairlines, no shadows. Its monochrome/sans direction does **not** fit the warm serif brand |
| `--domain landing` "jewelry luxury product storytelling hero" | **0 results** | **No database match.** Section architecture in §6 is original reasoning grounded in the reference, not a DB pattern |
| `--domain typography` | Cormorant/Montserrat, Bodoni Moda/Jost, Playfair/Inter, others | Cormorant + Jost |
| `--domain color` | "E-commerce Luxury" `#1C1917/#A16207/#FAFAF9` | Sanity check only |
| `--domain gsap` | Scroll-reveal scrub+pin, parallax, stagger SplitText presets, with Do/Don't (≤ 1–2 pins; don't parallax body copy; ≤ ~8 staggered children; headline-only SplitText; revert on cleanup) | Adopted as guardrails (§7, §10) |
| `--domain ux` | Touch spacing ≥ 8 px, target-size guidance, tap delay, overscroll | Adopted (§5, §12) |
| `--stack nextjs` | App Router, file routing, `next/font`, variable fonts | Adopted as proposal (§10.1) |

## Appendix B — Sources

- [GSAP 3.13 release — all plugins free](https://gsap.com/blog/3-13/) · [CSS-Tricks summary](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/) · [Webflow announcement](https://webflow.com/blog/gsap-becomes-free)
- 21st.dev catalogue via MCP (metadata search; linked components above)
- WCAG contrast ratios computed locally with the standard relative-luminance formula

---

**Phase 1 is complete when this blueprint is approved. Phase 2 will not start until you say so.**

---

## Phase 2 amendments (2026-09-22)

Phase 1 was approved as written. Phase 2 made these implementation changes — full table and rationale in
[`docs/ARCHITECTURE.md` §6](docs/ARCHITECTURE.md):

- **Stack:** React + **Vite** (as directed) instead of Next.js; **plain CSS tokens** instead of Tailwind; **JavaScript**
  + JSDoc instead of TypeScript; in-repo Dialog/Accordion/icons instead of Radix/Lucide; built-in GSAP eases instead
  of CustomEase; CSS marquee; Fontsource fonts. (Supersedes §10.1–10.2 where they conflict.)
- **Consequence of Vite (new open decision):** per-product link previews (Open Graph for Instagram/WhatsApp) need
  pre-rendered HTML — prerender at build time or serve product pages via an edge function.
- **21st.dev:** two components were retrieved (free tier: 2/day) — *Immersive Full Screen Navigation* and *Product
  Card*. Patterns adopted (letter-roll links, focus-trap contract, clip-path wipe, compound card API, stretched link);
  code re-implemented in Sanovia's system. No 21st.dev dependency or component code ships.
- **Blueprint §9 "Text Reveal Block" etc.** remain reference patterns; the GSAP reveal primitives are our own.
