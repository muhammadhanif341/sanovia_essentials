/**
 * Page-transition curtain (DESIGN-BLUEPRINT §7.9 v1). An espresso panel wipes in as a
 * circle from the click point, the route changes underneath, then the panel lifts off.
 * Total ≤ ~1.3 s; components/motion/PageTransition.jsx orchestrates the sequence.
 *
 * Both functions return Promises (not GSAP thenables) so callers can `await` them
 * without GSAP's thenable-recursion pitfall.
 */
import { gsap } from './register';
import { dur, ease } from './tokens';

/** Radius that covers the viewport from (x, y). */
const coverRadius = (x, y) =>
  Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

export function curtainExit(el, { x = window.innerWidth / 2, y = window.innerHeight / 2 } = {}) {
  gsap.killTweensOf(el);
  gsap.set(el, { autoAlpha: 1, yPercent: 0, clipPath: `circle(0px at ${x}px ${y}px)` });
  return new Promise((resolve) => {
    gsap.to(el, {
      clipPath: `circle(${coverRadius(x, y)}px at ${x}px ${y}px)`,
      duration: dur.slow,
      ease: ease.inOut,
      onComplete: resolve,
    });
  });
}

export function curtainEnter(el) {
  gsap.killTweensOf(el);
  return new Promise((resolve) => {
    gsap.to(el, {
      yPercent: -100,
      duration: dur.slow * 0.85,
      ease: ease.inOut,
      onComplete: () => {
        gsap.set(el, { autoAlpha: 0, yPercent: 0, clearProps: 'clipPath' });
        resolve();
      },
    });
  });
}

/** Instant reset — used if navigation stalls. */
export function curtainReset(el) {
  gsap.killTweensOf(el);
  gsap.set(el, { autoAlpha: 0, yPercent: 0, clearProps: 'clipPath' });
}
