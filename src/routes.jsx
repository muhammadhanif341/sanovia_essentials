import { matchPath } from 'react-router-dom';
import { lazyWithPreload } from '@/utils/lazy';

/**
 * Route table. Single source for the router, document titles, header overlap
 * behaviour, and the page-transition preloader. Pages are code-split; `Component.preload()`
 * lets the transition curtain fetch the next chunk while it wipes in.
 *
 *   title    → "<title> — Sanovia Essentials" ('' = home tagline)
 *   overlay  → page opens with a hero UNDER the transparent header (no top padding)
 */
const define = (path, title, loader, extra) => ({ path, title, Component: lazyWithPreload(loader), ...extra });

export const routes = [
  define('/', '', () => import('@/pages/Home'), { overlay: true }),
  define('/shop', 'Shop', () => import('@/pages/Shop')),
  define('/shop/:category', 'Shop', () => import('@/pages/Shop')),
  define('/drops/:drop', 'Drop', () => import('@/pages/Drop')),
  define('/product/:slug', 'Product', () => import('@/pages/Product')),
  define('/checkout', 'Checkout', () => import('@/pages/Checkout')),
  define('/order-confirmation', 'Order Confirmation', () => import('@/pages/OrderConfirmation')),
  define('/collections', 'Collections', () => import('@/pages/Collections')),
  define('/about', 'About', () => import('@/pages/Story')),
  define('/account', 'Account', () => import('@/pages/Account')),
  define('/wishlist', 'Wishlist', () => import('@/pages/Wishlist')),
  define('/help', 'Help', () => import('@/pages/Help')),
  // Living style guide + motion lab: development only, never shipped.
  ...(import.meta.env.DEV
    ? [define('/design-system', 'Design system', () => import('@/pages/dev/DesignSystem'))]
    : []),
];

export const NotFoundPage = lazyWithPreload(() => import('@/pages/NotFound'));

export function findRoute(pathname) {
  return routes.find((r) => matchPath({ path: r.path, end: true }, pathname)) ?? null;
}
