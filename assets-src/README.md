# assets-src — master originals (NOT shipped)

Untouched, full-resolution originals live here. **Nothing in this folder is bundled or deployed**
(it is git-ignored except this README). Optimised exports go to `src/assets/` — see
[`src/assets/README.md`](../src/assets/README.md) for the naming/format contract.

```
assets-src/originals/
  logo/        Brand mark — vector (SVG/AI/PDF) or transparent PNG. Light AND dark versions,
               the disc alone, the wordmark alone, and the black round packing-sticker version.
  hero/        Hero stills (portrait 4:5 or 3:4, hand + watch, warm grade) and the hero video master.
  products/    One folder per SKU. Per SKU: front (dial), ¾ angle, side/clasp, on-wrist/hand, in-box.
  editorial/   Velvet/bust jewellery stills, dial macro, lifestyle (wood table, lamp glow).
  packing/     5–6 frames: tissue → box → round sticker → mailer.
  video/       Source reels / loops (mp4/mov).
```

## What we still need from the client (blocks a launch-ready site)

1. **Logo files** (see above). The header/footer/favicon currently use a placeholder.
2. **Real hero footage.** A placeholder is in place (`src/assets/video/hero/hero.mp4`) so the hero's
   motion and layout could be built and verified against an actual video — but it was encoded from a
   300-frame JPEG export the client supplied, not a camera original, and it visibly shows a
   third-party **"SHARLY"-branded** watch. It must not ship as-is.
3. **Product data sheet:** name, category, price + currency, colours/straps/sizes, stock, description,
   dimensions, care. Plus which categories exist beyond watches/jewellery.
4. **Photography** per the shot list in `DESIGN-BLUEPRINT.md` §11.2.
5. **Policy copy:** shipping, returns, payment/COD, delivery times. Nothing is invented in the UI.
6. **Review screenshots** with written consent to reuse (names/numbers redacted).
7. **WhatsApp number** confirmation and whether `wa.me/c/…` catalogue stays in use.

## Optimisation pipeline (to add when originals arrive)

Deliberately **not installed yet** — it needs `sharp` (a native dependency) and there is nothing to
process. When photography lands, add `scripts/optimize-images.mjs` to turn each original into the
`<name>-<width>.{avif,webp,jpg}` set. Until then, exports can be produced in any editor following the
spec table in `src/assets/README.md`.
