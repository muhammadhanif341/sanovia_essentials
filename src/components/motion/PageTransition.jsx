import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { curtainEnter, curtainExit, curtainReset, prefersReducedMotion, refreshScrollTriggers } from '@/animations';
import { findRoute } from '@/routes';
import { formatTitle } from '@/hooks/useDocumentTitle';
import { announce } from '@/utils/a11y';
import { Logo } from '@/components/media/Logo';
import './motion.css';

/**
 * Route transitions + the accessibility work every SPA route change needs.
 *
 *  go(to, origin):
 *    1. curtain wipes in from the click point  ┐ in parallel: the next route's chunk
 *    2. navigate()                              ┘ is preloaded under the curtain
 *    3. on commit: scroll to top (instant), set focus to <main>, announce the new
 *       title to screen readers, refresh ScrollTriggers, lift the curtain
 *
 *  Reduced motion → no curtain: navigate immediately (still with steps 3's a11y).
 *  Back/forward (POP) and plain <Link>s skip the curtain but still get the a11y steps.
 *  A 4s watchdog releases a stalled transition so nobody is trapped under the curtain.
 */
const TransitionContext = createContext({ go: () => {} });
export const useTransition = () => useContext(TransitionContext);

export function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const curtain = useRef(null);
  const state = useRef({ busy: false, pendingEnter: false, watchdog: 0 });
  const isFirstRender = useRef(true);

  useEffect(() => {
    // We own scroll restoration: the curtain covers the jump to top.
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  }, []);

  const go = useCallback(
    async (to, origin) => {
      const s = state.current;
      if (s.busy) return;
      s.busy = true;

      const path = typeof to === 'string' ? to : to.pathname;
      const route = findRoute(path);
      const preload = Promise.resolve(route?.Component?.preload?.()).catch(() => {});

      if (prefersReducedMotion() || !curtain.current) {
        await preload;
        s.busy = false;
        navigate(to);
        return;
      }

      s.pendingEnter = true;
      await Promise.all([curtainExit(curtain.current, origin), preload]);
      navigate(to);
      window.clearTimeout(s.watchdog);
      s.watchdog = window.setTimeout(() => {
        if (!s.pendingEnter) return;
        s.pendingEnter = false;
        s.busy = false;
        curtainReset(curtain.current);
      }, 4000);
    },
    [navigate]
  );

  // Route committed. Layout effect: reset scroll BEFORE paint so there's no flash at the old offset.
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (isFirstRender.current) return undefined;
    const s = state.current;
    let raf2 = 0;
    // Two frames: let the new page mount and its useMotion contexts create their triggers.
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const route = findRoute(location.pathname);
        // Title may be refined by the page itself (useDocumentTitle); this is the default.
        if (route) document.title = formatTitle(route.title);
        document.getElementById('main')?.focus({ preventScroll: true });
        announce(document.title);
        refreshScrollTriggers(60);

        if (s.pendingEnter && curtain.current) {
          s.pendingEnter = false;
          window.clearTimeout(s.watchdog);
          curtainEnter(curtain.current).then(() => {
            s.busy = false;
          });
        } else {
          s.busy = false;
        }
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [location.pathname]);

  const value = useMemo(() => ({ go }), [go]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div ref={curtain} className="sv-curtain" aria-hidden="true">
        <Logo variant="disc" />
      </div>
    </TransitionContext.Provider>
  );
}
