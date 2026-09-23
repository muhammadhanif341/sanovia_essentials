/**
 * Shipping configuration — the single place delivery methods and pricing are defined.
 * Every screen that needs a rate (cart, checkout, order summary, order confirmation)
 * reads it from here via services/shippingService.js, never a hardcoded number in a
 * component. TBC with client: rates and the free-shipping threshold are placeholders.
 *
 * @typedef {Object} ShippingMethod
 * @property {string} id
 * @property {string} label
 * @property {string} etaLabel     Human delivery estimate, e.g. "3–5 business days".
 * @property {number} price        Whole currency units, in `site.currency`.
 */

/** @type {ShippingMethod[]} */
export const shippingMethods = [
  { id: 'standard', label: 'Standard Delivery', etaLabel: '4–7 business days', price: 300 },
  { id: 'express', label: 'Express Delivery', etaLabel: '1–2 business days', price: 900 },
];

/** Order subtotal (PKR) at or above which standard shipping is waived. `null` disables it. */
export const FREE_SHIPPING_THRESHOLD = 15000;

/** Only standard shipping is waived by the free-shipping threshold — express stays paid. */
export const FREE_SHIPPING_METHOD_ID = 'standard';

export const getShippingMethod = (id) => shippingMethods.find((m) => m.id === id);
