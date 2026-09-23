/**
 * The single centralized order-totals calculation. Cart drawer, checkout page, order
 * confirmation and order creation (services/orderService.js) all call THIS function rather
 * than computing subtotal/shipping/tax/total inline — so the same number is shown everywhere
 * and, when a real backend exists, this is the one function it needs to re-implement
 * server-side to verify a submitted order (see docs/ARCHITECTURE.md §14, "never trust
 * frontend totals").
 */
import { calculateShippingCost } from '@/services/shippingService';
import { calculateTax } from '@/services/taxService';

/** @typedef {{ unitPrice: number, qty: number }} PricedLine */

/**
 * @param {Object} input
 * @param {PricedLine[]} input.items
 * @param {string|null} [input.shippingMethodId]
 * @param {{ valid: true, amount: number } | null} [input.promo]  Result of discountService.validatePromoCode.
 * @param {string} [input.region]
 */
export function calculateOrderTotals({ items, shippingMethodId = null, promo = null, region } = {}) {
  const lines = Array.isArray(items) ? items : [];
  const subtotal = lines.reduce((sum, i) => sum + (Number(i.unitPrice) || 0) * (Number(i.qty) || 0), 0);
  const discountAmount = promo?.valid ? Math.min(promo.amount, subtotal) : 0;
  const shippingCost = shippingMethodId ? calculateShippingCost(shippingMethodId, subtotal) : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = calculateTax(taxableAmount, region);
  const total = Math.max(0, taxableAmount + shippingCost + tax);

  return { subtotal, discountAmount, shippingCost, tax, total };
}
