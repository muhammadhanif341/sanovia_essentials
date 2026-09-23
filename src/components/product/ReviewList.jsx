import { Star, WhatsApp } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { whatsappLink } from '@/utils/whatsapp';
import './product.css';

/**
 * Reviews, PDP context. Honest empty state matches the landing page's Reviews section:
 * real, consented reviews only (DESIGN-BLUEPRINT §14 decision 9) — nothing is invented
 * to fill the space while a piece is new.
 */
export function ReviewList({ product }) {
  const reviews = product.reviews ?? [];
  if (!reviews.length) {
    return (
      <div className="sv-stack" style={{ '--gap': 'var(--space-4)' }}>
        <p className="t-body t-muted">
          This piece hasn't been reviewed yet. First-hand? We only publish reviews with consent.
        </p>
        <Button href={whatsappLink(`Hi Sanovia! I have a question about the ${product.name}.`)} external variant="whatsapp" size="sm" iconBefore={<WhatsApp size={16} />}>
          Ask us on WhatsApp
        </Button>
      </div>
    );
  }
  return (
    <ul className="sv-reviews">
      {reviews.map((r) => (
        <li key={r.id} className="sv-reviews__item">
          <div className="sv-reviews__head">
            <span className="sv-rating__stars" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={13} data-on={i < r.rating} />
              ))}
            </span>
            <span className="sv-sr-only">{r.rating} out of 5 stars</span>
            <span className="t-small t-muted">{new Date(r.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</span>
          </div>
          <p className="t-body">{r.body}</p>
          <p className="t-small t-muted">{r.author}</p>
        </li>
      ))}
    </ul>
  );
}
