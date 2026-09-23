import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Section } from '@/components/layout/primitives';
import { PageHead } from '@/components/layout/PageHead';
import { Button } from '@/components/ui/Button';
import { Text, Heading } from '@/components/ui/Typography';
import { Check, WhatsApp } from '@/components/icons';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { getOrder } from '@/services/orderService';
import { getPaymentMethods } from '@/services/paymentService';
import { whatsappLink } from '@/utils/whatsapp';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { usePageMotion } from '@/hooks/useSectionMotion';
import '@/components/checkout/checkout.css';

const PAYMENT_STATUS_LABEL = { pending: 'Pending', paid: 'Paid', failed: 'Failed', refunded: 'Refunded' };
const ORDER_STATUS_LABEL = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

/** Reads ?order=<orderNumber> so the page survives a refresh or a shared/deep link — the
 * order itself is the source of truth (services/orderService.js), never router state alone. */
export default function OrderConfirmation() {
  useDocumentTitle('Order Confirmation');
  const ref = useRef(null);
  usePageMotion(ref);
  const [params] = useSearchParams();
  const orderNumber = params.get('order');
  const order = orderNumber ? getOrder(orderNumber) : null;

  if (!order) {
    return (
      <>
        <PageHead overline="Order Confirmation" title="We couldn't find that order" />
        <Section pad="tight">
          <Container size="narrow">
            <div className="sv-empty">
              <Text size="body-l">
                That order link looks incorrect, or the order was placed on a different device — orders are only
                stored on the device that placed them for now.
              </Text>
              <p style={{ marginTop: 'var(--space-5)' }}>
                <Button to="/shop">Continue shopping</Button>
              </p>
            </div>
          </Container>
        </Section>
      </>
    );
  }

  const paymentMethodLabel = getPaymentMethods().find((m) => m.id === order.paymentMethod)?.label ?? order.paymentMethod;
  const addr = order.shippingAddress;
  const address = [addr.street, addr.apartment, addr.city, addr.state, addr.postalCode, addr.country]
    .filter(Boolean)
    .join(', ');

  return (
    <div ref={ref}>
      <Section pad="tight">
        <Container>
          <div className="sv-confirmation-head">
            <span className="sv-confirmation-head__icon">
              <Check size={26} />
            </span>
            <Heading level={1} size="h1">
              Order confirmed
            </Heading>
            <Text size="body-l" muted>
              Thank you, {order.customer.firstName}. We've received your order and will get it on its way.
            </Text>
          </div>

          <dl className="sv-confirmation-meta">
            <div className="sv-confirmation-meta__row">
              <dt className="t-small">Order number</dt>
              <dd>{order.orderNumber}</dd>
            </div>
            <div className="sv-confirmation-meta__row">
              <dt className="t-small">Order date</dt>
              <dd>{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</dd>
            </div>
            <div className="sv-confirmation-meta__row">
              <dt className="t-small">Payment method</dt>
              <dd>{paymentMethodLabel}</dd>
            </div>
            <div className="sv-confirmation-meta__row">
              <dt className="t-small">Payment status</dt>
              <dd>{PAYMENT_STATUS_LABEL[order.paymentStatus] ?? order.paymentStatus}</dd>
            </div>
            <div className="sv-confirmation-meta__row">
              <dt className="t-small">Order status</dt>
              <dd>{ORDER_STATUS_LABEL[order.orderStatus] ?? order.orderStatus}</dd>
            </div>
            <div className="sv-confirmation-meta__row">
              <dt className="t-small">Delivery</dt>
              <dd>
                {order.shippingMethod.label} — {order.shippingMethod.etaLabel}
              </dd>
            </div>
            <div className="sv-confirmation-meta__row" style={{ gridColumn: '1 / -1' }}>
              <dt className="t-small">Shipping to</dt>
              <dd>
                {order.customer.firstName} {order.customer.lastName} · {address}
              </dd>
            </div>
          </dl>

          <OrderSummary
            items={order.items.map((line) => ({ ...line, unitPrice: line.unitPrice }))}
            totals={{
              subtotal: order.subtotal,
              shippingCost: order.shippingCost,
              discountAmount: order.discount?.amount ?? 0,
              tax: order.tax,
              total: order.total,
            }}
            shippingLabel={order.shippingMethod.label}
            editablePromo={false}
            sticky={false}
          />

          <div className="sv-confirmation-actions">
            <Button to="/shop">Continue shopping</Button>
            <Button
              variant="whatsapp"
              href={whatsappLink(`Hi Sanovia! I have a question about my order ${order.orderNumber}.`)}
              external
              iconBefore={<WhatsApp size={18} />}
            >
              Need help? Chat with us
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
