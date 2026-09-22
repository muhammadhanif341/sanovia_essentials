/** Navigation is data, so header, mobile menu and footer can never drift apart. */

/** Centre of the desktop bar; the first block of the mobile menu. */
export const primaryNav = [
  { label: 'Shop', to: '/shop' },
  { label: 'Watches', to: '/shop/watches' },
  { label: 'Jewellery', to: '/shop/jewellery' },
  { label: 'Collections', to: '/collections' },
  { label: 'About', to: '/about' },
];

/**
 * Right-hand utilities. `to` = a page; no `to` = opens an overlay (the Header wires those up).
 */
export const utilityNav = [
  { id: 'search', label: 'Search' },
  { id: 'account', label: 'Account', to: '/account' },
  { id: 'wishlist', label: 'Wishlist', to: '/wishlist' },
  { id: 'cart', label: 'Cart' },
];

export const secondaryNav = [{ label: 'Help', to: '/help' }];

export const footerNav = [
  { heading: 'Shop', links: primaryNav.slice(0, 4) },
  { heading: 'Sanovia', links: [primaryNav[4], ...secondaryNav] },
];
