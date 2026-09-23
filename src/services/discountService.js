/**
 * Discounts — validates a promo code against data/promoCodes.js and computes its effect.
 * Usage-limit enforcement here is demo-only (nothing tracks redemptions without a backend);
 * see the note on `recordRedemption` below for what a real implementation needs.
 */
import { findPromoCode } from '@/data/promoCodes';

/**
 * @param {string} code
 * @param {number} subtotal
 * @returns {{ valid: true, code: string, type: string, value: number, amount: number } |
 *           { valid: false, reason: string }}
 */
export function validatePromoCode(code, subtotal) {
  const trimmed = String(code ?? '').trim();
  if (!trimmed) return { valid: false, reason: 'Enter a promo code.' };

  const promo = findPromoCode(trimmed);
  if (!promo) return { valid: false, reason: "That code isn't valid." };

  if (promo.expiresAt && new Date(promo.expiresAt).getTime() < Date.now()) {
    return { valid: false, reason: 'That code has expired.' };
  }
  if (promo.minOrder && subtotal < promo.minOrder) {
    return { valid: false, reason: `Add items worth at least ${promo.minOrder} to use this code.` };
  }

  const amount =
    promo.type === 'percentage' ? Math.round(subtotal * (promo.value / 100)) : Math.min(promo.value, subtotal);

  return { valid: true, code: promo.code, type: promo.type, value: promo.value, amount };
}

/**
 * Increments a code's redemption count. Demo-only (localStorage, this device) — a real
 * usage-limit check must happen server-side at order creation, or two customers on two
 * devices could both redeem a code meant to be used once. Not called anywhere yet; kept
 * here as the exact seam a backend order-creation endpoint would call.
 */
export function recordRedemption(_code) {
  throw new Error('discountService.recordRedemption() needs a backend — see docs/ARCHITECTURE.md.');
}
