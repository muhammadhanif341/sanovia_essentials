import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useHeaderMotion } from '@/hooks/useHeaderMotion';
import { primaryNav } from '@/data/navigation';
import { findRoute } from '@/routes';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { ScrollProgressRing } from '@/components/motion/ScrollProgressRing';
import { Logo } from '@/components/media/Logo';
import { OrderListButton } from '@/components/product/OrderControls';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, Search, User } from '@/components/icons';
import { IconButton } from './IconButton';
import { RollLink } from './RollLink';
import { MobileMenu } from './MobileMenu';
import { SearchDialog } from './SearchDialog';
import './chrome.css';

/**
 * Site header.
 *
 *   ≥1024   Logo │ Shop · Watches · Jewellery · Collections · About │ Search · Account · Wishlist · Cart
 *   <1024   Logo │ (Search from 768) · Cart · menu button — the rest lives in the full-screen menu
 *
 * On a route that opens with a hero (`overlay`) the bar starts transparent, integrated with the
 * film, turns to tinted glass as you scroll, and becomes solid as the next section reaches it.
 * Everywhere else it is solid. The scroll behaviour is GSAP (useHeaderMotion → animations/header.js);
 * hover, focus and open/close of overlays are CSS. One labelled Primary <nav> landmark; the
 * utilities are individually labelled buttons and links.
 */
export function Header() {
  const ref = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const overlay = findRoute(pathname)?.overlay === true;
  const { count: wishlistCount } = useWishlist();

  useHeaderMotion(ref, { overlay });

  // A route change always closes both overlays.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <header ref={ref} className="sv-header" data-surface="dark" data-overlay={overlay}>
      <div className="sv-header__bar">
        <TransitionLink to="/" className="sv-header__brand" aria-label="Sanovia Essentials — home" data-header-item>
          <ScrollProgressRing>
            <Logo variant="disc" />
          </ScrollProgressRing>
          <Logo variant="wordmark" className="sv-header__word" />
        </TransitionLink>

        <nav className="sv-header__nav" aria-label="Primary" data-header-item>
          <ul>
            {primaryNav.map((link) => (
              <li key={link.to}>
                <RollLink to={link.to} exact>
                  {link.label}
                </RollLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sv-header__actions" data-header-item>
          <IconButton
            className="sv-header__search"
            label="Search"
            icon={<Search size={22} />}
            aria-haspopup="dialog"
            onClick={() => setSearchOpen(true)}
          />
          <IconButton className="sv-header__account" label="Account" icon={<User size={22} />} to="/account" />
          <IconButton
            className="sv-header__wishlist"
            label="Wishlist"
            icon={<Heart size={22} />}
            to="/wishlist"
            badge={wishlistCount}
            aria-label={`Wishlist, ${wishlistCount} ${wishlistCount === 1 ? 'piece' : 'pieces'}`}
          />
          <OrderListButton />
          <button
            type="button"
            className="sv-burger"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onSearch={() => setSearchOpen(true)} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
