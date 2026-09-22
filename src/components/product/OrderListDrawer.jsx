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
import { orderListMessage, whatsappLink } from '@/utils/whatsapp';
import './product.css';

/**
 * The order list. Bottom sheet on phones, right drawer from tablet up (Dialog handles the
 * structural switch). "Send on WhatsApp" composes one prefilled message from the list.
 * Prices are indicative — the final price/delivery/payment are confirmed on WhatsApp.
 */
export function OrderListDrawer() {
  const { open, closeDrawer, items, setQty, remove, clear, count } = useOrderList();
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
              Nothing here yet. Add pieces and send them to us in one message.
            </Text>
          </div>
        ) : (
          <>
            <ul className="sv-olist__items" aria-label="Items in your cart">
              {items.map((item) => (
                <li key={item.id} className="sv-olist__item">
                  <ShapeMedia
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
                  <span>Estimated total</span>
                  <span className="t-price">
                    {formatPrice(total)}
                    {hasUnpriced && ' +'}
                  </span>
                </p>
              )}
              <p className="sv-olist__note t-small">
                We confirm price, delivery and payment with you on WhatsApp before anything is final.
              </p>
              <Button
                block
                href={whatsappLink(orderListMessage(items))}
                external
                iconBefore={<WhatsApp size={18} />}
                onClick={closeDrawer}
              >
                Send {count} {count === 1 ? 'piece' : 'pieces'} on WhatsApp
              </Button>
              <Button variant="ghost" size="sm" block onClick={clear}>
                Clear list
              </Button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}
