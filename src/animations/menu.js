/**
 * Full-screen menu choreography. Returns ONE paused, reversible timeline: play() opens the menu,
 * reverse() closes it — so an interrupted open (or a re-open mid-close) continues from wherever
 * the playhead is instead of snapping. The caller runs the exit faster than the entrance.
 *
 * Markup contract (all inside `root`):
 *   [data-menu-bg]      two stacked panels: a lighter one leads, the deeper one follows 90ms later
 *   [data-menu-bar]     the top row (logo + close)
 *   [data-menu-close]   the close button — rotates in
 *   [data-menu-num]     index numerals
 *   [data-menu-label]   link text inside an overflow-clipped mask — rises
 *   [data-menu-rule]    hairline under each link — draws left → right
 *   [data-menu-extra]   utilities and CTAs — fade up
 *
 * Only transforms, opacity and (on two EMPTY layers, so repaint is trivial) clip-path move.
 * Focusable elements are never `visibility: hidden` (that would make the initial focus a no-op),
 * so the close button fades with opacity, not autoAlpha.
 */
import { gsap } from './register';

// The wipe drops from the top edge; its lower edge starts as a deep arch and flattens as it lands.
const CLOSED = 'inset(0% 0% 100% 0% round 0px 0px 50% 50% / 0px 0px 22vh 22vh)';
const OPEN = 'inset(0% 0% 0% 0% round 0px 0px 0% 0% / 0px 0px 0vh 0vh)';

export function menuTimeline(root) {
  const q = (sel) => [...root.querySelectorAll(sel)];
  const bgs = q('[data-menu-bg]');
  const bar = q('[data-menu-bar]');
  const close = q('[data-menu-close]');
  const nums = q('[data-menu-num]');
  const labels = q('[data-menu-label]');
  const rules = q('[data-menu-rule]');
  const extras = q('[data-menu-extra]');

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });

  // Background: two curtains, the second a beat behind — the lighter one survives as a thin gilt-toned edge.
  bgs.forEach((bg, i) =>
    tl.fromTo(bg, { clipPath: CLOSED }, { clipPath: OPEN, duration: 1.0, ease: 'expo.inOut' }, i * 0.09)
  );

  if (bar.length) tl.fromTo(bar, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.3);
  if (close.length) {
    tl.fromTo(
      close,
      { opacity: 0, rotate: -90, scale: 0.5 },
      { opacity: 1, rotate: 0, scale: 1, duration: 0.9, ease: 'back.out(1.7)' },
      0.42
    );
  }

  // Links: masked text rises in a staggered cascade; hairlines draw beneath; numerals fade in last.
  if (labels.length) tl.fromTo(labels, { yPercent: 118 }, { yPercent: 0, duration: 1.05, stagger: 0.065 }, 0.36);
  if (rules.length) {
    tl.fromTo(
      rules,
      { scaleX: 0 },
      { scaleX: 1, transformOrigin: '0% 50%', duration: 1.0, stagger: 0.065, ease: 'expo.inOut' },
      0.36
    );
  }
  if (nums.length) tl.fromTo(nums, { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.065, ease: 'power2.out' }, 0.6);

  // Utilities + CTAs arrive last.
  if (extras.length) tl.fromTo(extras, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.78);

  return tl;
}
