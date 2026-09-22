import { useRef } from 'react';
import { useMotion } from '@/hooks/useMotion';
import './motion.css';

const R = 24; // ring radius in a 52-unit viewBox
const CIRC = 2 * Math.PI * R;

/**
 * Wraps the logo disc with a hairline ring that fills as the page scrolls — a
 * watch-hand-like progress cue (DESIGN-BLUEPRINT §6.3). Decorative; hidden from AT.
 * Under reduced motion only the static track is shown.
 */
export function ScrollProgressRing({ children, size = '2.5rem' }) {
  const ref = useRef(null);

  useMotion(
    ({ reduce, scope, gsap }) => {
      if (reduce || !scope) return;
      const bar = scope.querySelector('.sv-ring__bar');
      gsap.set(bar, { strokeDasharray: CIRC, strokeDashoffset: CIRC, opacity: 1 });
      gsap.to(bar, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: true },
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className="sv-ring" style={{ '--logo-size': size }} aria-hidden="true">
      <svg className="sv-ring__svg" viewBox="0 0 52 52" focusable="false">
        <circle className="sv-ring__track" cx="26" cy="26" r={R} />
        <circle className="sv-ring__bar" cx="26" cy="26" r={R} />
      </svg>
      {children}
    </span>
  );
}
