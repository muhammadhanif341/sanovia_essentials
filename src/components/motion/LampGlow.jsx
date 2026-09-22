import './motion.css';

/**
 * The lamp: a warm radial light (the lamp-glow motif from the reference reel).
 * Place it as a direct child of a `.sv-lamp-host` (position: relative; overflow: hidden).
 * `useHeroIntro` (on an ancestor) finds it via [data-hero-glow] and animates it:
 * follows the cursor on fine pointers, drifts slowly on touch, static under reduced motion.
 * Purely decorative.
 */
export function LampGlow() {
  return <div className="sv-lamp" data-hero-glow aria-hidden="true" />;
}
