/**
 * SEO plumbing: meta description, canonical link, Open Graph / Twitter Card tags, and JSON-LD
 * structured data. A static SPA has no server to render these per-request, so everything here
 * runs client-side and updates the existing `<head>` in place — search engines that execute JS
 * (Google, Bing) read the post-render DOM; ones that don't get the static fallbacks already in
 * `index.html` (title, description) plus whatever loaded before JS ran.
 *
 * `site.url` is TBC (production domain not yet chosen — see data/site.js) — everything here
 * falls back to `window.location.origin`, same pattern as `utils/whatsapp.js`'s `productUrl`.
 */
import { site } from '@/data/site';

const absoluteUrl = (path = '') => `${site.url || window.location.origin}${path}`;

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeJsonLd(id) {
  document.getElementById(id)?.remove();
}

/** Per-route: meta description, canonical URL, Open Graph + Twitter Card. Call on every title change. */
export function setPageMeta({ title, description }) {
  const desc = description || site.description;
  const url = absoluteUrl(window.location.pathname);
  upsertMeta('name', 'description', desc);
  upsertCanonical(url);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', desc);
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:url', url);
  upsertMeta('property', 'og:site_name', site.name);
  upsertMeta('name', 'twitter:card', 'summary');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', desc);
  // og:image / twitter:image deliberately omitted: no public/og-image.jpg exists yet (client
  // asset, same "supply it and it appears" contract as product photography — see assets/README.md).
  // Pointing a meta tag at a file that doesn't exist is worse than omitting it.
}

/** Site-wide Organization + WebSite JSON-LD. Call once at boot (main.jsx) — not per-route. */
export function setOrganizationSchema() {
  upsertJsonLd('ld-organization', {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: absoluteUrl('/'),
    sameAs: [site.instagram.url].filter(Boolean),
  });
  upsertJsonLd('ld-website', {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: absoluteUrl('/'),
  });
}

const AVAILABILITY_SCHEMA = {
  'in-stock': 'InStock',
  'low-stock': 'LimitedAvailability',
  'made-to-order': 'PreOrder',
  'coming-soon': 'PreOrder',
  'out-of-stock': 'OutOfStock',
};

/**
 * Per-product JSON-LD (Product + Offer + AggregateRating). `product` is nullable — the PDP calls
 * this unconditionally (not-found state clears any stale schema from a previous product).
 * Prefers `shortDescription` (a search-snippet-length line) over the long PDP `description`,
 * same reasoning as `setPageMeta`'s description — falls back when a product has no short one.
 */
export function setProductSchema(product) {
  if (!product) {
    removeJsonLd('ld-product');
    return;
  }
  const availability = AVAILABILITY_SCHEMA[product.availability] ?? 'InStock';
  upsertJsonLd('ld-product', {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description || undefined,
    category: product.category,
    url: absoluteUrl(`/product/${product.slug}`),
    offers:
      product.price != null
        ? {
            '@type': 'Offer',
            priceCurrency: site.currency,
            price: product.price,
            availability: `https://schema.org/${availability}`,
            url: absoluteUrl(`/product/${product.slug}`),
          }
        : undefined,
    aggregateRating: product.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating.average,
          reviewCount: product.rating.count,
        }
      : undefined,
  });
}
