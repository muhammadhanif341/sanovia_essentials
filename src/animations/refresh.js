/**
 * ScrollTrigger refresh policy. Triggers measure layout, so anything that moves
 * layout afterwards (web fonts, late images, route content) must re-measure.
 * Media elements reserve their aspect ratio, so refreshes rarely move anything —
 * this is the safety net, not the primary defence against layout shift.
 */
import { ScrollTrigger } from './register';

let timer;
let initialised = false;

/** Debounced refresh. */
export function refreshScrollTriggers(delay = 0) {
  window.clearTimeout(timer);
  timer = window.setTimeout(() => ScrollTrigger.refresh(), delay);
}

/** Call once at boot. Idempotent. */
export function initRefreshPolicy() {
  if (initialised || typeof window === 'undefined') return;
  initialised = true;
  document.fonts?.ready.then(() => refreshScrollTriggers(0));
  window.addEventListener('load', () => refreshScrollTriggers(100), { once: true });
  window.addEventListener('orientationchange', () => refreshScrollTriggers(300));

  // Late layout changes — a lazy route finishing, images decoding, an accordion opening —
  // move the document's height after triggers measured it (`end: 'max'`, pinned runways…).
  // Width changes are ignored: ScrollTrigger already handles resize by itself.
  if ('ResizeObserver' in window) {
    let lastHeight = document.documentElement.scrollHeight;
    new ResizeObserver(() => {
      const h = document.documentElement.scrollHeight;
      if (h === lastHeight) return;
      lastHeight = h;
      refreshScrollTriggers(150);
    }).observe(document.body);
  }
}

/** Refresh once the not-yet-loaded images inside `root` have decoded. */
export function refreshAfterImages(root) {
  const pending = [...root.querySelectorAll('img')].filter((img) => !img.complete);
  if (!pending.length) return;
  Promise.all(pending.map((img) => img.decode?.().catch(() => {}))).then(() => refreshScrollTriggers(0));
}
