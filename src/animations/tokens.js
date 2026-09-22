/** Motion tokens (DESIGN-BLUEPRINT §7.1). CSS mirrors durations in styles/tokens.css. */

export const dur = { fast: 0.2, base: 0.4, slow: 0.7, cine: 1.2, epic: 1.8 };

// Built-in eases only: `expo.out` ≈ cubic-bezier(.16,1,.3,1), `expo.inOut` ≈ (.87,0,.13,1).
export const ease = { out: 'expo.out', soft: 'power3.out', inOut: 'expo.inOut', scrub: 'none' };

export const stagger = { s: 0.04, m: 0.08, l: 0.14 };

/** Reveal travel distances in px. */
export const dist = { s: 16, m: 40, l: 80 };

export const start = {
  enter: 'top 85%', // reveal when the element's top crosses 85% of the viewport
  enterMedia: 'top 88%',
};
