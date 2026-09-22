/**
 * Scroll "stages": horizontal scrolling and pinned storytelling.
 *
 * STICKY-FIRST (DESIGN-BLUEPRINT §7.6). Instead of ScrollTrigger `pin: true`
 * (which injects a pin-spacer and can jitter in dynamic-toolbar mobile browsers),
 * the wrapper is made tall in CSS and a `position: sticky` stage rides inside it;
 * ScrollTrigger only scrubs a timeline against the wrapper's progress.
 *
 * PROGRESSIVE ENHANCEMENT. Without the `data-hscroll="active"` / `data-stage="active"`
 * attribute the same markup is a native scroll-snap carousel / stacked steps. The
 * attribute is set ONLY inside the `full`/`tabletUp` matchMedia branch and removed on
 * cleanup, so touch, reduced-motion and narrow screens get the native layout.
 */
import { gsap } from '../register';
import { ease } from '../tokens';

/**
 * Horizontal scroll driven by vertical scroll.
 *
 * Markup contract (see components/motion/HorizontalScroller.jsx):
 *   [data-hscroll]                 wrapper (gets tall while active)
 *     [data-hscroll-stage]         sticky viewport-high stage
 *       [data-hscroll-track]       the row that translates
 *         [data-hscroll-item] …
 *
 * @returns {{ teardown: () => void, scrollToIndex: (i:number) => void, currentIndex: () => number, count: number }}
 */
export function horizontalScroll(wrapper, { onProgress } = {}) {
  const stage = wrapper.querySelector('[data-hscroll-stage]');
  const track = wrapper.querySelector('[data-hscroll-track]');
  const items = [...wrapper.querySelectorAll('[data-hscroll-item]')];

  wrapper.dataset.hscroll = 'active';

  let progress = 0;
  const distance = () => Math.max(0, track.scrollWidth - stage.clientWidth);
  // Runs BEFORE ScrollTrigger measures: size the wrapper so the sticky stage has
  // exactly `distance` px of vertical runway.
  const sizeRunway = () => wrapper.style.setProperty('--hscroll-distance', `${distance()}px`);
  sizeRunway();

  const tween = gsap.to(track, {
    x: () => -distance(),
    ease: ease.scrub,
    scrollTrigger: {
      trigger: wrapper,
      start: 'top top',
      end: () => `+=${distance()}`,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onRefreshInit: sizeRunway,
      onUpdate: (self) => {
        progress = self.progress;
        wrapper.style.setProperty('--hscroll-progress', self.progress.toFixed(4));
        onProgress?.(self.progress);
      },
    },
  });

  /** Move the window scroll so item `i` is at the start of the stage. */
  const scrollToIndex = (i) => {
    const st = tween.scrollTrigger;
    const item = items[Math.max(0, Math.min(items.length - 1, i))];
    if (!st || !item) return;
    const x = Math.min(item.offsetLeft, distance());
    const y = st.start + (distance() ? x / distance() : 0) * (st.end - st.start);
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  /** Index of the item currently nearest the start of the stage. */
  const currentIndex = () => {
    const x = progress * distance();
    let best = 0;
    items.forEach((item, i) => {
      if (Math.abs(item.offsetLeft - x) < Math.abs(items[best].offsetLeft - x)) best = i;
    });
    return best;
  };

  // Keyboard/AT: focusing an offscreen card must bring it into view. The stage is
  // `overflow: clip` (cannot be scrolled by focus), so we scroll the WINDOW instead.
  const onFocusIn = (e) => {
    const item = e.target.closest?.('[data-hscroll-item]');
    if (item) scrollToIndex(items.indexOf(item));
  };
  track.addEventListener('focusin', onFocusIn);

  return {
    count: items.length,
    scrollToIndex,
    currentIndex,
    teardown: () => {
      track.removeEventListener('focusin', onFocusIn);
      delete wrapper.dataset.hscroll;
      wrapper.style.removeProperty('--hscroll-distance');
      wrapper.style.removeProperty('--hscroll-progress');
    },
  };
}

/**
 * Pinned scroll story: one scrubbed timeline across `steps` viewport-heights.
 *
 * Markup contract (components/motion/StickyStage.jsx):
 *   [data-stage] style="--stage-steps: N"     wrapper (height = N × 100svh while active)
 *     [data-stage-sticky]                      sticky stage
 *
 * `build(tl, { stage })` receives an EMPTY timeline of unit duration per step; add
 * tweens at positions 0…steps. Frames should be stills crossfading (light, robust),
 * not video/canvas scrubbing.
 *
 * @returns {() => void} teardown
 */
export function stickyStage(wrapper, build, { scrub = 0.8 } = {}) {
  const stage = wrapper.querySelector('[data-stage-sticky]');
  wrapper.dataset.stage = 'active';

  const tl = gsap.timeline({
    defaults: { ease: ease.scrub },
    scrollTrigger: { trigger: wrapper, start: 'top top', end: 'bottom bottom', scrub },
  });
  build(tl, { stage });

  return () => {
    delete wrapper.dataset.stage;
  };
}
