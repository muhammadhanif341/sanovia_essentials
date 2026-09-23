/**
 * Promo/discount codes — demo data standing in for a future admin-managed table
 * (see services/discountService.js for validation + the swap-to-backend seam).
 *
 * @typedef {Object} PromoCode
 * @property {string} code
 * @property {'percentage'|'fixed'} type
 * @property {number} value          Percent (0–100) or whole-currency-unit amount.
 * @property {number} [minOrder]     Subtotal must be at least this to apply.
 * @property {string} [expiresAt]    ISO date; expired codes are rejected.
 * @property {number} [usageLimit]   Total redemptions allowed across all customers.
 */

/** @type {PromoCode[]} */
export const promoCodes = [
  { code: 'SANOVIA10', type: 'percentage', value: 10, minOrder: 3000, expiresAt: '2027-01-01', usageLimit: 500 },
  { code: 'SAVE500', type: 'fixed', value: 500, minOrder: 5000, expiresAt: '2027-01-01', usageLimit: 200 },
];

export const findPromoCode = (code) =>
  promoCodes.find((p) => p.code.toLowerCase() === String(code ?? '').trim().toLowerCase());
