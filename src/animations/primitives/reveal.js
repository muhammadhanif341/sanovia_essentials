/**
 * Reveal primitives. Each takes an element (or list) and creates GSAP objects
 * that are auto-tracked by the surrounding gsap.matchMedia() context — so they
 * are reverted on unmount / breakpoint change without any bookkeeping here.
 *
 * Hidden initial states are applied by GSAP itself (immediateRender). Because
 * `useMotion` runs in a layout effect (before first paint), there is no flash;
 * and because reduced-motion skips these entirely, content is never stranded
 * hidden.
 */
import { gsap, ScrollTrigger, SplitText } from '../register';
import { dur, ease, stagger, dist, start } from '../tokens';

/**
 * Headline reveal: split into lines, each masked, sliding up.
 * `type: 'words'` for shorter, punchier reveals. Headline-length copy only —
 * splitting long paragraphs creates a DOM node per line/word.
 */
export function revealLines(el, { type = 'lines', immediate = false, delay = 0, at = start.enter } = {}) {
  return SplitText.create(el, {
    type,
    mask: type, // wrap each line/word in an overflow-clip mask
    aria: 'auto', // keep an accessible name; screen readers read the original text
    autoSplit: true, // re-split when fonts load / container resizes…
    onSplit(self) {
      // Display type runs at ~0.92 line-height, so a mask exactly one line tall would clip
      // descenders (g, y, p). Give each mask room BELOW only; the equal negative margin cancels
      // it so layout is unchanged. (Bottom-only on purpose: adjacent negative margins collapse to
      // the larger one rather than summing, so padding both edges would not cancel.)
      // Re-applied on every re-split.
      self.masks?.forEach((mask) => {
        mask.style.paddingBottom = '0.16em';
        mask.style.marginBottom = '-0.16em';
      });
      // …and returning the tween lets SplitText rebuild it in place on re-split.
      return gsap.from(self[type], {
        yPercent: 125, // a little further than 100 so nothing peeks through the extra mask room
        duration: dur.cine,
        ease: ease.out,
        stagger: stagger.m,
        delay,
        scrollTrigger: immediate ? undefined : { trigger: el, start: at, once: true },
      });
    },
  });
}

/**
 * Scroll-scrubbed word illumination (the "statement" paragraph): words start dim
 * and light up as the paragraph crosses the viewport. Scrub, not time-based.
 */
export function wordIllumination(el, { from = 0.18 } = {}) {
  return SplitText.create(el, {
    type: 'words',
    aria: 'auto',
    autoSplit: true,
    onSplit(self) {
      return gsap.fromTo(
        self.words,
        { opacity: from },
        {
          opacity: 1,
          ease: ease.scrub,
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 45%', scrub: true },
        }
      );
    },
  });
}

/**
 * Media reveal for <ShapeMedia>: the inner layer wipes open from the bottom while
 * the image settles from a slight zoom. The outer element keeps the shape mask
 * (border-radius), so arch/oval/tonneau reveals need no path morphing.
 */
export function revealMask(el, { immediate = false, delay = 0 } = {}) {
  const inner = el.querySelector('.sv-media__inner') ?? el;
  const img = el.querySelector('.sv-media__img');
  const tl = gsap.timeline({
    delay,
    scrollTrigger: immediate ? undefined : { trigger: el, start: start.enterMedia, once: true },
    // Drop inline transforms afterwards so CSS hover-zoom works again.
    onComplete: () => gsap.set([inner, img].filter(Boolean), { clearProps: 'clipPath,transform' }),
  });
  tl.fromTo(
    inner,
    { clipPath: 'inset(100% 0% 0% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: dur.cine, ease: ease.out },
    0
  );
  if (img) tl.fromTo(img, { scale: 1.2 }, { scale: 1, duration: dur.cine * 1.2, ease: ease.out }, 0);
  return tl;
}

/** Generic fade-up, batched so siblings entering together stagger. */
export function revealFade(els, { y = dist.m } = {}) {
  gsap.set(els, { autoAlpha: 0, y });
  return ScrollTrigger.batch(els, {
    start: start.enter,
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: dur.slow,
        ease: ease.soft,
        stagger: stagger.m,
        overwrite: true,
      }),
  });
}

/**
 * Wire up everything under `root` that opts in with data attributes:
 *   data-reveal="lines" | "words" | "mask" | "fade"   (bare data-reveal = fade)
 *   data-reveal-delay="0.15"   optional stagger offset in seconds (lines / words / mask only —
 *                              editorial grids that want a hand-placed stagger instead of the
 *                              natural scroll order; "fade" already staggers via ScrollTrigger.batch)
 * so section authors never touch GSAP for the common cases.
 */
export function initReveals(root) {
  const q = (sel) => [...root.querySelectorAll(sel)];
  const delayOf = (el) => Number(el.dataset.revealDelay) || 0;
  q('[data-reveal="lines"]').forEach((el) => revealLines(el, { delay: delayOf(el) }));
  q('[data-reveal="words"]').forEach((el) => revealLines(el, { type: 'words', delay: delayOf(el) }));
  q('[data-reveal="scrub-words"]').forEach((el) => wordIllumination(el));
  q('[data-reveal="mask"]').forEach((el) => revealMask(el, { delay: delayOf(el) }));
  const fades = q('[data-reveal=""], [data-reveal="fade"]');
  if (fades.length) revealFade(fades);
}
