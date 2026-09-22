import { lazy } from 'react';

/**
 * React.lazy with a preload handle. The page-transition curtain calls
 * `preload()` while it wipes in, so the next route's chunk is already loaded
 * when the curtain lifts — no blank flash under it.
 */
export function lazyWithPreload(loader) {
  let promise;
  const load = () => (promise ??= loader());
  const Component = lazy(load);
  Component.preload = load;
  return Component;
}
