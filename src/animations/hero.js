/**
 * Cinematic hero choreography (Phase 3). Two independent pieces that a hero section wires up
 * with data attributes — the section itself never touches GSAP:
 *
 *   heroIntro(root)                  load sequence, time-based; interactive from t = 0
 *   heroExit(root, next, options)    scroll-scrubbed hand-off to the next section
 *
 * Data-attribute contract (all optional; missing ones are skipped):
 *   [data-hero-veil]      full-bleed dark layer that lifts to reveal the film
 *   [data-hero-media]     wrapper the INTRO scales (1.16 → 1)          — intro owns this `scale`
 *   [data-hero-plate]     wrapper the SCROLL scales/drifts on exit      — scroll owns this `scale`
 *   [data-hero-glow]      the lamp (see <LampGlow/>)
 *   [data-hero-headline]  the h1 — split into masked lines
 *   [data-hero-fade]      overline, lede, controls — fade up in sequence
 *   [data-hero-cta]       primary/secondary actions — rise + settle, staggered
 *   [data-hero-rule]      hairline that draws left → right
 *   [data-hero-detail]    (legacy) an ShapeMedia mask reveal — used by the style-guide motion lab
 *   [data-hero-content]   the text block; lifts and fades while exiting
 *   [data-hero-dim]       overlay whose opacity dims the film while exiting
 *   [data-hero-cue]       scroll cue; the first thing to leave
 *
 * Two wrappers (media / plate) exist because both animate `scale`; on ONE element the scrub
 * tween's start value would be read while the intro is still mid-flight and the two would fight.
 *
 * Everything is created inside the caller's gsap.matchMedia() context, so it is reverted on
 * unmount / breakpoint change / reduced-motion flip. Callers gate on reduced motion.
 */
import { gsap, ScrollTrigger } from './register';
import { dur, ease, stagger, dist } from './tokens';
import { revealLines, revealMask } from './primitives/reveal';

export function heroIntro(root) {
  const q = (sel) => [...root.querySelectorAll(sel)];
  const [headline] = q('[data-hero-headline]');
  const [glow] = q('[data-hero-glow]');
  const veil = q('[data-hero-veil]');
  const media = q('[data-hero-media]');
  const detail = q('[data-hero-detail]');
  const fades = q('[data-hero-fade]');
  const ctas = q('[data-hero-cta]');
  const rules = q('[data-hero-rule]');

  const tl = gsap.timeline({ defaults: { ease: ease.out } });

  // 1. The room lights up: the dark veil lifts while the film settles from a slow push-in.
  //    Poster frame = film frame 1, so playback starting underneath is invisible.
  if (veil.length) tl.fromTo(veil, { autoAlpha: 1 }, { autoAlpha: 0, duration: 1.5, ease: 'power2.inOut' }, 0);
  if (media.length) tl.fromTo(media, { scale: 1.16 }, { scale: 1, duration: 3.4, ease: 'expo.out' }, 0);
  if (glow) tl.fromTo(glow, { opacity: 0 }, { opacity: 1, duration: 2.2, ease: 'power2.out' }, 0.5);

  // 2. Headline: SplitText owns its own (re-splittable) masked-line tween, so start it independently.
  if (headline) revealLines(headline, { immediate: true, delay: 0.55 });
  detail.forEach((el) => tl.add(revealMask(el, { immediate: true }), 0.5));

  // 3. Supporting copy fades up behind the headline…
  if (fades.length) {
    tl.from(fades, { autoAlpha: 0, y: dist.s, duration: dur.slow * 1.2, stagger: 0.14, immediateRender: true }, 1.05);
  }
  // …then the actions rise and settle (a hair of scale so they feel placed, not slid), and the rule draws.
  if (ctas.length) {
    tl.from(
      ctas,
      { autoAlpha: 0, y: dist.m, scale: 0.94, duration: dur.cine, stagger: stagger.l, ease: 'expo.out', immediateRender: true },
      1.35
    );
  }
  if (rules.length) {
    tl.fromTo(rules, { scaleX: 0 }, { scaleX: 1, transformOrigin: '0% 50%', duration: dur.cine * 1.4, ease: 'expo.inOut' }, 1.2);
  }
  return tl;
}

/**
 * Hand-off: as `next` (the following section) rises over the hero, the film pushes in slightly
 * and dims, and the copy lifts away — one scrubbed timeline over exactly one viewport of scroll
 * (`next` top: viewport bottom → viewport top).
 *
 * The hero is `position: sticky`, so nothing scrolls the hero away; the next section slides OVER it.
 * `onCovered(true)` fires once the hero is completely covered (so the film can be paused);
 * `onCovered(false)` when it becomes visible again. Also called on every refresh, so a page
 * restored deep down the document starts in the right state.
 */
export function heroExit(root, next, { onCovered, scrub = 0.6 } = {}) {
  if (!next) return undefined;
  const q1 = (sel) => root.querySelector(sel);
  const plate = q1('[data-hero-plate]');
  const dim = q1('[data-hero-dim]');
  const content = q1('[data-hero-content]');
  const cues = [...root.querySelectorAll('[data-hero-cue], [data-hero-rail]')];

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: next,
      start: 'top bottom',
      end: 'top top',
      scrub,
      onLeave: () => onCovered?.(true),
      onEnterBack: () => onCovered?.(false),
      onRefresh: (self) => onCovered?.(self.progress >= 1),
    },
  });

  // "subtle video scale": a slow push-in with a touch of upward drift (depth against the rising sheet)
  if (plate) tl.to(plate, { scale: 1.1, yPercent: -3, duration: 1 }, 0);
  if (dim) tl.fromTo(dim, { opacity: 0 }, { opacity: 0.78, duration: 1 }, 0);
  if (content) {
    tl.to(content, { yPercent: -16, duration: 1 }, 0);
    tl.to(content, { opacity: 0, duration: 0.55, ease: 'power1.in' }, 0);
  }
  if (cues.length) tl.to(cues, { opacity: 0, duration: 0.14 }, 0);
  return tl;
}

/**
 * Covered-state only (no animation): used under reduced motion, where the scrubbed exit is
 * skipped but a film the visitor chose to play should still stop when it is hidden.
 */
export function heroCoverWatch(next, onCovered) {
  if (!next) return undefined;
  return ScrollTrigger.create({
    trigger: next,
    start: 'top top',
    end: 'max',
    onToggle: (self) => onCovered?.(self.isActive),
  });
}
