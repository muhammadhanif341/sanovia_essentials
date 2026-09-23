import { site } from '@/data/site';
import { formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';
import './product.css';

/**
 * Price display. `amount == null` → "Message for price" (the brand orders by message, so an
 * unpriced piece is a real state, not an error). Respects site.showPrices.
 *
 * `compareAt` (Product.compareAtPrice) renders as a struck-through "was" price — only when
 * it's actually greater than `amount`, so a missing/equal compareAtPrice never shows a
 * meaningless "PKR 6,200 PKR 6,200".
 */
export function Price({ amount, compareAt, className }) {
  const text = site.showPrices ? formatPrice(amount) : null;
  const compareText = site.showPrices && amount != null && compareAt != null && compareAt > amount ? formatPrice(compareAt) : null;
  if (!text) return <span className={cn('sv-price sv-price--ask', className)}>Message for price</span>;
  return (
    <span className={cn('sv-price', className)}>
      {text}
      {compareText && (
        <span className="sv-price__compare" aria-label={`Was ${compareText}`}>
          {compareText}
        </span>
      )}
    </span>
  );
}
