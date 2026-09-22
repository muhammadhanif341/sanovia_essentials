/**
 * The ONLY place GSAP plugins are registered. Every animation module imports
 * `gsap` / `ScrollTrigger` / `SplitText` from here, so registration is
 * guaranteed to have run exactly once (ES modules evaluate once).
 *
 * Plugins: ScrollTrigger + SplitText only. Both ship inside the `gsap` package
 * (free since GSAP 3.13) — no extra dependency. Flip is added by the section
 * that needs it (catalogue filter) via a dynamic import, not up-front.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Mobile browsers resize the viewport as the toolbar collapses (Instagram's in-app
// browser does too). Don't rebuild every trigger on each of those events.
ScrollTrigger.config({ ignoreMobileResize: true });

if (import.meta.env.DEV && typeof window !== 'undefined') {
  // Dev-only handle for verifying cleanup: window.__SV__.ScrollTrigger.getAll().length
  window.__SV__ = { gsap, ScrollTrigger };
}

export { gsap, ScrollTrigger, SplitText };
