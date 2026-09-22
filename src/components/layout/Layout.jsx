import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { findRoute } from '@/routes';
import { Header } from './Header';
import { Footer } from './Footer';
import { OrderListDrawer } from '@/components/product/OrderListDrawer';
import { WhatsAppFab } from '@/components/motion/WhatsAppFab';

/**
 * App shell: skip link → header → <main id="main"> → footer, plus the order-list drawer
 * and the WhatsApp FAB. <main> is programmatically focusable (tabIndex -1) so the page
 * transition can move focus to new content on route change. `overlay` routes (a hero
 * under the header) drop the top padding.
 *
 * Everything inside #root goes `inert` while a dialog is open (see Dialog); the drawer and
 * menu portal to <body>, so they remain interactive. The FAB is deliberately NOT portaled —
 * it should go inert with the rest of the page, same as Header/Footer.
 */
export function Layout() {
  const { pathname } = useLocation();
  const overlay = findRoute(pathname)?.overlay === true;

  return (
    <>
      <a className="sv-skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="sv-main" data-overlap={overlay}>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <OrderListDrawer />
      <WhatsAppFab />
    </>
  );
}
