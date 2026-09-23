/**
 * Orders — the checkout's persistence layer, following the exact seam productRepository.js
 * documents: every query/mutation a screen needs is a named function here, reading a
 * localStorage-backed store today, a real backend later. Nothing outside this file touches
 * the store directly.
 *
 * ---------------------------------------------------------------------------------------
 * WHAT CHANGES WHEN A REAL BACKEND ARRIVES
 * ---------------------------------------------------------------------------------------
 * 1. `createOrder` must run server-side: price, stock and discount are re-verified here
 *    against the current catalogue (never the price the cart happened to carry), which is
 *    already how this file works — but a browser-side "server-side" check is still a check
 *    the customer's own devtools can see. A real backend repeats these exact checks in a
 *    trusted process before writing the order.
 * 2. `getOrder`/`getOrdersByEmail` become authenticated (a guest should not be able to list
 *    every order by guessing order numbers) and `async`.
 * 3. `updateOrderStatus`/`updatePaymentStatus` must require admin authentication — today
 *    they're open because there is no auth system yet (see pages/Account.jsx), which also
 *    means a customer's own browser can currently self-edit their order's status. That is
 *    ONLY acceptable because this is demo/local persistence; do not ship this file as-is.
 * ---------------------------------------------------------------------------------------
 */
import { getProduct, availabilityMeta } from '@/services/productRepository';
import { validatePromoCode } from '@/services/discountService';
import { calculateOrderTotals } from '@/utils/pricing';
import { site } from '@/data/site';

const STORAGE_KEY = 'sanovia.orders.v1';
const SEQUENCE_KEY = 'sanovia.orders.seq.v1';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

function loadOrders() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    /* storage unavailable — the order still exists for this session's in-memory return value */
  }
}

function nextOrderNumber() {
  let seq = 1;
  try {
    seq = Number(window.localStorage.getItem(SEQUENCE_KEY)) || 1;
  } catch {
    /* default to 1 */
  }
  try {
    window.localStorage.setItem(SEQUENCE_KEY, String(seq + 1));
  } catch {
    /* non-persistent sequence for this session only */
  }
  const year = new Date().getFullYear();
  return `SAN-${year}-${String(seq).padStart(6, '0')}`;
}

/**
 * Re-validates every cart line against the live catalogue: the product still exists, is
 * orderable, and (when `stock` is tracked) the requested quantity is available. Returns
 * `{ ok:true, lines }` with server-trusted unit prices, or `{ ok:false, issues }`.
 */
export function revalidateCartItems(cartItems) {
  const issues = [];
  const lines = [];

  for (const item of cartItems) {
    const product = getProduct(item.slug);
    if (!product) {
      issues.push({ slug: item.slug, name: item.name, reason: 'No longer available.' });
      continue;
    }
    const avail = availabilityMeta(product.availability);
    if (avail?.orderable === false) {
      issues.push({ slug: item.slug, name: product.name, reason: `${avail.label} — can't be ordered right now.` });
      continue;
    }
    if (typeof product.stock === 'number' && item.qty > product.stock) {
      issues.push({
        slug: item.slug,
        name: product.name,
        reason: product.stock === 0 ? 'Out of stock.' : `Only ${product.stock} left in stock.`,
      });
      continue;
    }
    lines.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variant: item.variant || undefined,
      image: product.images?.primary,
      shape: product.shape,
      qty: item.qty,
      unitPrice: product.price ?? 0, // trust the catalogue's current price, never the cart's cached one
      subtotal: (product.price ?? 0) * item.qty,
    });
  }

  return issues.length > 0 ? { ok: false, issues } : { ok: true, lines };
}

/**
 * Creates an order from a validated checkout. Callers must have already: revalidated stock
 * (`revalidateCartItems`), obtained a non-failed `paymentResult` from paymentService, and
 * confirmed the cart is non-empty. Recomputes totals from the trusted `lines`/promo/shipping
 * rather than accepting a total from the caller.
 */
export function createOrder({ lines, customer, shippingAddress, shippingMethod, promoCode, paymentMethod, paymentResult }) {
  if (!lines?.length) throw new Error('Cannot create an order with no items.');

  const promo = promoCode ? validatePromoCode(promoCode, lines.reduce((s, l) => s + l.subtotal, 0)) : null;
  const totals = calculateOrderTotals({
    items: lines.map((l) => ({ unitPrice: l.unitPrice, qty: l.qty })),
    shippingMethodId: shippingMethod.id,
    promo,
  });

  const now = new Date().toISOString();
  const order = {
    id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    orderNumber: nextOrderNumber(),
    customer,
    shippingAddress,
    items: lines,
    shippingMethod: { id: shippingMethod.id, label: shippingMethod.label, etaLabel: shippingMethod.etaLabel },
    shippingCost: totals.shippingCost,
    discount: promo?.valid ? { code: promo.code, amount: promo.amount } : null,
    tax: totals.tax,
    subtotal: totals.subtotal,
    total: totals.total,
    currency: site.currency,
    paymentMethod,
    paymentStatus: paymentResult?.paymentStatus ?? 'pending',
    orderStatus: paymentResult?.status === 'failed' ? 'cancelled' : 'confirmed',
    createdAt: now,
    updatedAt: now,
  };

  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);
  return order;
}

export const getOrder = (orderNumber) => loadOrders().find((o) => o.orderNumber === orderNumber);

export const getOrdersByEmail = (email) =>
  loadOrders().filter((o) => o.customer?.email?.toLowerCase() === String(email ?? '').toLowerCase());

/** Every order — the exact list a future admin dashboard would page/filter (brief §23). */
export const getAllOrders = () => loadOrders();

function updateOrder(orderNumber, patch) {
  const orders = loadOrders();
  const idx = orders.findIndex((o) => o.orderNumber === orderNumber);
  if (idx === -1) throw new Error(`Order ${orderNumber} not found.`);
  orders[idx] = { ...orders[idx], ...patch, updatedAt: new Date().toISOString() };
  saveOrders(orders);
  return orders[idx];
}

/** Admin transition — see the file-level "not authenticated yet" note. */
export function updateOrderStatus(orderNumber, status) {
  if (!ORDER_STATUSES.includes(status)) throw new Error(`Invalid order status: ${status}`);
  return updateOrder(orderNumber, { orderStatus: status });
}

/** Admin transition — see the file-level "not authenticated yet" note. Kept separate from
 * order status: a shipped order and a refunded payment are independent facts. */
export function updatePaymentStatus(orderNumber, status) {
  if (!PAYMENT_STATUSES.includes(status)) throw new Error(`Invalid payment status: ${status}`);
  return updateOrder(orderNumber, { paymentStatus: status });
}
