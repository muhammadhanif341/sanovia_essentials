/**
 * Tax configuration — TBC with client, same honesty convention as `data/site.js`.
 * A single flat rate today; `region` is accepted throughout the tax/pricing call chain
 * so a future per-province/country rule table is a change to THIS file only.
 */
export const taxRule = {
  label: 'Tax',
  rate: 0, // e.g. 0.05 for 5%. Zero until the client confirms whether/what to charge.
  inclusive: false, // true = `price` already contains tax; false = tax is added on top.
};

/** @param {number} taxableAmount @param {string} [_region] */
export const getTaxRate = (_region) => taxRule.rate;
