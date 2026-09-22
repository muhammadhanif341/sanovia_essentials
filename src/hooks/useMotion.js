import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/animations/register';
import { MQ } from '@/animations/media';

/**
 * THE cleanup boundary for all GSAP in the app.
 *
 * Wraps `gsap.matchMedia(scope)`: everything created inside `setup` — tweens,
 * timelines, ScrollTriggers, SplitText instances — is tracked and REVERTED when
 * the component unmounts, when a media condition flips (e.g. rotate a tablet,
 * toggle reduced-motion), and under React StrictMode's double-mount in dev.
 * Callers never call `.kill()` by hand.
 *
 * `setup` receives the booleans from `MQ` plus `{ scope, gsap, ScrollTrigger, contextSafe }`:
 *
 *   useMotion(({ reduce, full, scope }) => {
 *     if (reduce) return;                 // content is simply present
 *     gsap.from(scope.querySelectorAll('.x'), {...});
 *     return () => {...};                 // optional extra teardown (listeners)
 *   }, { scope: ref });
 *
 * Runs in a LAYOUT effect so hidden initial states are applied before first paint
 * (no flash of un-animated content). Use `contextSafe` for handlers created later
 * (click/hover) that call GSAP, so those tweens are tracked too.
 *
 * @param {(api: object) => void | (() => void)} setup
 * @param {{ scope?: React.RefObject<Element>, deps?: any[] }} [options]
 */
export function useMotion(setup, { scope, deps = [] } = {}) {
  // Keep the latest closure without re-running the effect on every render.
  const setupRef = useRef(setup);
  useLayoutEffect(() => {
    setupRef.current = setup;
  });

  useLayoutEffect(() => {
    const el = scope?.current ?? undefined;
    const mm = gsap.matchMedia(el);
    mm.add(MQ, (ctx) =>
      setupRef.current({
        ...ctx.conditions,
        scope: el,
        gsap,
        ScrollTrigger,
        contextSafe: ctx.contextSafe,
      })
    );
    return () => mm.revert();
    // `deps` is caller-controlled on purpose; the setup closure is read via ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
