import { Check } from '@/components/icons';
import './checkout.css';

const STEPS = [
  { id: 'cart', label: 'Cart' },
  { id: 'information', label: 'Information' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'confirmation', label: 'Confirmation' },
];

/** Cart → Information → Shipping → Payment → Confirmation. `current` is always past "cart"
 * (this component only renders on /checkout and /order-confirmation). */
export function CheckoutSteps({ current }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);
  return (
    <ol className="sv-checkout-steps" aria-label="Checkout progress">
      {STEPS.map((step, i) => {
        const state = i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'upcoming';
        return (
          <li key={step.id} className="sv-checkout-steps__item" data-state={state}>
            <span className="sv-checkout-steps__marker" aria-hidden="true">
              {state === 'done' ? <Check size={12} /> : i + 1}
            </span>
            <span className="sv-checkout-steps__label">{step.label}</span>
            {i < STEPS.length - 1 && <span className="sv-checkout-steps__rule" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
