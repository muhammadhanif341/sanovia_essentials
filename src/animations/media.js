/**
 * Media-query contracts shared by JS animation and CSS.
 * Breakpoints MUST match the @media rules in styles/tokens.css + layout.css.
 */
export const BP = { md: 768, lg: 1024, xl: 1440 };

/**
 * gsap.matchMedia conditions. Each key becomes a boolean in `ctx.conditions`.
 *   full      laptop/desktop with motion allowed  → pinned/sticky, parallax, cursor FX
 *   tabletUp  ≥768 with motion allowed            → sticky stories on tablets too
 *   light     <1024 with motion allowed           → reduced-intensity choreography
 *   motion    motion allowed at any width
 *   reduce    prefers-reduced-motion              → no motion; content simply present
 *   fine      mouse-like pointer                  → hover-dependent effects
 *   coarse    touch                               → never rely on hover
 * (`(pointer: coarse)` is independent of width: an iPad Pro is ≥1024 AND coarse.)
 */
export const MQ = {
  full: `(min-width: ${BP.lg}px) and (prefers-reduced-motion: no-preference)`,
  tabletUp: `(min-width: ${BP.md}px) and (prefers-reduced-motion: no-preference)`,
  light: `(max-width: ${BP.lg - 0.02}px) and (prefers-reduced-motion: no-preference)`,
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  fine: '(hover: hover) and (pointer: fine)',
  coarse: '(pointer: coarse)',
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(MQ.reduce).matches;
