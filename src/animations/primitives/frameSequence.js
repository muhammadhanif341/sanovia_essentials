/**
 * Scroll-scrubbed image sequence (client-directed): pins a tall wrapper and maps scroll
 * progress DIRECTLY to a frame index, drawn into a <canvas>. Apple-style product-reveal
 * pattern. Deliberate exception to `stickyStage()` (primitives/scrollStages.js), whose own
 * doc comment says pinned-story frames "should be stills crossfading, not video/canvas
 * scrubbing" — that guidance still holds for every OTHER pinned section; the Hero is the one
 * brief-directed exception, with its own primitive rather than bending the general-purpose one.
 *
 * Contract:
 *   wrapper   the pinned (CSS `position: sticky`) element the ScrollTrigger starts from —
 *             this fn never touches its layout/height, only reads it
 *   canvas    absolutely positioned, fills its parent — sized here via ResizeObserver
 *   runway    the inert sibling spacer (`.sv-hero__runway`, hero.css) whose length IS the
 *             scrub distance — see hero.css's architecture note for why the scrub distance
 *             has to be measured against a plain sibling rather than `wrapper`'s own height
 *
 * Frames are preloaded with bounded concurrency, ordered from the first. Scrubbing clamps to
 * the highest CONTIGUOUSLY-loaded frame, so a fast scroll on a slow connection holds the last
 * real frame instead of flashing blank canvas — it never invents a frame that hasn't arrived,
 * which is what keeps this flicker-free without gating all interaction behind a spinner.
 *
 * `scrub` (a number, not `true`) gives GSAP's own catch-up smoothing on `self.progress` even
 * though there is no attached tween/timeline — the documented, canonical way to pair
 * ScrollTrigger with a canvas draw loop. That smoothing is what keeps the discrete frame swap
 * reading as continuous motion rather than a slideshow at a moderate frame count.
 *
 * @param {HTMLElement} wrapper
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLElement} runway
 * @param {string[]} urls
 * @param {object} [o]
 * @param {number} [o.focalX=0.5]   cover-fit anchor, 0–1
 * @param {number} [o.focalY=0.5]
 * @param {number} [o.concurrency=6]
 * @param {number} [o.scrub=0.35]
 * @returns {() => void} teardown
 */
import { ScrollTrigger } from '../register';

export function initFrameSequence(wrapper, canvas, runway, urls, { focalX = 0.5, focalY = 0.5, concurrency = 6, scrub = 0.35 } = {}) {
  if (!wrapper || !canvas || !runway || !urls.length) return () => {};

  const ctx = canvas.getContext('2d');
  const images = urls.map(() => new Image());
  const loaded = new Array(urls.length).fill(false);
  let maxLoaded = -1; // highest index loaded with no gaps before it — the safe "reach" for scrubbing
  let drawn = -1;
  const dpr = Math.min(window.devicePixelRatio || 1, 2); // capped: mobile GPUs don't need more
  let cssW = 0;
  let cssH = 0;

  const draw = (i) => {
    const img = images[i];
    if (!img?.naturalWidth || !cssW || !cssH) return;
    // object-fit: cover, computed by hand (canvas has no CSS object-fit equivalent).
    const scale = Math.max(cssW / img.naturalWidth, cssH / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const dx = (cssW - w) * focalX;
    const dy = (cssH - h) * focalY;
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.drawImage(img, dx, dy, w, h);
    drawn = i;
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    cssW = rect.width;
    cssH = rect.height;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (drawn >= 0) draw(drawn);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const advanceMaxLoaded = () => {
    while (maxLoaded + 1 < loaded.length && loaded[maxLoaded + 1]) maxLoaded++;
  };

  let cursor = 0;
  const loadNext = () => {
    if (cursor >= urls.length) return;
    const i = cursor++;
    const img = images[i];
    img.decoding = 'async';
    const settle = () => {
      loaded[i] = true;
      advanceMaxLoaded();
      if (i === 0) draw(0); // first frame: paint the instant it lands, don't wait on the pool
      loadNext();
    };
    img.onload = settle;
    img.onerror = settle; // one bad frame shouldn't stall the whole sequence
    img.src = urls[i];
  };
  for (let n = 0; n < Math.min(concurrency, urls.length); n++) loadNext();

  const st = ScrollTrigger.create({
    trigger: wrapper,
    start: 'top top',
    endTrigger: runway,
    end: 'bottom bottom',
    scrub,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      if (maxLoaded < 0) return;
      const target = Math.round(self.progress * (urls.length - 1));
      const i = Math.min(target, maxLoaded);
      if (i !== drawn) draw(i);
    },
  });

  return () => {
    st.kill();
    ro.disconnect();
    images.forEach((img) => {
      img.onload = null;
      img.onerror = null;
      img.src = '';
    });
  };
}
