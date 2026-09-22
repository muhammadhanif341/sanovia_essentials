import { site } from '@/data/site';
import { formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';
import './product.css';

/**
 * Price display. `amount == null` → "Message for price" (the brand orders by message, so an
 * unpriced piece is a real state, not an error). Respects site.showPrices.
 */
export function Price({ amount, className }) {
  const text = site.showPrices ? formatPrice(amount) : null;
  if (!text) return <span className={cn('sv-price sv-price--ask', className)}>Message for price</span>;
  return <span className={cn('sv-price', className)}>{text}</span>;
}
