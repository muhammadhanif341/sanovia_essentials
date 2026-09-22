import { useEffect, useRef } from 'react';

/* Accessibility hooks for modal surfaces (menu, order-list drawer).
   Contract informed by the focus-trap in 21st.dev "Immersive Full Screen Navigation":
   capture the trigger, move focus in, wrap Tab, Esc to close, restore focus on close.
   Improvements: siblings are made `inert` (not just aria-hidden), scroll-lock is
   ref-counted so nested overlays behave, and reduced-motion is reactive elsewhere. */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const isVisible = (el) => {
  if (el.hidden) return false;
  const s = window.getComputedStyle(el);
  return s.visibility !== 'hidden' && s.visibility !== 'collapse' && el.getClientRects().length > 0;
};

const focusablesIn = (container) => [...container.querySelectorAll(FOCUSABLE)].filter(isVisible);

/**
 * Keep keyboard focus inside `containerRef` while `active`.
 * On deactivate, focus returns to whatever was focused when it opened.
 */
export function useFocusTrap(containerRef, { active, initialFocusRef, onEscape }) {
  const escapeRef = useRef(onEscape);
  useEffect(() => {
    escapeRef.current = onEscape;
  });

  useEffect(() => {
    if (!active) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const raf = requestAnimationFrame(() => {
      const target =
        initialFocusRef?.current ??
        container.querySelector('[data-autofocus]') ??
        focusablesIn(container)[0] ??
        container;
      target.focus({ preventScroll: true });
    });

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        escapeRef.current?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusablesIn(container);
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (e.shiftKey && (current === first || !container.contains(current))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (current === last || !container.contains(current))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown);
      // Restore AFTER this commit's other cleanups (notably un-inerting #root): focusing an
      // element inside an inert subtree is a silent no-op, which would strand focus on <body>.
      requestAnimationFrame(() => {
        if (previous && document.contains(previous)) previous.focus({ preventScroll: true });
      });
    };
  }, [active, containerRef, initialFocusRef]);
}

let scrollLocks = 0;
/** Ref-counted page scroll lock. `scrollbar-gutter: stable` (base.css) prevents layout shift. */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    scrollLocks += 1;
    document.documentElement.setAttribute('data-scroll-locked', '');
    return () => {
      scrollLocks -= 1;
      if (scrollLocks === 0) document.documentElement.removeAttribute('data-scroll-locked');
    };
  }, [active]);
}

/**
 * Make the app root `inert` while a portal-mounted dialog is open: assistive tech,
 * Tab and clicks can't reach the page behind it. (The dialog itself portals to <body>.)
 */
export function useInertBackground(active) {
  useEffect(() => {
    if (!active) return undefined;
    const root = document.getElementById('root');
    if (!root) return undefined;
    root.inert = true;
    return () => {
      root.inert = false;
    };
  }, [active]);
}
