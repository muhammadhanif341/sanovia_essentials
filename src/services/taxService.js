/**
 * Tax — query layer over data/tax.js. Centralized so no component ever computes tax inline.
 */
import { taxRule, getTaxRate } from '@/data/tax';

/** Tax owed on a taxable amount (subtotal minus discount, before shipping). */
export function calculateTax(taxableAmount, region) {
  const rate = getTaxRate(region);
  if (!rate || taxableAmount <= 0) return 0;
  return Math.round(taxableAmount * rate * 100) / 100;
}

export const taxLabel = taxRule.label;
