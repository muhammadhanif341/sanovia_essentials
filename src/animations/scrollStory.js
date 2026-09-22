/**
 * Cinematic Scroll Story — the one pinned stage on the landing page (budget: max 2 pinned
 * stages per DESIGN-BLUEPRINT §7.6; this is the only one). Built on the existing sticky-first
 * primitive (`primitives/scrollStages.js`) via <StickyStage build={scrollStoryBuild}>.
 *
 * Markup contract (see sections/ScrollStory): each frame is `[data-story-frame]`, a direct
 * child of the sticky stage. Frames crossfade + lift, one held per "step" of scroll — never
 * more than one frame visible at a time, so the story always reads as a single sequence.
 */
import { gsap } from './register';

export function scrollStoryBuild(tl, { stage }) {
  const frames = [...stage.querySelectorAll('[data-story-frame]')];
  if (!frames.length) return;

  gsap.set(frames, { autoAlpha: 0, y: 28 });
  gsap.set(frames[0], { autoAlpha: 1, y: 0 });

  frames.forEach((frame, i) => {
    if (i === 0) return;
    const at = i - 0.5; // hold each frame for ~1 step before crossfading to the next
    tl.to(frames[i - 1], { autoAlpha: 0, y: -28, duration: 0.5 }, at).fromTo(
      frame,
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, duration: 0.5 },
      at
    );
  });
}
