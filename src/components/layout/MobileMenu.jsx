import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { TextLink } from '@/components/ui/TextLink';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { Logo } from '@/components/media/Logo';
import { Bag, Close, Heart, Instagram, Search, User, WhatsApp } from '@/components/icons';
import { useMotion } from '@/hooks/useMotion';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { useOrderList } from '@/context/OrderListContext';
import { useWishlist } from '@/context/WishlistContext';
import { menuTimeline } from '@/animations/menu';
import { primaryNav, secondaryNav } from '@/data/navigation';
import { site } from '@/data/site';
import { whatsappLink } from '@/utils/whatsapp';
import './chrome.css';

// The exit plays the entrance's timeline in reverse at this speed (exits are shorter than entrances).
const EXIT_SPEED = 1.7;
// Entrance ≈ 1.75s → reversed ≈ 1.03s. The dialog must stay mounted at least that long.
const EXIT_MS = 1150;

/**
 * Full-screen menu for <1024px. GSAP choreographs it (animations/menu.js): a two-layer curtain drops
 * from the top, link text rises out of masks in a stagger, hairlines draw, the close button
 * rotates in. One reversible timeline: open = play(), close = reverse() — so interrupting either
 * direction continues from the current frame instead of snapping.
 *
 * Reduced motion: no timeline, the menu simply appears. It is still a real modal: focus is
 * trapped, the page behind is inert, Esc closes, focus returns to the burger.
 */
export function MobileMenu({ open, onClose, onSearch }) {
  const closeRef = useRef(null);
  const reduced = useReducedMotion();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      label="Menu"
      side="fullscreen"
      surface="darker"
      motion="external"
      exitMs={reduced ? 60 : EXIT_MS}
      initialFocusRef={closeRef}
      className="sv-menu"
    >
      <MenuBody open={open} onClose={onClose} onSearch={onSearch} closeRef={closeRef} />
    </Dialog>
  );
}

function MenuBody({ open, onClose, onSearch, closeRef }) {
  const bodyRef = useRef(null);
  const tlRef = useRef(null);
  const settled = useRef('closed'); // 'closed' | 'moving' | 'open' — survives a timeline rebuild
  const openRef = useRef(open);
  openRef.current = open;
  const { pathname } = useLocation();
  const { count, openDrawer } = useOrderList();
  const { count: wishlistCount } = useWishlist();

  useMotion(
    ({ reduce, scope }) => {
      if (reduce || !scope) return undefined;
      const tl = menuTimeline(scope);
      tl.eventCallback('onComplete', () => {
        settled.current = 'open';
      });
      tl.eventCallback('onReverseComplete', () => {
        settled.current = 'closed';
      });
      tlRef.current = tl;
      // Rebuilt mid-life (device rotated, motion preference flipped): resume, don't replay.
      if (openRef.current) {
        if (settled.current === 'open') tl.progress(1);
        else tl.timeScale(1).play();
      }
      return () => {
        tlRef.current = null;
      };
    },
    { scope: bodyRef }
  );

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    settled.current = 'moving';
    if (open) tl.timeScale(1).play();
    else tl.timeScale(EXIT_SPEED).reverse();
  }, [open]);

  const links = [...primaryNav, ...secondaryNav];
  const closeThen = (fn) => () => {
    onClose();
    fn();
  };

  return (
    <div ref={bodyRef} className="sv-menu__body">
      {/* Two stacked curtains: the lighter one leads and survives as a thin edge. Decorative. */}
      <div className="sv-menu__bg sv-menu__bg--lead" data-menu-bg aria-hidden="true" />
      <div className="sv-menu__bg" data-menu-bg aria-hidden="true" />

      <div className="sv-dialog__bar sv-menu__bar" data-menu-bar>
        <Logo variant="lockup" />
        <button ref={closeRef} type="button" className="sv-dialog__close" aria-label="Close menu" data-menu-close onClick={onClose}>
          <Close size={26} />
        </button>
      </div>

      <nav className="sv-menu__nav" aria-label="Menu">
        <ol>
          {links.map((link, i) => (
            <li key={link.to} className="sv-menu__item">
              <TransitionLink
                to={link.to}
                className="sv-menu__link"
                aria-current={pathname === link.to || pathname.startsWith(`${link.to}/`) ? 'page' : undefined}
                onClick={onClose}
              >
                <span className="sv-menu__num" data-menu-num aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="sv-menu__mask">
                  <span className="sv-menu__label" data-menu-label>
                    {link.label}
                  </span>
                </span>
              </TransitionLink>
              <span className="sv-menu__rule" data-menu-rule aria-hidden="true" />
            </li>
          ))}
        </ol>
      </nav>

      <div className="sv-menu__utils" aria-label="Shortcuts" role="group">
        <button type="button" className="sv-menu__util" data-menu-extra onClick={closeThen(onSearch)}>
          <Search size={20} /> Search
        </button>
        <TransitionLink to="/account" className="sv-menu__util" data-menu-extra onClick={onClose}>
          <User size={20} /> Account
        </TransitionLink>
        <TransitionLink to="/wishlist" className="sv-menu__util" data-menu-extra onClick={onClose}>
          <Heart size={20} /> Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ''}
        </TransitionLink>
        <button type="button" className="sv-menu__util" data-menu-extra onClick={closeThen(openDrawer)}>
          <Bag size={20} /> Cart{count > 0 ? ` (${count})` : ''}
        </button>
      </div>

      <div className="sv-menu__foot">
        <div data-menu-extra>
          <Button href={whatsappLink()} external variant="whatsapp" iconBefore={<WhatsApp size={18} />}>
            Order on WhatsApp
          </Button>
        </div>
        <div data-menu-extra>
          <TextLink href={site.instagram.url} external>
            <Instagram size={18} /> @{site.instagram.handle}
          </TextLink>
        </div>
      </div>
    </div>
  );
}
