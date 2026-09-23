/**
 * Payment — provider abstraction. Nothing in the checkout page talks to a payment gateway
 * directly; it only calls `getPaymentMethods()`, `createPaymentSession()` and
 * `confirmPayment()` below. Swapping in a real gateway later means adding ONE file (e.g.
 * `payment/stripeProvider.js` implementing the `PaymentProvider` shape) and registering it
 * in `LIVE_PROVIDERS` — no change to the checkout UI.
 *
 * @typedef {Object} PaymentProvider
 * @property {(order: { total: number, currency: string }) => Promise<{ sessionId: string }>} createSession
 * @property {(sessionId: string, details?: Object) => Promise<{ status:'succeeded'|'failed', paymentStatus:string, reason?:string }>} confirmPayment
 *
 * IMPORTANT — this app has no payment gateway credentials configured. Card and Digital
 * Wallet therefore run through a clearly-labelled TEST provider that never contacts a real
 * network and never moves real money; it simulates approve/decline so the checkout flow is
 * genuinely testable end-to-end (see the test card numbers below). Cash on Delivery needs no
 * gateway and is real/production-ready as-is. Set `VITE_PAYMENTS_LIVE=true` AND register a
 * real provider in `LIVE_PROVIDERS` before this can process an actual charge — until then,
 * flipping the flag alone throws rather than silently faking a live charge.
 */
import { site } from '@/data/site';

const PAYMENTS_LIVE = import.meta.env.VITE_PAYMENTS_LIVE === 'true';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sessionId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

/** Card numbers (digits only, whitespace stripped) that the test provider simulates as declined. */
const TEST_DECLINE_NUMBERS = new Set(['4000000000000002', '4000000000009995']);

/** Cash on Delivery: real, no gateway involved — payment is collected by the courier. */
const codProvider = {
  async createSession(_order) {
    return { sessionId: sessionId('cod') };
  },
  async confirmPayment() {
    return { status: 'succeeded', paymentStatus: 'pending' };
  },
};

/** Simulated card rails for development/testing only — see the module doc comment above. */
const testCardProvider = {
  async createSession(_order) {
    await delay(400);
    return { sessionId: sessionId('test_card') };
  },
  async confirmPayment(_sessionId, details = {}) {
    await delay(700);
    const digits = String(details.cardNumber ?? '').replace(/\s/g, '');
    if (TEST_DECLINE_NUMBERS.has(digits)) {
      return { status: 'failed', paymentStatus: 'failed', reason: 'Your card was declined. Try a different card.' };
    }
    return { status: 'succeeded', paymentStatus: 'paid' };
  },
};

/** Simulated digital-wallet sheet (Apple Pay / Google Pay) — development/testing only. */
const testWalletProvider = {
  async createSession(_order) {
    await delay(400);
    return { sessionId: sessionId('test_wallet') };
  },
  async confirmPayment() {
    await delay(500);
    return { status: 'succeeded', paymentStatus: 'paid' };
  },
};

const TEST_PROVIDERS = { cod: codProvider, card: testCardProvider, wallet: testWalletProvider };

/** Populate with a real provider (e.g. `{ card: stripeProvider }`) once gateway keys exist. */
const LIVE_PROVIDERS = {};

function resolveProvider(methodId) {
  if (methodId === 'cod') return codProvider; // no gateway to be "live" about
  if (PAYMENTS_LIVE) {
    const live = LIVE_PROVIDERS[methodId];
    if (!live) {
      throw new Error(
        `VITE_PAYMENTS_LIVE is true but no live provider is registered for "${methodId}" in services/paymentService.js.`
      );
    }
    return live;
  }
  return TEST_PROVIDERS[methodId];
}

/** Configurable payment method list — never hardcode this array into a component. */
export function getPaymentMethods() {
  return [
    { id: 'card', label: 'Credit / Debit Card', description: 'Visa, Mastercard, and more' },
    { id: 'wallet', label: 'Apple Pay / Google Pay', description: 'Pay with your digital wallet' },
    { id: 'cod', label: 'Cash on Delivery', description: 'Pay in cash when your order arrives' },
  ];
}

/** True when this method's checkout flow is a labelled simulation, not a real charge. */
export const isTestMode = (methodId) => methodId !== 'cod' && !PAYMENTS_LIVE;

export function createPaymentSession(methodId, order) {
  return resolveProvider(methodId).createSession({ total: order.total, currency: site.currency });
}

export function confirmPayment(methodId, sessionId_, details) {
  return resolveProvider(methodId).confirmPayment(sessionId_, details);
}
