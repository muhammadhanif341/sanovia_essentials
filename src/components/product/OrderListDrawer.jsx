import { useRef } from 'react';
import { useOrderList } from '@/context/OrderListContext';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Typography';
import { ShapeMedia } from '@/components/media/ShapeMedia';
import { Price } from './Price';
import { QuantityStepper } from './QuantityStepper';
import { Close, WhatsApp } from '@/components/icons';
import { formatPrice } from '@/utils/format';
import { whatsappLink } from '@/utils/whatsapp';
import './product.css';

/**
 * The cart. Bottom sheet on phones, right drawer from tablet up (Dialog handles the
 * structural switch). "Proceed to Checkout" is the primary, on-site purchase path
 * (pages/Checkout.jsx); WhatsApp remains only as a secondary support channel — see
 * docs/ARCHITECTURE.md §14 ("WhatsApp is no longer the primary checkout").
 */
export function OrderListDrawer() {
  const { open, closeDrawer, items, setQty, remove, clear } = useOrderList();
  const closeRef = useRef(null);

  const priced = items.filter((i) => i.price != null);
  const total = priced.reduce((sum, i) => sum + i.price * i.qty, 0);
  const hasUnpriced = priced.length !== items.length;

  return (
    <Dialog open={open} onClose={closeDrawer} labelledBy="sv-olist-title" side="drawer" initialFocusRef={closeRef}>
      <div className="sv-dialog__bar">
        <h2 id="sv-olist-title" className="t-h3">
          Your cart
        </h2>
        <button ref={closeRef} type="button" className="sv-dialog__close" aria-label="Close cart" onClick={closeDrawer}>
          <Close size={22} />
        </button>
      </div>

      <div className="sv-olist">
        {items.length === 0 ? (
          <div className="sv-olist__items">
            <Text className="sv-empty" muted>
              Nothing here yet. Add a piece to get started.
            </Text>
          </div>
        ) : (
          <>
            <ul className="sv-olist__items" aria-label="Items in your cart">
              {items.map((item) => (
                <li key={item.id} className="sv-olist__item">
                  <ShapeMedia
                    id={item.image}
                    decorative
                    shape={item.shape ?? 'arch'}
                    ratio={item.shape === 'circle' ? '1 / 1' : '4 / 5'}
                    zoom={false}
                    placeholderLabel=""
                  />
                  <div>
                    <p className="sv-olist__name">{item.name}</p>
                    {item.variant && <p className="t-small t-muted">{item.variant}</p>}
                    <Price amount={item.price} className="t-small" />
                    <QuantityStepper
                      value={item.qty}
                      onChange={(qty) => setQty(item.id, qty)}
                      label={`Quantity for ${item.name}`}
                      className="sv-olist__qty"
                    />
                    {item.price != null && (
                      <p className="t-small t-muted sv-olist__line-subtotal">
                        Subtotal: {formatPrice(item.price * item.qty)}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="sv-dialog__close"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => remove(item.id)}
                  >
                    <Close size={18} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="sv-olist__foot">
              {priced.length > 0 && (
                <p className="t-body" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Cart subtotal</span>
                  <span className="t-price">
                    {formatPrice(total)}
                    {hasUnpriced && ' +'}
                  </span>
                </p>
              )}
              <p className="sv-olist__note t-small">Shipping, discounts and tax are calculated at checkout.</p>
              <Button block to="/checkout" onClick={closeDrawer}>
                Proceed to Checkout
              </Button>
              <Button variant="ghost" size="sm" block to="/shop" onClick={closeDrawer}>
                Continue shopping
              </Button>
              <div className="sv-olist__support">
                <Button
                  href={whatsappLink('Hi Sanovia! I have a question about my cart.')}
                  external
                  variant="whatsapp"
                  size="sm"
                  iconBefore={<WhatsApp size={16} />}
                >
                  Need help? Chat with us
                </Button>
                <button type="button" className="sv-olist__clear" onClick={clear}>
                  Clear cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}
