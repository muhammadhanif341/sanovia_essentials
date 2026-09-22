import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';

/**
 * Saved pieces, kept on this device only (localStorage) — there is no account system yet
 * (see pages/Account.jsx), so "wishlist" honestly means "remembered on this browser," and
 * the Wishlist page says exactly that. Same persistence pattern as OrderListContext.
 *
 * Stores slugs only — products are resolved live from data/products.js, so a wishlisted
 * item that's since been removed from the catalogue quietly drops out instead of showing
 * broken data.
 */
const STORAGE_KEY = 'sanovia.wishlist.v1';

const load = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === 'string') : [];
  } catch {
    return [];
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'toggle':
      return state.includes(action.slug) ? state.filter((s) => s !== action.slug) : [...state, action.slug];
    case 'remove':
      return state.filter((s) => s !== action.slug);
    default:
      return state;
  }
}

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [slugs, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch {
      /* storage unavailable — the wishlist still works for this session */
    }
  }, [slugs]);

  // The caller (WishlistButton) already knows whether the item is currently saved — it
  // renders aria-pressed from `has()` — so it announces the result itself; the context
  // only needs to flip the state.
  const toggle = useCallback((product) => dispatch({ type: 'toggle', slug: product.slug }), []);
  const remove = useCallback((slug) => dispatch({ type: 'remove', slug }), []);

  const value = useMemo(
    () => ({
      slugs,
      count: slugs.length,
      has: (slug) => slugs.includes(slug),
      toggle,
      remove,
    }),
    [slugs, toggle, remove]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
}
