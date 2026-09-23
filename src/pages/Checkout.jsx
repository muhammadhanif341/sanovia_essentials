import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Section } from '@/components/layout/primitives';
import { PageHead } from '@/components/layout/PageHead';
import { Button } from '@/components/ui/Button';
import { Text, Heading } from '@/components/ui/Typography';
import { TextField, SelectField } from '@/components/ui/Field';
import { Alert, CreditCard, Truck, Wallet } from '@/components/icons';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { OptionList } from '@/components/checkout/OptionList';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { useOrderList } from '@/context/OrderListContext';
import { getShippingMethods, calculateShippingCost, getShippingMethod } from '@/services/shippingService';
import { getPaymentMethods, createPaymentSession, confirmPayment, isTestMode } from '@/services/paymentService';
import { validatePromoCode } from '@/services/discountService';
import { revalidateCartItems, createOrder } from '@/services/orderService';
import { calculateOrderTotals } from '@/utils/pricing';
import { validateCustomer, validateAddress, validateCardDetails, hasErrors } from '@/utils/validation';
import { formatPrice } from '@/utils/format';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { usePageMotion } from '@/hooks/useSectionMotion';
import '@/components/checkout/checkout.css';

const COUNTRIES = [
  { value: 'Pakistan', label: 'Pakistan' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'United States', label: 'United States' },
];

const PAYMENT_ICON = { card: CreditCard, wallet: Wallet, cod: Truck };

/**
 * The on-site checkout: Information → Shipping → Payment, then Place Order creates a real
 * order (services/orderService.js) and redirects to /order-confirmation. WhatsApp is no
 * longer part of this path — see docs/ARCHITECTURE.md §14.
 */
export default function Checkout() {
  useDocumentTitle('Checkout');
  const navigate = useNavigate();
  const { items, clear } = useOrderList();
  const pageRef = useRef(null);
  const stepRef = useRef(null);
  usePageMotion(pageRef);

  const [step, setStep] = useState('information');
  const [customer, setCustomer] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [address, setAddress] = useState({
    country: 'Pakistan',
    city: '',
    state: '',
    street: '',
    apartment: '',
    postalCode: '',
  });
  const [shippingMethodId, setShippingMethodId] = useState('standard');
  const [paymentMethodId, setPaymentMethodId] = useState('cod');
  const [cardDetails, setCardDetails] = useState({ cardName: '', cardNumber: '', cardExpiry: '', cardCvc: '' });
  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState(null);
  const [promoError, setPromoError] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pricedItems = items.filter((i) => i.price != null);
  const totals = calculateOrderTotals({
    items: pricedItems.map((i) => ({ unitPrice: i.price, qty: i.qty })),
    shippingMethodId,
    promo,
  });
  const shippingMethod = getShippingMethod(shippingMethodId);

  const updateCustomer = (field) => (e) => setCustomer((c) => ({ ...c, [field]: e.target.value }));
  const updateAddress = (field) => (e) => setAddress((a) => ({ ...a, [field]: e.target.value }));
  const updateCard = (field) => (e) => setCardDetails((c) => ({ ...c, [field]: e.target.value }));

  function focusFirstError() {
    requestAnimationFrame(() => stepRef.current?.querySelector('[aria-invalid="true"]')?.focus());
  }

  function goToStep(next) {
    setStep(next);
    setErrors({});
    setSubmitError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleContinueFromInformation(e) {
    e.preventDefault();
    const stepErrors = { ...validateCustomer(customer), ...validateAddress(address) };
    setErrors(stepErrors);
    if (hasErrors(stepErrors)) {
      focusFirstError();
      return;
    }
    goToStep('shipping');
  }

  function handleApplyPromo() {
    setPromoError(null);
    const result = validatePromoCode(promoInput, totals.subtotal);
    if (!result.valid) {
      setPromoError(result.reason);
      return;
    }
    setPromo(result);
    setPromoInput('');
  }

  function handleRemovePromo() {
    setPromo(null);
    setPromoError(null);
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (isSubmitting) return; // duplicate-submit guard (Test 10: double-click Place Order)
    if (items.length === 0) {
      setSubmitError('Your cart is empty.');
      return;
    }

    const paymentErrors = paymentMethodId === 'card' ? validateCardDetails(cardDetails) : {};
    setErrors(paymentErrors);
    if (hasErrors(paymentErrors)) {
      focusFirstError();
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Never trust the cart's cached price/availability — re-check against the catalogue
      // the moment before the order is created (services/orderService.js docs the caveat:
      // this still runs in the browser, a real backend must repeat it server-side).
      const revalidated = revalidateCartItems(items);
      if (!revalidated.ok) {
        setSubmitError(
          `Some items in your cart changed: ${revalidated.issues
            .map((i) => `${i.name} — ${i.reason}`)
            .join(' ')} Please update your cart and try again.`
        );
        setIsSubmitting(false);
        return;
      }

      const session = await createPaymentSession(paymentMethodId, { total: totals.total });
      const paymentResult = await confirmPayment(paymentMethodId, session.sessionId, cardDetails);

      if (paymentResult.status === 'failed') {
        setSubmitError(paymentResult.reason || 'Your payment could not be processed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const order = createOrder({
        lines: revalidated.lines,
        customer,
        shippingAddress: address,
        shippingMethod,
        promoCode: promo?.valid ? promo.code : null,
        paymentMethod: paymentMethodId,
        paymentResult,
      });

      clear();
      navigate(`/order-confirmation?order=${encodeURIComponent(order.orderNumber)}`);
    } catch (err) {
      setSubmitError(err?.message || 'Something went wrong placing your order. Please try again.');
      setIsSubmitting(false);
    }
  }

  if (items.length === 0 && !isSubmitting) {
    return (
      <>
        <PageHead overline="Checkout" title="Checkout" />
        <Section pad="tight">
          <Container size="narrow">
            <div className="sv-empty">
              <Text size="body-l">Your cart is empty — add a piece before checking out.</Text>
              <p style={{ marginTop: 'var(--space-5)' }}>
                <Button to="/shop">Continue shopping</Button>
              </p>
            </div>
          </Container>
        </Section>
      </>
    );
  }

  return (
    <div ref={pageRef}>
      <PageHead overline="Checkout" title="Checkout" />
      <Section pad="tight">
        <Container>
          <CheckoutSteps current={step} />

          {submitError && (
            <div className="sv-checkout-alert" role="alert">
              <Alert size={18} />
              <Text size="small">{submitError}</Text>
            </div>
          )}

          <div className="sv-checkout-grid">
            <OrderSummary
              items={items}
              totals={totals}
              shippingLabel={step !== 'information' ? shippingMethod?.label : undefined}
              promo={promo}
              promoInput={promoInput}
              onPromoInputChange={setPromoInput}
              onApplyPromo={handleApplyPromo}
              onRemovePromo={handleRemovePromo}
              promoError={promoError}
            />

            <div ref={stepRef}>
              {step === 'information' && (
                <div className="sv-checkout-step">
                  <Heading level={2} size="h3" className="sv-checkout-step-head">
                    Contact information
                  </Heading>
                  <form onSubmit={handleContinueFromInformation} noValidate>
                    <div className="sv-checkout-fields">
                      <TextField
                        label="First name"
                        autoComplete="given-name"
                        value={customer.firstName}
                        onChange={updateCustomer('firstName')}
                        error={errors.firstName}
                        required
                      />
                      <TextField
                        label="Last name"
                        autoComplete="family-name"
                        value={customer.lastName}
                        onChange={updateCustomer('lastName')}
                        error={errors.lastName}
                        required
                      />
                      <TextField
                        label="Email"
                        type="email"
                        autoComplete="email"
                        value={customer.email}
                        onChange={updateCustomer('email')}
                        error={errors.email}
                        required
                      />
                      <TextField
                        label="Phone number"
                        type="tel"
                        autoComplete="tel"
                        value={customer.phone}
                        onChange={updateCustomer('phone')}
                        error={errors.phone}
                        required
                      />
                    </div>

                    <Heading level={3} size="h3" style={{ marginTop: 'var(--space-7)', marginBottom: 'var(--space-5)' }}>
                      Shipping address
                    </Heading>
                    <div className="sv-checkout-fields">
                      <SelectField
                        label="Country"
                        options={COUNTRIES}
                        value={address.country}
                        onChange={updateAddress('country')}
                        error={errors.country}
                        required
                      />
                      <TextField
                        label="City"
                        autoComplete="address-level2"
                        value={address.city}
                        onChange={updateAddress('city')}
                        error={errors.city}
                        required
                      />
                      <TextField
                        label="State / Province / Region"
                        autoComplete="address-level1"
                        value={address.state}
                        onChange={updateAddress('state')}
                        error={errors.state}
                        required
                      />
                      <TextField
                        label="Postal / ZIP code"
                        autoComplete="postal-code"
                        value={address.postalCode}
                        onChange={updateAddress('postalCode')}
                        error={errors.postalCode}
                        required
                      />
                      <TextField
                        className="sv-checkout-field--full"
                        label="Street address"
                        autoComplete="address-line1"
                        value={address.street}
                        onChange={updateAddress('street')}
                        error={errors.street}
                        required
                      />
                      <TextField
                        className="sv-checkout-field--full"
                        label="Apartment, suite, etc. (optional)"
                        autoComplete="address-line2"
                        value={address.apartment}
                        onChange={updateAddress('apartment')}
                      />
                    </div>

                    <div className="sv-checkout-actions">
                      <Button variant="ghost" to="/shop">
                        Back to shop
                      </Button>
                      <Button type="submit">Continue to Shipping</Button>
                    </div>
                  </form>
                </div>
              )}

              {step === 'shipping' && (
                <div className="sv-checkout-step">
                  <Heading level={2} size="h3" className="sv-checkout-step-head">
                    Delivery method
                  </Heading>
                  <OptionList
                    name="shippingMethod"
                    legend="Shipping method"
                    value={shippingMethodId}
                    onChange={setShippingMethodId}
                    options={getShippingMethods().map((m) => {
                      const cost = calculateShippingCost(m.id, totals.subtotal);
                      return {
                        id: m.id,
                        icon: <Truck size={20} />,
                        label: m.label,
                        description: m.etaLabel,
                        right: cost === 0 ? 'Free' : formatPrice(cost),
                      };
                    })}
                  />
                  <div className="sv-checkout-actions">
                    <Button variant="ghost" type="button" onClick={() => goToStep('information')}>
                      Back
                    </Button>
                    <Button type="button" onClick={() => goToStep('payment')}>
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {step === 'payment' && (
                <div className="sv-checkout-step">
                  <Heading level={2} size="h3" className="sv-checkout-step-head">
                    Payment
                  </Heading>
                  <form onSubmit={handlePlaceOrder} noValidate>
                    <OptionList
                      name="paymentMethod"
                      legend="Payment method"
                      value={paymentMethodId}
                      onChange={setPaymentMethodId}
                      options={getPaymentMethods().map((m) => {
                        const Icon = PAYMENT_ICON[m.id] ?? CreditCard;
                        return { id: m.id, icon: <Icon size={20} />, label: m.label, description: m.description };
                      })}
                    />

                    {paymentMethodId === 'card' && (
                      <div className="sv-checkout-fields" style={{ marginTop: 'var(--space-5)' }}>
                        <TextField
                          className="sv-checkout-field--full"
                          label="Name on card"
                          autoComplete="cc-name"
                          value={cardDetails.cardName}
                          onChange={updateCard('cardName')}
                          error={errors.cardName}
                          required
                        />
                        <TextField
                          className="sv-checkout-field--full"
                          label="Card number"
                          autoComplete="cc-number"
                          inputMode="numeric"
                          placeholder="4242 4242 4242 4242"
                          value={cardDetails.cardNumber}
                          onChange={updateCard('cardNumber')}
                          error={errors.cardNumber}
                          required
                        />
                        <TextField
                          label="Expiry"
                          autoComplete="cc-exp"
                          placeholder="MM/YY"
                          value={cardDetails.cardExpiry}
                          onChange={updateCard('cardExpiry')}
                          error={errors.cardExpiry}
                          required
                        />
                        <TextField
                          label="Security code"
                          autoComplete="cc-csc"
                          inputMode="numeric"
                          placeholder="CVC"
                          value={cardDetails.cardCvc}
                          onChange={updateCard('cardCvc')}
                          error={errors.cardCvc}
                          required
                        />
                      </div>
                    )}

                    {isTestMode(paymentMethodId) && (
                      <p className="sv-checkout-test-note t-small">
                        <strong>Test mode</strong> — no real charge occurs.{' '}
                        {paymentMethodId === 'card'
                          ? 'Use 4242 4242 4242 4242 to simulate a successful payment, or 4000 0000 0000 0002 to simulate a decline.'
                          : 'This simulates wallet approval.'}
                      </p>
                    )}
                    {paymentMethodId === 'cod' && (
                      <p className="sv-checkout-test-note t-small">
                        Pay in cash when your order arrives — no payment is collected now.
                      </p>
                    )}

                    <div className="sv-checkout-actions">
                      <Button variant="ghost" type="button" onClick={() => goToStep('shipping')} disabled={isSubmitting}>
                        Back
                      </Button>
                      <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
                        {isSubmitting ? 'Processing Order…' : 'Place Order'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
