/**
 * Product service layer — the ONLY thing UI components should import product data from.
 *
 *   UI components (Shop.jsx, ProductCard.jsx, sections/…)
 *         ↓  import from
 *   services/productRepository.js   ← you are here
 *         ↓  reads
 *   data/products.js                (today: a static in-memory array)
 *
 * Every query a screen needs — by slug, by category, featured, bestsellers, new arrivals,
 * search, related — is a named function here, not inline `.filter()` calls scattered across
 * component files. That's what makes the catalogue swappable later: when a real backend
 * exists, ONLY the bodies of the functions below change (static array → `fetch()`/SDK call).
 * No component that imports `getProduct` or `getFeaturedProducts` needs to change at all,
 * because the function names and what they return stay the same.
 *
 * ---------------------------------------------------------------------------------------
 * WHAT CHANGES WHEN A REAL BACKEND ARRIVES (read this before wiring one up)
 * ---------------------------------------------------------------------------------------
 * 1. Every function below becomes `async` (returns a Promise) instead of reading the local
 *    array synchronously. That's a real, necessary change — network calls aren't synchronous —
 *    but it's isolated to THIS file.
 * 2. Every call site becomes `await getProduct(slug)` inside a `useEffect`/loader, with a
 *    loading and error state (React Query / SWR / router loaders are all reasonable choices;
 *    this app doesn't have one yet). That IS a real change to each consuming component
 *    (Shop.jsx, Product.jsx, the section components) — there's no way around a static site
 *    becoming network-dependent without touching the components that render the result.
 *    This file is what keeps that change mechanical and localized instead of a rewrite: the
 *    query names, shapes and filtering semantics already match what a real API should expose.
 * 3. The mutation stubs at the bottom (`createProduct` etc.) are the exact surface an Admin
 *    Portal's product-management screens would call. They currently throw — see their doc
 *    comments and `docs/ARCHITECTURE.md` §12 for what each one needs (an authenticated API
 *    route, a database table, and, for images, real file storage — none of which exist yet).
 * ---------------------------------------------------------------------------------------
 */
import {
  products as allProducts,
  getProduct as getProductFromSource,
  getProductsByCategory as getProductsByCategoryFromSource,
  getNewArrivals as getNewArrivalsFromSource,
  getBestSellers as getBestSellersFromSource,
  getRelatedProducts as getRelatedProductsFromSource,
  availabilityMeta as availabilityMetaFromSource,
  SHOP_VIEWS as SHOP_VIEWS_FROM_SOURCE,
} from '@/data/products';

/** Every published product. Prefer a more specific query below when one fits. */
export const getAllProducts = () => allProducts;

/** A single product by its URL slug, or `undefined`. */
export const getProduct = (slug) => getProductFromSource(slug);

/** All products in a category, or every product when `category` is falsy. */
export const getProductsByCategory = (category) => getProductsByCategoryFromSource(category);

/** All products belonging to a named drop (e.g. `"01"`) — powers the Featured Collection spotlight. */
export const getProductsByDrop = (drop) => (drop ? allProducts.filter((p) => p.drop === drop) : []);

/** `product.featured === true` — a future "Featured products" admin flag/grid, broader than one drop. */
export const getFeaturedProducts = () => allProducts.filter((p) => p.featured);

/** `product.bestseller === true`, set by a person from real demand — never an invented ranking. */
export const getBestsellers = () => getBestSellersFromSource();

/** `product.isNew === true`, set by a person — never inferred from `createdAt`. */
export const getNewArrivals = () => getNewArrivalsFromSource();

/** Same-category cross-sells, excluding the product itself. */
export const getRelatedProducts = (product, limit = 4) => getRelatedProductsFromSource(product, limit);

/** Case-insensitive name/category substring match — same logic the header search overlay uses. */
export const searchProducts = (query, limit) => {
  const q = query?.trim().toLowerCase();
  if (!q) return [];
  const matches = allProducts.filter((p) => `${p.name} ${p.category} ${p.subcategory ?? ''}`.toLowerCase().includes(q));
  return limit ? matches.slice(0, limit) : matches;
};

/** Special, non-category Shop segments ("new-arrivals", "best-sellers" — see pages/Shop.jsx). */
export const SHOP_VIEWS = SHOP_VIEWS_FROM_SOURCE;

/** UI copy + orderability for an `Availability` value. */
export const availabilityMeta = (availability) => availabilityMetaFromSource(availability);

// -----------------------------------------------------------------------------------------
// ADMIN MUTATIONS — INTENTIONALLY NOT IMPLEMENTED.
// -----------------------------------------------------------------------------------------
// These are the exact functions an Admin Portal's product-management UI would call. Their
// signatures document the contract; their bodies throw on purpose rather than silently
// mutating the in-memory array, which would just be a fake admin panel that resets on
// every page refresh and is visible to every visitor with devtools open — exactly what the
// brief says not to build. Implementing any of these for real needs, at minimum: an
// authenticated API route (or Supabase/Firebase table with row-level security), a database
// or persistent store, and — for image fields — real file upload/storage, none of which
// exist in this project yet. See docs/ARCHITECTURE.md §12 for the full list.
// -----------------------------------------------------------------------------------------

const notImplemented = (method) => {
  throw new Error(
    `productRepository.${method}() is not implemented — this app has no backend/database yet. ` +
      'See docs/ARCHITECTURE.md §12 for what is required before an Admin Portal can call this.'
  );
};

/** @param {Partial<import('@/data/products').Product>} _input */
export const createProduct = (_input) => notImplemented('createProduct');
/** @param {string} _slug @param {Partial<import('@/data/products').Product>} _patch */
export const updateProduct = (_slug, _patch) => notImplemented('updateProduct');
/** @param {string} _slug */
export const deleteProduct = (_slug) => notImplemented('deleteProduct');
/** @param {string} _slug @param {boolean} _published */
export const setProductPublished = (_slug, _published) => notImplemented('setProductPublished');
