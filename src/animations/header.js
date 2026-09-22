/**
 * Header choreography. The header is a fixed bar whose look is driven by two CSS custom
 * properties that GSAP tweens on the element itself:
 *
 *   --hp     0 → 1   "glass": the bar tightens (logo settles, content rises a few px) and a
 *                     translucent, blurred layer fades in. Scrubbed over the first 140px of scroll.
 *   --solid  0 → 1   "readable": an opaque layer. Tweened (not scrubbed) the moment the next
 *                     section is about to reach the bar, so text never sits on a light surface
 *                     with only glass behind it.
 *
 * chrome.css turns those numbers into opacity/transform only — nothing here animates layout.
 *
 * `overlay` = the route opens with a hero UNDER the header. On every other route the header is
 * simply solid from the start. Under reduced motion the same states apply, switched instantly.
 * The bar also slides away on scroll down and returns on scroll up (never while focus is inside it).
 *
 * Everything is created inside the caller's gsap.matchMedia() context (see useHeaderMotion).
 */
import { gsap, ScrollTrigger } from './register';

const GLASS_RANGE = 140; // px of scroll over which --hp goes 0 → 1
const HIDE_AFTER = 240; // px before the bar may hide on scroll down

/** Scroll position at which the next section (100svh hero + sheet) reaches the bar. */
const handoffAt = () => Math.max(120, window.innerHeight - 140);

let introPlayed = false;

export function headerMotion(header, { overlay, reduce }) {
  if (!overlay) {
    gsap.set(header, { '--hp': 1, '--solid': 1 });
  } else if (reduce) {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        gsap.set(header, { '--hp': y > 8 ? 1 : 0, '--solid': y > handoffAt() ? 1 : 0 });
      },
    });
  } else {
    gsap.set(header, { '--hp': 0, '--solid': 0 });
    gsap.to(header, { '--hp': 1, ease: 'none', scrollTrigger: { start: 0, end: GLASS_RANGE, scrub: 0.35 } });
    // Position-based, not `isActive`-based: a trigger with end:'max' is "inactive" at the very
    // end of the page, which would drop the bar back to transparent there.
    let solid = false;
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const on = self.scroll() >= handoffAt();
        if (on === solid) return;
        solid = on;
        gsap.to(header, { '--solid': on ? 1 : 0, duration: 0.55, ease: 'power2.out', overwrite: 'auto' });
      },
    });
  }

  // First arrival on a hero page: the bar's three groups drift down into place after the film begins.
  if (overlay && !reduce && !introPlayed) {
    const items = header.querySelectorAll('[data-header-item]');
    gsap.from(items, {
      autoAlpha: 0,
      y: -14,
      duration: 1.1,
      stagger: 0.09,
      delay: 0.7,
      ease: 'expo.out',
      // Marked only on completion: a React StrictMode double-mount reverts the first run before it finishes.
      onComplete: () => {
        introPlayed = true;
      },
    });
  }

  if (reduce) return undefined;

  // Hide on scroll down, reveal on scroll up.
  let hidden = false;
  const setHidden = (next) => {
    if (next === hidden) return;
    hidden = next;
    gsap.to(header, {
      yPercent: next ? -110 : 0,
      duration: next ? 0.55 : 0.7,
      ease: next ? 'power3.in' : 'expo.out',
      overwrite: 'auto',
    });
  };
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      if (self.scroll() <= HIDE_AFTER) setHidden(false);
      else if (self.direction === 1) setHidden(true);
      else if (self.direction === -1) setHidden(false);
    },
  });

  // Keyboard focus inside the bar always reveals it (WCAG 2.4.11): never Tab into an off-screen header.
  const reveal = () => setHidden(false);
  header.addEventListener('focusin', reveal);
  return () => header.removeEventListener('focusin', reveal);
}
