/**
 * Parallax — decorative layers only, never body copy or controls.
 *   data-parallax="8"   → the layer travels ±8% of its own height across the viewport.
 * For <ShapeMedia parallax> the moving layer is the inner .sv-media__plx (oversized
 * in CSS so it never reveals an edge). Deltas stay small (5–15) so foreground and
 * background never visibly desync.
 */
import { gsap } from '../register';
import { ease } from '../tokens';

/** @param {number} intensity 1 = full, 0.4 = mobile (blueprint §8.2) */
export function initParallax(root, { intensity = 1 } = {}) {
  root.querySelectorAll('[data-parallax]').forEach((el) => {
    const amount = (parseFloat(el.dataset.parallax) || 8) * intensity;
    const target = el.querySelector(':scope > .sv-media__inner > .sv-media__plx') ?? el;
    gsap.fromTo(
      target,
      { yPercent: -amount },
      {
        yPercent: amount,
        ease: ease.scrub,
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          // §7.8: a composited layer only while the tween can actually run, not for the
          // element's whole lifetime — cheap trick, but adds up across a page of media.
          onToggle: (self) => gsap.set(target, { willChange: self.isActive ? 'transform' : 'auto' }),
        },
      }
    );
  });
}

/**
 * Scroll-scrubbed scale: a ShapeMedia settles from a soft zoom down to its resting size as
 * it crosses the upper viewport — product-photography emphasis (Signature Watches: "scale
 * /parallax"). One tween, one direction, no yoyo — controlled motion, not a bounce.
 *   data-scale-parallax="14"   (percent zoom-in at the start, default 14)
 * Targets `.sv-media__plx` (the parallax layer), so it can be combined with data-parallax
 * on the same element without fighting: different properties, same target.
 */
export function initScaleParallax(root) {
  root.querySelectorAll('[data-scale-parallax]').forEach((el) => {
    const amount = (parseFloat(el.dataset.scaleParallax) || 14) / 100;
    const target = el.querySelector(':scope > .sv-media__inner > .sv-media__plx') ?? el;
    gsap.fromTo(
      target,
      { scale: 1 + amount },
      {
        scale: 1,
        ease: ease.scrub,
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'top 35%',
          scrub: true,
          onToggle: (self) => gsap.set(target, { willChange: self.isActive ? 'transform' : 'auto' }),
        },
      }
    );
  });
}
