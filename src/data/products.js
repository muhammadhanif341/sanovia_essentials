/**
 * Product catalogue — the real one. Intentionally EMPTY until the client supplies
 * product data (see assets-src/README.md → data sheet). Pages must render a
 * sensible empty state; dev fixtures live in ./placeholders.js and never ship.
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
 * @typedef {Object} Product
 * @property {string}  slug            URL-safe id, also the image folder name.
 * @property {string}  name
 * @property {'watches'|'jewellery'} category
 * @property {string}  [drop]          e.g. "01"
 * @property {number|null} [price]     Whole currency units; null → "Message for price".
 * @property {string}  [tag]           e.g. "Limited", "Most asked for".
 * @property {boolean} [isNew]         Powers the "New Arrivals" view — set, never inferred from a date.
 * @property {Availability} [availability]  Default (omitted) reads as in stock / orderable.
 * @property {Shape}   [shape]         Mask used in cards (default "arch").
 * @property {{primary:string, hover?:string, gallery?:string[]}} images
 *   Image ids, see utils/media.js. `gallery` powers the PDP; falls back to [primary, hover].
 * @property {string[]} [variants]     Strap / colour names, only if real.
 * @property {string}  [description]  Long-form copy for the PDP. Short cards don't use it.
 * @property {{average:number, count:number}|null} [rating]  Omitted/null → "No reviews yet" (never invented).
 * @property {Review[]} [reviews]      Real, consented reviews only. Empty until supplied.
 * @property {boolean} [placeholder]   True for dev fixtures.
 */

/** @type {Product[]} */
export const products = [];

export const getProduct = (slug) => products.find((p) => p.slug === slug);

export const getProductsByCategory = (category) =>
  category ? products.filter((p) => p.category === category) : products;

/** Flag-driven, not date-inferred — a product is "new" only because someone said so. */
export const getNewArrivals = () => products.filter((p) => p.isNew);

/** Same honest flag the landing page's Best Sellers section reads — no invented ranking. */
export const getBestSellers = () => products.filter((p) => p.tag === 'Most asked for');

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
