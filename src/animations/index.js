/** Public surface of the animation layer. Sections import from '@/animations'. */
export { gsap, ScrollTrigger, SplitText } from './register';
export { dur, ease, stagger, dist, start } from './tokens';
export { BP, MQ, prefersReducedMotion } from './media';
export { initRefreshPolicy, refreshScrollTriggers, refreshAfterImages } from './refresh';
export {
  revealLines,
  wordIllumination,
  revealMask,
  revealFade,
  initReveals,
} from './primitives/reveal';
export { initParallax, initScaleParallax } from './primitives/parallax';
export { initFrameSequence } from './primitives/frameSequence';
export { magnetic, lampGlow, cursorFollow } from './primitives/pointer';
export { horizontalScroll, stickyStage } from './primitives/scrollStages';
export { heroIntro, heroExit, heroCoverWatch } from './hero';
export { curtainExit, curtainEnter, curtainReset } from './pageTransition';
export { headerMotion } from './header';
export { menuTimeline } from './menu';
export { scrollStoryBuild } from './scrollStory';
