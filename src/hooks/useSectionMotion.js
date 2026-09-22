/**
 * Ready-made motion hooks for sections. Each is a thin, declarative wrapper over
 * useMotion + a primitive, so a Phase 3 section is usually one line:
 *
 *   const ref = useRef(null);
 *   usePageMotion(ref);          // data-reveal + data-parallax inside `ref`
 */
import { useRef } from 'react';
import { useMotion } from './useMotion';
import {
  initReveals,
  initParallax,
  initScaleParallax,
  heroIntro,
  heroExit,
  heroCoverWatch,
  magnetic,
  lampGlow,
  cursorFollow,
  horizontalScroll,
  stickyStage,
} from '@/animations';
import { refreshAfterImages } from '@/animations/refresh';

const parallaxIntensity = () => (window.innerWidth < 768 ? 0.4 : window.innerWidth < 1024 ? 0.6 : 1);

/** Scroll reveals + parallax for everything under `scope` that opts in via data-attributes. */
export function usePageMotion(scope) {
  useMotion(
    ({ reduce, scope: root }) => {
      if (reduce || !root) return;
      initReveals(root);
      initParallax(root, { intensity: parallaxIntensity() });
      initScaleParallax(root);
      refreshAfterImages(root);
    },
    { scope }
  );
}

/**
 * Hero load choreography + lamp glow. See animations/hero.js for the data-attribute contract.
 *
 * `exit: true` also wires the scroll hand-off to the hero's NEXT SIBLING section (the hero is
 * sticky and that section slides over it). `onCovered(bool)` reports when the hero is fully
 * covered — under reduced motion too, where only the report runs and nothing animates.
 */
export function useHeroIntro(scope, { exit = false, onCovered } = {}) {
  const coveredRef = useRef(onCovered);
  coveredRef.current = onCovered;
  useMotion(
    ({ reduce, fine, scope: root }) => {
      if (!root) return undefined;
      const next = exit ? root.nextElementSibling : null;
      const notify = (covered) => coveredRef.current?.(covered);
      if (reduce) {
        heroCoverWatch(next, notify);
        return undefined;
      }
      heroIntro(root);
      heroExit(root, next, { onCovered: notify });
      const glow = root.querySelector('[data-hero-glow]');
      if (glow) return lampGlow(glow, { follow: fine });
      return undefined;
    },
    { scope }
  );
}

/** Magnetic pull on a single element (primary CTAs only). Fine pointer only, motion allowed. */
export function useMagnetic(ref, options) {
  useMotion(
    ({ fine, reduce, scope: el }) => {
      if (!fine || reduce || !el) return undefined;
      return magnetic(el, options);
    },
    { scope: ref }
  );
}

/**
 * Cursor-follow label inside `hostRef` (e.g. a product card image) — see `cursorFollow`.
 * `labelRef` is the label element; fine pointer + motion allowed only, otherwise a no-op
 * (the label stays hidden, touch/keyboard users never depend on it).
 */
export function useCursorFollow(hostRef, labelRef) {
  useMotion(
    ({ fine, reduce, scope: host }) => {
      const label = labelRef.current;
      if (!fine || reduce || !host || !label) return undefined;
      return cursorFollow(label, host);
    },
    { scope: hostRef }
  );
}

/**
 * Horizontal scroll driven by vertical scroll — ≥1024px with motion allowed.
 * Elsewhere the markup is a native scroll-snap carousel. Returns a ref whose
 * `.current` is `{ scrollToIndex, count }` while the scrubbed mode is active,
 * or `null` in native mode (callers then scroll the track natively).
 */
export function useHorizontalScroll(wrapperRef, { onProgress } = {}) {
  const api = useRef(null);
  useMotion(
    ({ full, scope: root }) => {
      if (!full || !root) return undefined;
      const handle = horizontalScroll(root, { onProgress });
      api.current = handle;
      return () => {
        handle.teardown();
        api.current = null;
      };
    },
    { scope: wrapperRef }
  );
  return api;
}

/**
 * Pinned (sticky) scroll story. `build(tl, { stage })` adds tweens to a scrubbed
 * timeline. Active from `minWidth` up ('tabletUp' | 'full'); stacked steps below.
 */
export function useStickyStage(wrapperRef, build, { minWidth = 'tabletUp', scrub } = {}) {
  const buildRef = useRef(build);
  buildRef.current = build;
  useMotion(
    (m) => {
      const active = minWidth === 'full' ? m.full : m.tabletUp;
      if (!active || !m.scope) return undefined;
      return stickyStage(m.scope, (tl, ctx) => buildRef.current(tl, ctx), { scrub });
    },
    { scope: wrapperRef }
  );
}
