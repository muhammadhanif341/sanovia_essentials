import { Star } from '@/components/icons';
import { cn } from '@/utils/cn';
import './product.css';

/**
 * Star rating summary. `rating` is `{average, count} | null | undefined` — most products
 * have none yet, and this says so plainly rather than showing an empty/zero-star row
 * (which reads as "bad," not "no data").
 */
export function Rating({ rating, className }) {
  if (!rating || !rating.count) {
    return <span className={cn('t-small', 't-muted', className)}>No reviews yet</span>;
  }
  const { average, count } = rating;
  const full = Math.round(average);
  return (
    <span className={cn('sv-rating', className)}>
      <span className="sv-rating__stars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} size={14} data-on={i < full} />
        ))}
      </span>
      <span className="t-small t-muted">
        {average.toFixed(1)} ({count} {count === 1 ? 'review' : 'reviews'})
      </span>
    </span>
  );
}
