import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { announce } from '@/utils/a11y';

/**
 * The "order list": this brand orders by WhatsApp message (bio: "Shop via Catalog / DM"),
 * so instead of a cart + checkout there is a list that composes ONE prefilled message.
 * (Commerce model A in DESIGN-BLUEPRINT §14 — confirm with the client.)
 *
 * Persisted in localStorage, defensively: storage can throw (private windows,
 * blocked site data) and the app must work without it.
 */
const STORAGE_KEY = 'sanovia.orderList.v1';

/** @typedef {{ id:string, slug:string, name:string, variant?:string, qty:number, price?:number|null, shape?:string }} OrderItem */

const load = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const MAX_QTY = 9;

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { item, qty } = action;
      const existing = state.find((i) => i.id === item.id);
      if (existing) {
        return state.map((i) => (i.id === item.id ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i));
      }
      return [...state, { ...item, qty: Math.min(MAX_QTY, Math.max(1, qty)) }];
    }
    case 'qty':
      return state
        .map((i) => (i.id === action.id ? { ...i, qty: Math.max(0, Math.min(MAX_QTY, action.qty)) } : i))
        .filter((i) => i.qty > 0);
    case 'remove':
      return state.filter((i) => i.id !== action.id);
    case 'clear':
      return [];
    default:
      return state;
  }
}

const OrderListContext = createContext(null);

export function OrderListProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, load);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — the list still works for this session */
    }
  }, [items]);

  const add = useCallback((product, variant, qty = 1) => {
    const id = `${product.slug}::${variant ?? ''}`;
    dispatch({
      type: 'add',
      qty,
      item: { id, slug: product.slug, name: product.name, variant, price: product.price ?? null, shape: product.shape },
    });
    announce(`${product.name} added to your cart.`);
  }, []);

  const setQty = useCallback((id, qty) => dispatch({ type: 'qty', id, qty }), []);
  const remove = useCallback((id) => dispatch({ type: 'remove', id }), []);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);
  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      open,
      add,
      setQty,
      remove,
      clear,
      openDrawer,
      closeDrawer,
      has: (slug) => items.some((i) => i.slug === slug),
    }),
    [items, open, add, setQty, remove, clear, openDrawer, closeDrawer]
  );

  return <OrderListContext.Provider value={value}>{children}</OrderListContext.Provider>;
}

export function useOrderList() {
  const ctx = useContext(OrderListContext);
  if (!ctx) throw new Error('useOrderList must be used inside <OrderListProvider>');
  return ctx;
}
