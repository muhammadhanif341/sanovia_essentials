import { site } from '@/data/site';

/** Format a whole-unit price in the site currency. Returns null when there is no price. */
export function formatPrice(amount, { currency = site.currency, locale = site.locale } = {}) {
  if (amount == null || Number.isNaN(Number(amount))) return null;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Number(amount).toLocaleString()}`;
  }
}

/** 4 → "04". Used for the editorial index numerals. */
export const pad2 = (n) => String(n).padStart(2, '0');
