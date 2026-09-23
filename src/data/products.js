/**
 * Product catalogue — the raw data source. Phase 5 shipped this empty (`products = []`)
 * because the client hadn't supplied real pieces yet; Phase 7 populates it with a realistic,
 * professionally-written DEMO catalogue so every product surface on the site (Featured
 * Collection, Signature Watches, Jewellery Editorial, Best Sellers, New Arrivals, Shop,
 * Search, PDP, related products) has real content to render and verify against, while the
 * architecture stays exactly ready to swap this for real client data — or a real backend —
 * without touching a single UI file. See `services/productRepository.js` for the query layer
 * that sits between this file and every component (`docs/ARCHITECTURE.md` §12 documents the
 * full admin/backend seam). Dev-only UI fixtures still live in `./placeholders.js` and never ship.
 *
 * These are DEMO products for a not-yet-launched brand, not real inventory: prices, SKUs,
 * stock counts and reviews are illustrative, written to be internally consistent (a rating's
 * count always matches the number of real review entries provided — nothing here claims more
 * social proof than it shows) and in the brand's established voice, not filler text.
 *
 * @typedef {'arch'|'oval'|'tonneau'|'circle'|'rect'|'pill'} Shape
 * @typedef {'in-stock'|'made-to-order'|'low-stock'|'out-of-stock'|'coming-soon'} Availability
 *
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} author
 * @property {number} rating     1–5.
 * @property {string} date       ISO date.
 * @property {string} body
 *
 * @typedef {Object} ProductImages
 * @property {string}   primary   Registry id (utils/media.js) — the card/gallery-first image.
 * @property {string}   [hover]   Swapped in on hover (fine pointer only).
 * @property {string[]} [gallery] PDP gallery order; falls back to [primary, hover].
 *
 * @typedef {Object} Product
 * @property {string}  id                 Stable identifier, independent of `slug` (a slug can
 *                                         change if a product is renamed; a future database's
 *                                         primary key shouldn't). Not used for routing — see `slug`.
 * @property {string}  slug               URL-safe id (`/product/:slug`), also the image folder name.
 * @property {string}  name
 * @property {'watches'|'jewellery'} category
 * @property {string}  [subcategory]      Finer classification (e.g. "Necklaces", "Steel bracelet")
 *                                        — metadata for a future filter/admin view; the current
 *                                        Shop page filters by `category` only, not this.
 * @property {string}  [drop]             e.g. "01" — powers the Featured Collection spotlight.
 * @property {number|null} [price]        Whole currency units, in `site.currency` (data/site.js —
 *                                        one centralized config, never mixed per-product). `null`
 *                                        → "Message for price".
 * @property {number|null} [compareAtPrice] Struck-through "was" price, shown only when it's
 *                                        greater than `price` (Price.jsx) — a real discount signal,
 *                                        never decorative.
 * @property {string}  [sku]              Stock-keeping code, shown on the PDP.
 * @property {number}  [stock]            Unit count — admin/back-office data; the storefront shows
 *                                        the qualitative `availability` badge, never a raw number
 *                                        (a considered choice already documented for this brand).
 * @property {string}  [tag]              Card/PDP badge text, e.g. "Limited", "Signature".
 * @property {boolean} [featured]         Marks a flagship piece — a future "Featured" admin flag;
 *                                        the current Featured Collection section spotlights by
 *                                        `drop` (unchanged design), this is the broader signal.
 * @property {boolean} [bestseller]       Powers Best Sellers (`getBestsellers`) — set by a person
 *                                        from real demand, exactly like `isNew` below; never inferred.
 * @property {boolean} [isNew]            Powers "New Arrivals" — set, never inferred from a date.
 * @property {Availability} [availability]  Default (omitted) reads as in stock / orderable.
 * @property {Shape}   [shape]            Mask used in cards (default "arch").
 * @property {ProductImages} images       Image ids, see utils/media.js.
 * @property {string}  [thumbnail]        Compact-list/admin-table image id; defaults to
 *                                        `images.primary` when omitted (ProductCard etc. use
 *                                        `images.primary` directly — this is for a future admin
 *                                        product table, not the current storefront UI).
 * @property {string[]} [variants]        Strap / colour names, only if real.
 * @property {string}  [shortDescription] One line — meta description / future card tooltip.
 * @property {string}  [description]      Long-form copy for the PDP. Short cards don't use it.
 * @property {Object.<string,string>} [specifications]  Ordered key → value pairs, PDP "Details".
 * @property {{average:number, count:number}|null} [rating]  Omitted/null → "No reviews yet" (never
 *   invented). When set, `count` always equals `reviews.length` — this catalogue never claims a
 *   rating count it doesn't back with real review entries.
 * @property {Review[]} [reviews]         Real, consented reviews only. Empty until supplied.
 * @property {string}  [createdAt]        ISO date — admin sort/"recently added", not shown in UI yet.
 * @property {string}  [updatedAt]        ISO date — admin "last edited", not shown in UI yet.
 * @property {boolean} [placeholder]      True for dev fixtures (./placeholders.js only).
 */

/** @type {Product[]} */
export const products = [
  // ---------------------------------------------------------------------------------------
  // WATCHES
  // ---------------------------------------------------------------------------------------
  {
    id: 'SE-0001',
    slug: 'tonneau-signature-watch',
    name: 'Tonneau Signature Watch',
    category: 'watches',
    subcategory: 'Two-tone bracelet',
    drop: '01',
    price: 9800,
    compareAtPrice: 11500,
    sku: 'SV-WA-TNU-001',
    stock: 14,
    tag: 'Signature',
    featured: true,
    bestseller: true,
    shape: 'tonneau',
    images: {
      primary: 'products/tonneau-signature-watch/front',
      hover: 'products/tonneau-signature-watch/wrist',
      gallery: [
        'products/tonneau-signature-watch/front',
        'products/tonneau-signature-watch/wrist',
        'products/tonneau-signature-watch/detail',
        'products/tonneau-signature-watch/clasp',
      ],
    },
    variants: ['Two-tone (steel/rose gold)', 'Full steel'],
    shortDescription: 'A two-tone tonneau watch with a pavé bezel — the piece the rest of the case takes its cues from.',
    description:
      "The case this brand was built around. A tonneau shape in brushed steel and rose-gold PVD, a bezel set edge-to-edge in cubic zirconia, and a champagne sunburst dial that shifts with the light instead of sitting flat under it. Small enough to layer under a cuff, considered enough to wear alone.",
    specifications: {
      Movement: 'Japanese quartz',
      Case: 'Stainless steel, rose-gold PVD plating',
      'Case size': '32mm × 38mm',
      Bezel: 'Cubic zirconia pavé, hand-set',
      'Water resistance': '3 ATM — splash and rain resistant, not for swimming',
      Strap: 'Two-tone steel bracelet, butterfly clasp, 3 links removable',
    },
    rating: { average: 4.7, count: 3 },
    reviews: [
      {
        id: 'r-tsw-1',
        author: 'Ayesha R.',
        rating: 5,
        date: '2026-07-14',
        body: "Wore this every day for a month before I even thought to photograph it — that's how I knew it was a keeper. The rose gold hasn't dulled and it still catches light exactly like it did on day one.",
      },
      {
        id: 'r-tsw-2',
        author: 'Bilal K.',
        rating: 5,
        date: '2026-06-02',
        body: "Ordered on WhatsApp, had it in two days. The case is smaller than most men's watches but it doesn't read as small — reads as considered. Gets asked about constantly.",
      },
      {
        id: 'r-tsw-3',
        author: 'Sana M.',
        rating: 4,
        date: '2026-08-01',
        body: 'Beautiful piece and the bezel really does catch light the way a set bezel should. Only wish the box it arrived in was a touch sturdier for gifting.',
      },
    ],
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'SE-0002',
    slug: 'oval-steel-watch',
    name: 'Oval Steel Watch',
    category: 'watches',
    subcategory: 'Steel bracelet',
    drop: '01',
    price: 6200,
    sku: 'SV-WA-OVL-002',
    stock: 22,
    isNew: true,
    shape: 'oval',
    images: {
      primary: 'products/oval-steel-watch/front',
      hover: 'products/oval-steel-watch/wrist',
      gallery: ['products/oval-steel-watch/front', 'products/oval-steel-watch/wrist', 'products/oval-steel-watch/detail'],
    },
    shortDescription: 'A polished steel oval case with an ivory sunburst dial — the quiet everyday option.',
    description:
      'An elongated oval case in polished steel, sized to sit close to the wrist rather than sit on top of it. The ivory dial is unmarked past the hour points — no logo crowding the face, nothing to date it.',
    specifications: {
      Movement: 'Japanese quartz',
      Case: 'Stainless steel, polished',
      'Case size': '30mm × 24mm',
      'Water resistance': '3 ATM — splash and rain resistant, not for swimming',
      Strap: 'Stainless steel mesh bracelet, magnetic clasp',
    },
    rating: null,
    reviews: [],
    createdAt: '2026-04-10T00:00:00Z',
    updatedAt: '2026-04-10T00:00:00Z',
  },
  {
    id: 'SE-0003',
    slug: 'rectangular-noir-watch',
    name: 'Rectangular Noir Watch',
    category: 'watches',
    subcategory: 'Leather strap',
    price: 5900,
    sku: 'SV-WA-RCT-003',
    stock: 4,
    tag: 'Limited',
    availability: 'low-stock',
    shape: 'rect',
    images: {
      primary: 'products/rectangular-noir-watch/front',
      hover: 'products/rectangular-noir-watch/wrist',
      gallery: ['products/rectangular-noir-watch/front', 'products/rectangular-noir-watch/wrist'],
    },
    variants: ['Black leather', 'Espresso leather'],
    shortDescription: 'A matte black rectangular case with a numeral-free dial — small run, not restocked.',
    description:
      'A rectangular case finished matte black, worn close and low-profile under a cuff. The dial drops numerals entirely — just applied hour markers and two thin hands. A small production run; once this batch is gone, it is gone.',
    specifications: {
      Movement: 'Japanese quartz',
      Case: 'Matte black stainless steel',
      'Case size': '28mm × 34mm',
      'Water resistance': '3 ATM — splash and rain resistant, not for swimming',
      Strap: 'Genuine leather, stitched keeper loop',
    },
    rating: null,
    reviews: [],
    createdAt: '2026-05-02T00:00:00Z',
    updatedAt: '2026-08-14T00:00:00Z',
  },
  {
    id: 'SE-0004',
    slug: 'circle-rose-gold-watch',
    name: 'Circle Rose Gold Watch',
    category: 'watches',
    subcategory: 'Mesh strap',
    price: 6800,
    sku: 'SV-WA-CIR-004',
    stock: 19,
    featured: true,
    bestseller: true,
    isNew: true,
    shape: 'circle',
    images: {
      primary: 'products/circle-rose-gold-watch/front',
      hover: 'products/circle-rose-gold-watch/wrist',
      gallery: ['products/circle-rose-gold-watch/front', 'products/circle-rose-gold-watch/wrist', 'products/circle-rose-gold-watch/detail'],
    },
    shortDescription: 'A small round case in rose-gold-tone with a self-adjusting mesh strap.',
    description:
      'A round case, deliberately small-faced, in rose-gold PVD over steel. The mesh strap adjusts with a magnetic clasp instead of pin holes, so it sits exactly at your wrist size — no link removal, no gap.',
    specifications: {
      Movement: 'Japanese quartz',
      Case: 'Stainless steel, rose-gold PVD plating',
      'Case size': '28mm',
      'Water resistance': '3 ATM — splash and rain resistant, not for swimming',
      Strap: 'Rose-gold-tone mesh bracelet, magnetic clasp',
    },
    rating: { average: 4.5, count: 2 },
    reviews: [
      {
        id: 'r-crg-1',
        author: 'Fatima S.',
        rating: 5,
        date: '2026-08-22',
        body: "Small face, exactly what I wanted after years of oversized watches. The mesh strap's magnetic clasp fits first try — no extra links to remove.",
      },
      {
        id: 'r-crg-2',
        author: 'Omar H.',
        rating: 4,
        date: '2026-06-30',
        body: 'Good everyday watch, understated. The mesh picks up fingerprints a bit more than I expected but a quick wipe sorts it.',
      },
    ],
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'SE-0005',
    slug: 'oval-champagne-watch',
    name: 'Oval Champagne Watch',
    category: 'watches',
    subcategory: 'Leather strap',
    price: 5500,
    sku: 'SV-WA-OVL-005',
    stock: 0,
    availability: 'made-to-order',
    shape: 'oval',
    images: {
      primary: 'products/oval-champagne-watch/front',
      gallery: ['products/oval-champagne-watch/front', 'products/oval-champagne-watch/wrist'],
    },
    shortDescription: 'A champagne-gold dial on tan leather — made to order, not held in stock.',
    description:
      'An oval case with a champagne gold dial, on a tan leather strap that darkens gently with wear rather than staying stiff. Each one is cased and strapped to order — expect a short wait, never a rushed one.',
    specifications: {
      Movement: 'Japanese quartz',
      Case: 'Stainless steel, gold-tone PVD plating',
      'Case size': '30mm × 24mm',
      'Water resistance': '3 ATM — splash and rain resistant, not for swimming',
      Strap: 'Genuine leather, tan',
    },
    rating: null,
    reviews: [],
    createdAt: '2026-04-20T00:00:00Z',
    updatedAt: '2026-04-20T00:00:00Z',
  },
  {
    id: 'SE-0006',
    slug: 'rect-ivory-watch',
    name: 'Rect Ivory Watch',
    category: 'watches',
    subcategory: 'Steel bracelet',
    price: 6400,
    compareAtPrice: 7200,
    sku: 'SV-WA-RCT-006',
    stock: 11,
    shape: 'rect',
    images: {
      primary: 'products/rect-ivory-watch/front',
      hover: 'products/rect-ivory-watch/wrist',
      gallery: ['products/rect-ivory-watch/front', 'products/rect-ivory-watch/wrist'],
    },
    shortDescription: 'A rectangular steel case with an ivory dial — the brand\'s most-gifted men\'s piece.',
    description:
      'A rectangular case in polished steel with an ivory dial and a fine steel bracelet. Reads formal enough for a shirt cuff, plain enough for every day in between.',
    specifications: {
      Movement: 'Japanese quartz',
      Case: 'Stainless steel, polished',
      'Case size': '28mm × 34mm',
      'Water resistance': '3 ATM — splash and rain resistant, not for swimming',
      Strap: 'Stainless steel bracelet, 2 links removable',
    },
    rating: null,
    reviews: [],
    createdAt: '2026-03-18T00:00:00Z',
    updatedAt: '2026-07-05T00:00:00Z',
  },
  {
    id: 'SE-0007',
    slug: 'circle-espresso-watch',
    name: 'Circle Espresso Watch',
    category: 'watches',
    subcategory: 'Leather strap',
    price: 5200,
    sku: 'SV-WA-CIR-007',
    stock: 0,
    availability: 'coming-soon',
    shape: 'circle',
    images: { primary: 'products/circle-espresso-watch/front', gallery: ['products/circle-espresso-watch/front'] },
    shortDescription: 'A round case with a deep espresso-brown dial, on dark leather — arriving next.',
    description:
      'A round case with a deep espresso-brown dial that reads almost black indoors and warms up in daylight. Dark brown leather strap, tone-matched to the dial rather than left generic black.',
    specifications: {
      Movement: 'Japanese quartz',
      Case: 'Stainless steel, matte finish',
      'Case size': '30mm',
      'Water resistance': '3 ATM — splash and rain resistant, not for swimming',
      Strap: 'Genuine leather, espresso brown',
    },
    rating: null,
    reviews: [],
    createdAt: '2026-08-20T00:00:00Z',
    updatedAt: '2026-08-20T00:00:00Z',
  },
  {
    id: 'SE-0008',
    slug: 'tonneau-midnight-watch',
    name: 'Tonneau Midnight Watch',
    category: 'watches',
    subcategory: 'Steel bracelet',
    price: 8600,
    sku: 'SV-WA-TNU-008',
    stock: 0,
    availability: 'out-of-stock',
    shape: 'tonneau',
    images: {
      primary: 'products/tonneau-midnight-watch/front',
      hover: 'products/tonneau-midnight-watch/wrist',
      gallery: ['products/tonneau-midnight-watch/front', 'products/tonneau-midnight-watch/wrist'],
    },
    shortDescription: 'A midnight-blue tonneau dial in full steel — sold out of this batch, back next drop.',
    description:
      'The Signature case in full steel with a midnight-blue sunburst dial instead of champagne. This first run sold out; message us on WhatsApp to be told first when the next one is cased.',
    specifications: {
      Movement: 'Japanese quartz',
      Case: 'Stainless steel, polished',
      'Case size': '32mm × 38mm',
      'Water resistance': '3 ATM — splash and rain resistant, not for swimming',
      Strap: 'Steel bracelet, butterfly clasp',
    },
    rating: null,
    reviews: [],
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-08-25T00:00:00Z',
  },

  // ---------------------------------------------------------------------------------------
  // JEWELLERY
  // ---------------------------------------------------------------------------------------
  {
    id: 'SE-0101',
    slug: 'layered-chain-necklace',
    name: 'Layered Chain Necklace',
    category: 'jewellery',
    subcategory: 'Necklaces',
    drop: '01',
    price: 3200,
    sku: 'SV-JW-NCK-001',
    stock: 27,
    featured: true,
    bestseller: true,
    shape: 'arch',
    images: {
      primary: 'products/layered-chain-necklace/front',
      hover: 'products/layered-chain-necklace/worn',
      gallery: ['products/layered-chain-necklace/front', 'products/layered-chain-necklace/worn', 'products/layered-chain-necklace/detail'],
    },
    variants: ['Gold-tone', 'Rose gold-tone'],
    shortDescription: 'Two fine curb chains at different lengths, joined at one clasp — layering already done for you.',
    description:
      'A double-layer curb chain, two lengths joined at a single clasp so it sits pre-layered instead of needing two necklaces fussed into place. Fine enough to wear alone, sturdy enough for daily wear without the fear of tangling in a scarf.',
    specifications: {
      Material: 'Brass base, 18k gold-tone plating',
      Plating: '2.5-micron gold vermeil finish',
      'Chain length': '40cm + 45cm layered, 5cm extender',
      Clasp: 'Lobster clasp',
      Care: 'Keep dry; avoid direct perfume contact',
    },
    rating: { average: 5.0, count: 2 },
    reviews: [
      {
        id: 'r-lcn-1',
        author: 'Hira N.',
        rating: 5,
        date: '2026-05-20',
        body: "I layer it under a necklace I already had and it just sits right — doesn't tangle, doesn't need constant adjusting. Exactly the 'wear it and forget it' piece I was after.",
      },
      {
        id: 'r-lcn-2',
        author: 'Zainab A.',
        rating: 5,
        date: '2026-07-09',
        body: 'Bought this as a gift for my sister and ended up ordering one for myself too. The two lengths really do sit at different points on the collarbone, not just one chain doubled over.',
      },
    ],
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'SE-0102',
    slug: 'pearl-drop-pendant',
    name: 'Pearl Drop Pendant',
    category: 'jewellery',
    subcategory: 'Necklaces',
    price: 2800,
    sku: 'SV-JW-NCK-002',
    stock: 16,
    isNew: true,
    shape: 'arch',
    images: {
      primary: 'products/pearl-drop-pendant/front',
      hover: 'products/pearl-drop-pendant/worn',
      gallery: ['products/pearl-drop-pendant/front', 'products/pearl-drop-pendant/worn'],
    },
    shortDescription: 'A single freshwater pearl on a fine gold-tone chain — one clear idea, nothing added to it.',
    description:
      'One freshwater pearl set on a fine gold-tone chain, hung just above the collarbone. No secondary charms, no pavé setting around it — the piece is exactly one idea, done well.',
    specifications: {
      Material: 'Brass base, 18k gold-tone plating; genuine freshwater pearl',
      'Chain length': '42cm, 5cm extender',
      Clasp: 'Spring ring clasp',
      Care: 'Remove before swimming; store flat',
    },
    rating: null,
    reviews: [],
    createdAt: '2026-07-01T00:00:00Z',
    updatedAt: '2026-07-01T00:00:00Z',
  },
  {
    id: 'SE-0103',
    slug: 'signet-ring',
    name: 'Signet Ring',
    category: 'jewellery',
    subcategory: 'Rings',
    price: 2100,
    sku: 'SV-JW-RNG-003',
    stock: 31,
    bestseller: true,
    shape: 'circle',
    images: {
      primary: 'products/signet-ring/front',
      hover: 'products/signet-ring/worn',
      gallery: ['products/signet-ring/front', 'products/signet-ring/worn'],
    },
    variants: ['US 5', 'US 6', 'US 7', 'US 8'],
    shortDescription: 'A classic signet with a blank face — plain now, engravable if you want it later.',
    description:
      'A classic signet silhouette in gold-tone brass, left with a plain polished face rather than a crest — wear it as-is, or take it to an engraver for initials later. Comfort-fit band, sits flush against the next finger over.',
    specifications: {
      Material: 'Brass base, 18k gold-tone plating',
      'Band width': '3mm, comfort-fit interior',
      'Face size': '10mm × 8mm, engravable',
      Care: 'Remove before hand-washing or the gym',
    },
    rating: null,
    reviews: [],
    createdAt: '2026-03-15T00:00:00Z',
    updatedAt: '2026-03-15T00:00:00Z',
  },
  {
    id: 'SE-0104',
    slug: 'cuff-bracelet',
    name: 'Cuff Bracelet',
    category: 'jewellery',
    subcategory: 'Bracelets',
    drop: '01',
    price: 2400,
    sku: 'SV-JW-BRC-004',
    stock: 20,
    shape: 'pill',
    images: {
      primary: 'products/cuff-bracelet/front',
      hover: 'products/cuff-bracelet/worn',
      gallery: ['products/cuff-bracelet/front', 'products/cuff-bracelet/worn'],
    },
    shortDescription: 'A thin open cuff, gold-tone — the piece built to be stacked with two or three others.',
    description:
      'A thin open cuff in gold-tone brass, gently adjustable at the gap so it fits a range of wrists without sizing. Built to be worn two or three at once, stacked with whatever else is already on your wrist.',
    specifications: {
      Material: 'Brass base, 18k gold-tone plating',
      Fit: 'Open cuff, adjustable ±0.5cm',
      Care: 'Avoid perfume and lotion contact; wipe with a soft cloth',
    },
    rating: null,
    reviews: [],
    createdAt: '2026-03-05T00:00:00Z',
    updatedAt: '2026-03-05T00:00:00Z',
  },
  {
    id: 'SE-0105',
    slug: 'crystal-pendant-necklace',
    name: 'Crystal Pendant Necklace',
    category: 'jewellery',
    subcategory: 'Necklaces',
    price: 2600,
    sku: 'SV-JW-NCK-005',
    stock: 0,
    availability: 'coming-soon',
    shape: 'arch',
    images: { primary: 'products/crystal-pendant-necklace/front', gallery: ['products/crystal-pendant-necklace/front'] },
    shortDescription: 'A small faceted crystal on a fine chain — the next necklace in the line.',
    description:
      'A small faceted crystal, bezel-set on a fine gold-tone chain. Catches light without demanding attention — built to be worn daily, not saved for one evening.',
    specifications: {
      Material: 'Brass base, 18k gold-tone plating; cubic zirconia',
      'Chain length': '42cm, 5cm extender',
      Clasp: 'Spring ring clasp',
    },
    rating: null,
    reviews: [],
    createdAt: '2026-08-18T00:00:00Z',
    updatedAt: '2026-08-18T00:00:00Z',
  },
  {
    id: 'SE-0106',
    slug: 'huggie-hoop-earrings',
    name: 'Huggie Hoop Earrings',
    category: 'jewellery',
    subcategory: 'Earrings',
    price: 1900,
    sku: 'SV-JW-ERR-006',
    stock: 34,
    featured: true,
    bestseller: true,
    isNew: true,
    shape: 'circle',
    images: {
      primary: 'products/huggie-hoop-earrings/front',
      hover: 'products/huggie-hoop-earrings/worn',
      gallery: ['products/huggie-hoop-earrings/front', 'products/huggie-hoop-earrings/worn'],
    },
    shortDescription: 'Small gold-tone huggies with a secure hinge clasp — light enough to forget you\'re wearing them.',
    description:
      "Small huggie hoops in gold-tone brass, close enough to the earlobe to sleep in without catching. A hinged snap closure instead of a loose hook, so they stay put through a full day.",
    specifications: {
      Material: 'Brass base, 18k gold-tone plating',
      Diameter: '12mm',
      Closure: 'Hinged snap clasp',
      'For sensitive ears': 'Surgical steel posts',
    },
    rating: { average: 4.7, count: 3 },
    reviews: [
      {
        id: 'r-hhe-1',
        author: 'Mahnoor I.',
        rating: 5,
        date: '2026-07-01',
        body: "Light enough that I forget I'm wearing them by lunchtime, which is exactly what I wanted. Clasp is secure — haven't lost one yet, unlike every other hoop I own.",
      },
      {
        id: 'r-hhe-2',
        author: 'Aiman T.',
        rating: 4,
        date: '2026-08-11',
        body: 'Pretty and well made, lighter than I expected in a good way. Would love a slightly larger size option in future.',
      },
      {
        id: 'r-hhe-3',
        author: 'Noor F.',
        rating: 5,
        date: '2026-07-25',
        body: 'These have basically replaced every other pair of earrings I own for daily wear. Ordered on WhatsApp, arrived well packaged, no issues.',
      },
    ],
    createdAt: '2026-06-15T00:00:00Z',
    updatedAt: '2026-06-15T00:00:00Z',
  },
  {
    id: 'SE-0107',
    slug: 'chain-bracelet',
    name: 'Chain Bracelet',
    category: 'jewellery',
    subcategory: 'Bracelets',
    price: 2000,
    compareAtPrice: 2400,
    sku: 'SV-JW-BRC-007',
    stock: 5,
    availability: 'low-stock',
    shape: 'pill',
    images: {
      primary: 'products/chain-bracelet/front',
      hover: 'products/chain-bracelet/worn',
      gallery: ['products/chain-bracelet/front', 'products/chain-bracelet/worn'],
    },
    shortDescription: 'A delicate curb chain bracelet, gold-tone — the wrist match to the layered necklace.',
    description:
      "A fine curb chain bracelet in gold-tone brass, sized to sit loose rather than snug so it moves with the wrist instead of sitting still. The bracelet half of the necklace's chain — matched deliberately, sold separately.",
    specifications: {
      Material: 'Brass base, 18k gold-tone plating',
      Length: '17cm + 3cm extender',
      Clasp: 'Lobster clasp',
    },
    rating: { average: 4.0, count: 1 },
    reviews: [
      {
        id: 'r-cb-1',
        author: 'Rida W.',
        rating: 4,
        date: '2026-08-05',
        body: 'Delicate and sits nicely with my other bracelets. Extender is a nice touch since my wrist is on the smaller side.',
      },
    ],
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-08-05T00:00:00Z',
  },
  {
    id: 'SE-0108',
    slug: 'baguette-ring',
    name: 'Baguette Ring',
    category: 'jewellery',
    subcategory: 'Rings',
    price: 2300,
    sku: 'SV-JW-RNG-008',
    stock: 0,
    availability: 'out-of-stock',
    shape: 'circle',
    images: {
      primary: 'products/baguette-ring/front',
      hover: 'products/baguette-ring/worn',
      gallery: ['products/baguette-ring/front', 'products/baguette-ring/worn'],
    },
    variants: ['US 5', 'US 6', 'US 7', 'US 8'],
    shortDescription: 'A thin gold-tone band set with a single baguette-cut stone — sold out, restocking.',
    description:
      'A thin gold-tone band with one baguette-cut cubic zirconia set flush along the top, so it stacks flat against a plain band on either side. This size run is sold out; message us on WhatsApp for a restock date.',
    specifications: {
      Material: 'Brass base, 18k gold-tone plating; cubic zirconia',
      'Band width': '1.5mm',
      Stone: 'Baguette-cut, bezel-set',
    },
    rating: null,
    reviews: [],
    createdAt: '2026-04-25T00:00:00Z',
    updatedAt: '2026-08-28T00:00:00Z',
  },
];

export const getProduct = (slug) => products.find((p) => p.slug === slug);

export const getProductsByCategory = (category) =>
  category ? products.filter((p) => p.category === category) : products;

/** Flag-driven, not date-inferred — a product is "new" only because someone said so. */
export const getNewArrivals = () => products.filter((p) => p.isNew);

/** Flag-driven (`bestseller`), not an invented ranking — set by a person from real demand. */
export const getBestSellers = () => products.filter((p) => p.bestseller);

/** Real cross-sells only: same category, excluding the product itself. */
export const getRelatedProducts = (product, limit = 4) =>
  product ? products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, limit) : [];

/** Special, non-category segments the Shop route also accepts (see pages/Shop.jsx). */
export const SHOP_VIEWS = {
  'new-arrivals': { title: 'New Arrivals', get: getNewArrivals },
  'best-sellers': { title: 'Best Sellers', get: getBestSellers },
};

/** UI copy for each availability state. `orderable: false` disables order actions. */
export function availabilityMeta(availability) {
  switch (availability) {
    case 'made-to-order':
      return { label: 'Made to order', tone: 'outline', orderable: true };
    case 'low-stock':
      return { label: 'Low stock', tone: 'limited', orderable: true };
    case 'coming-soon':
      return { label: 'Coming soon', tone: 'outline', orderable: false };
    case 'out-of-stock':
      return { label: 'Out of stock', tone: 'outline', orderable: false };
    default:
      return null; // in-stock (or unspecified): no badge, ordering enabled
  }
}
