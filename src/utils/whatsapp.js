import { site } from '@/data/site';
import { formatPrice } from './format';

/** https://wa.me/<number>?text=<encoded> — a chat link (not the /c/ catalogue link). */
export function whatsappLink(text) {
  const base = `https://wa.me/${site.whatsapp.number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

const productUrl = (slug) => `${site.url || window.location.origin}/product/${slug}`;

/** One product enquiry. `qty` only appears in the message when it's more than one. */
export function productMessage(product, variant, qty = 1) {
  const v = variant ? ` (${variant})` : '';
  const q = qty > 1 ? ` × ${qty}` : '';
  return `Hi Sanovia! I'd like to order the ${product.name}${v}${q}.\n${productUrl(product.slug)}`;
}

/** The whole order list as one message. Items: [{slug,name,variant,qty,price}] */
export function orderListMessage(items) {
  const lines = items.map((i) => {
    const price = formatPrice(i.price);
    const v = i.variant ? ` (${i.variant})` : '';
    return `• ${i.name}${v} × ${i.qty}${price ? ` — ${price}` : ''}\n  ${productUrl(i.slug)}`;
  });
  return `Hi Sanovia! I'd like to order:\n\n${lines.join('\n')}\n\nThank you!`;
}
