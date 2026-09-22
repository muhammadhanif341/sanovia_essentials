import { useRef } from 'react';
import { useMagnetic } from '@/hooks/useSectionMotion';
import './motion.css';

/**
 * Wrap a PRIMARY call-to-action so it is gently pulled toward the cursor.
 * No effect on touch or under reduced motion; the wrapped control is unchanged for
 * keyboard/AT users. Use sparingly — one or two per page.
 */
export function Magnetic({ strength = 0.35, children }) {
  const ref = useRef(null);
  useMagnetic(ref, { strength });
  return (
    <span ref={ref} className="sv-magnetic">
      {children}
    </span>
  );
}
