import { useMotion } from './useMotion';
import { headerMotion } from '@/animations/header';

/**
 * Scroll-driven header states (see animations/header.js for what --hp / --solid mean).
 * Re-runs when the route flips between "hero under the header" and a normal page, and — like
 * everything routed through useMotion — is reverted on unmount and on reduced-motion changes.
 */
export function useHeaderMotion(headerRef, { overlay }) {
  useMotion(({ reduce, scope: header }) => (header ? headerMotion(header, { overlay, reduce }) : undefined), {
    scope: headerRef,
    deps: [overlay],
  });
}
