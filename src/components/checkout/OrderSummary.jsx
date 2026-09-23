import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/format';
import { ShapeMedia } from '@/components/media/ShapeMedia';
import { Button } from '@/components/ui/Button';
import { Lock } from '@/components/icons';
import './checkout.css';

/**
 * Order summary: line items + subtotal/shipping/discount/tax/total, always computed from
 * `totals` (utils/pricing.js) — never re-derived here. Sticky on desktop (`sticky`, default
 * on); the promo-code form is hidden on the read-only confirmation page (`editablePromo=false`).
 */
export function OrderSummary({
  items,
  totals,
  shippingLabel,
  promo,
  promoInput,
  onPromoInputChange,
  onApplyPromo,
  onRemovePromo,
  promoError,
  editablePromo = true,
  sticky = true,
}) {
  return (
    <div className={cn('sv-order-summary', sticky && 'sv-order-summary--sticky')}>
      <h2 className="t-h3">Order summary</h2>

      <ul className="sv-order-summary__items" aria-label="Items in your order">
        {items.map((item) => (
          <li key={item.id ?? item.slug} className="sv-order-summary__item">
            <ShapeMedia
              id={item.image}
              decorative
              shape={item.shape ?? 'arch'}
              ratio={item.shape === 'circle' ? '1 / 1' : '4 / 5'}
              zoom={false}
              placeholderLabel=""
            />
            <div className="sv-order-summary__item-body">
              <p className="t-small">{item.name}</p>
              {item.variant && <p className="t-small t-muted">{item.variant}</p>}
              <p className="t-small t-muted">Qty {item.qty}</p>
            </div>
            <span className="t-small sv-order-summary__item-price">
              {formatPrice((item.unitPrice ?? item.price ?? 0) * item.qty)}
            </span>
          </li>
        ))}
      </ul>

      {editablePromo && (
        <div className="sv-promo">
          {promo?.valid ? (
            <div className="sv-promo__applied">
              <span className="t-small">
                <strong>{promo.code}</strong> applied
              </span>
              <button type="button" className="sv-promo__remove" onClick={onRemovePromo}>
                Remove
              </button>
            </div>
          ) : (
            <form
              className="sv-promo__form"
              onSubmit={(e) => {
                e.preventDefault();
                onApplyPromo();
              }}
            >
              <label className="sv-sr-only" htmlFor="promo-code">
                Have a promo code?
              </label>
              <input
                id="promo-code"
                type="text"
                className="sv-input"
                placeholder="Have a promo code?"
                value={promoInput}
                onChange={(e) => onPromoInputChange(e.target.value)}
              />
              <Button type="submit" variant="ghost" size="sm">
                Apply
              </Button>
            </form>
          )}
          {promoError && <p className="t-small sv-promo__error">{promoError}</p>}
        </div>
      )}

      <dl className="sv-order-summary__totals">
        <div>
          <dt className="t-small t-muted">Subtotal</dt>
          <dd className="t-small">{formatPrice(totals.subtotal)}</dd>
        </div>
        <div>
          <dt className="t-small t-muted">Shipping{shippingLabel ? ` — ${shippingLabel}` : ''}</dt>
          <dd className="t-small">{totals.shippingCost === 0 ? 'Free' : formatPrice(totals.shippingCost)}</dd>
        </div>
        {totals.discountAmount > 0 && (
          <div>
            <dt className="t-small t-muted">Discount</dt>
            <dd className="t-small sv-order-summary__discount">-{formatPrice(totals.discountAmount)}</dd>
          </div>
        )}
        <div>
          <dt className="t-small t-muted">Tax</dt>
          <dd className="t-small">{formatPrice(totals.tax)}</dd>
        </div>
        <div className="sv-order-summary__total">
          <dt>Total</dt>
          <dd>{formatPrice(totals.total)}</dd>
        </div>
      </dl>

      <p className="sv-order-summary__secure t-small t-muted">
        <Lock size={14} />
        Secure checkout — your information is never shared with third parties without your consent.
      </p>
    </div>
  );
}
