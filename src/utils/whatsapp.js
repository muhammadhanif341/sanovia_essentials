import { site } from '@/data/site';

/** https://wa.me/<number>?text=<encoded> — a chat link (not the /c/ catalogue link). */
export function whatsappLink(text) {
  const base = `https://wa.me/${site.whatsapp.number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

const productUrl = (slug) => `${site.url || window.location.origin}/product/${slug}`;

/** A support/availability enquiry about one product — used only where ordering isn't possible
 * (out of stock, coming soon, made to order). `qty` only appears in the message when it's more
 * than one. Never the purchase path itself — see docs/ARCHITECTURE.md §14. */
export function productMessage(product, variant, qty = 1) {
  const v = variant ? ` (${variant})` : '';
  const q = qty > 1 ? ` × ${qty}` : '';
  return `Hi Sanovia! I'd like to order the ${product.name}${v}${q}.\n${productUrl(product.slug)}`;
}
