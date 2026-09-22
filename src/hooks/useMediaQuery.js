import { useSyncExternalStore } from 'react';
import { BP } from '@/animations/media';

/** Subscribe to a CSS media query. False on the server / before mount. */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', notify);
      return () => mql.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');

/** 'mobile' | 'tablet' | 'laptop' | 'desktop' — for the rare structural (not stylistic) branch. */
export function useBreakpoint() {
  const md = useMediaQuery(`(min-width: ${BP.md}px)`);
  const lg = useMediaQuery(`(min-width: ${BP.lg}px)`);
  const xl = useMediaQuery(`(min-width: ${BP.xl}px)`);
  if (xl) return 'desktop';
  if (lg) return 'laptop';
  if (md) return 'tablet';
  return 'mobile';
}
