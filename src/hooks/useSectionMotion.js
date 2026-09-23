/**
 * Ready-made motion hooks for sections. Each is a thin, declarative wrapper over
 * useMotion + a primitive, so a Phase 3 section is usually one line:
 *
 *   const ref = useRef(null);
 *   usePageMotion(ref);          // data-reveal + data-parallax inside `ref`
 */
import { useMemo, useRef } from 'react';
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
  initFrameSequence,
} from '@/animations';
import { refreshAfterImages } from '@/animations/refresh';
import { getFrameSequence } from '@/utils/media';

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
      // Skip the frame sequence's inert `.sv-hero__runway` spacer (hero.css), if present, to
      // find the real next section — the runway is a sibling purely for scroll distance, not
      // something the hand-off should ever target.
      let next = exit ? root.nextElementSibling : null;
      while (next?.hasAttribute('data-hero-runway')) next = next.nextElementSibling;
      const glow = root.querySelector('[data-hero-glow]');
      const glowHandle = reduce ? null : glow && lampGlow(glow, { follow: fine });
      // The lamp's breathe/drift tweens are infinite — once the hero is fully covered by the
      // next section it's invisible (still mounted underneath), so pause them rather than let
      // them keep costing scroll-compositor work for the rest of the page. Reduced-motion never
      // starts them in the first place, so there's nothing to pause there.
      const notify = (covered) => {
        glowHandle?.setCovered(covered);
        coveredRef.current?.(covered);
      };
      if (reduce) {
        heroCoverWatch(next, notify);
        return undefined;
      }
      heroIntro(root);
      heroExit(root, next, { onCovered: notify });
      return glowHandle?.teardown;
    },
    { scope }
  );
}

/**
 * The hero's scroll-scrubbed frame sequence (client-directed — see
 * animations/primitives/frameSequence.js). This is the product animation itself, not
 * decorative chrome, so — unlike every other motion primitive in this file — it is NOT gated
 * on `prefers-reduced-motion` or Save-Data: the client's explicit, repeated brief is that the
 * hero must always be the real scroll-driven sequence, never a static fallback image, full
 * stop. (`active` still requires the frames to actually exist — `urls.length > 1` — so a
 * missing/incomplete asset drop still degrades to the Picture fallback below rather than an
 * empty canvas; that's an asset-availability guard, not a motion-preference one.)
 *
 * There is still no pause control, and this isn't a WCAG 2.2.2 gap: the sequence only ever
 * moves 1:1 with the user's own scroll position (never a timer), so stopping IS the pause —
 * same reasoning already applied to <StickyStage/> elsewhere in this codebase.
 *
 * `root.dataset.heroFrames = 'active'` is a plain marker (not read by CSS for layout any more —
 * see hero.css's architecture note on why the scroll runway is a sibling, not a height hack)
 * kept for anything that wants to key off "the real sequence is running" (e.g. debugging).
 *
 * Below `768px` this prefers a `<id>-mobile` frame set (e.g. `src/assets/video/hero-mobile/
 * frames/`) over `<id>` if one is registered — same frame count/order, just a much smaller
 * source resolution, since the canvas itself renders far smaller on mobile (a portrait band or
 * a capped-DPR landscape strip — see hero.css/frameSequence.js) and decoding/drawing full desktop-
 * resolution frames there was the dominant cause of mobile scroll jank. Falls back to `<id>` if
 * no mobile-specific set exists, so this is safe to use for any frame sequence, not just Hero's.
 *
 * @param {object} [o]
 * @param {string} [o.id]        frame sequence id → src/assets/video/<id>/frames/*
 * @param {string} [o.stillId]   Picture id shown instead, ONLY if no frames are registered
 * @returns {{ wrapperRef: React.RefObject, canvasRef: React.RefObject, runwayRef: React.RefObject, active: boolean, stillId: string }}
 *   `wrapperRef` → the sticky `<section>` (also what `useHeroIntro` should scope to)
 *   `runwayRef`  → the inert scroll-runway spacer rendered right after the `<section>`
 */
export function useHeroFrames({ id = 'hero', stillId = 'editorial/hero-hold' } = {}) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const runwayRef = useRef(null);
  const urls = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) {
      const mobile = getFrameSequence(`${id}-mobile`);
      if (mobile.length > 1) return mobile;
    }
    return getFrameSequence(id);
  }, [id]);
  const active = urls.length > 1;

  useMotion(
    ({ scope: root }) => {
      if (!active || !root) return undefined;
      const canvas = canvasRef.current;
      const runway = runwayRef.current;
      if (!canvas || !runway) return undefined;
      root.dataset.heroFrames = 'active';
      const teardown = initFrameSequence(root, canvas, runway, urls);
      return () => {
        teardown();
        delete root.dataset.heroFrames;
      };
    },
    { scope: wrapperRef, deps: [active, urls] }
  );

  return { wrapperRef, canvasRef, runwayRef, active, stillId };
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
