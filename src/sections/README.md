# src/sections — landing-page sections (Phase 3)

Intentionally empty in Phase 2. Each home-page section from `DESIGN-BLUEPRINT.md` §6.2 becomes one
file here (`Hero.jsx`, `Statement.jsx`, `DropOne.jsx`, `Closer.jsx`, `OnVelvet.jsx`, `PackedByHand.jsx`,
`Catalogue.jsx`, `Notes.jsx`, `OnTheTable.jsx`, `OrderEasy.jsx`) and is composed by `pages/Home.jsx`.

## How a section is built (the contract)

1. Wrap in `<Section surface="…">` + `<Container>` — the surface supplies all colour tokens.
2. Compose from `components/` (ShapeMedia, ProductCard, HorizontalScroller, StickyStage, Marquee…).
3. Opt into motion with **data attributes**, then one hook on the section root:
   ```jsx
   const ref = useRef(null);
   usePageMotion(ref);                 // data-reveal="lines|words|scrub-words|mask|fade", data-parallax
   // hero only: useHeroIntro(ref)     // data-hero-headline / -media / -detail / -fade / -glow
   ```
4. Never call `gsap.*` directly in a component body. New choreography goes in
   `src/animations/` as a primitive that runs inside `useMotion` — that is what guarantees cleanup.
5. Content must be complete and readable with motion off (reduced motion renders it as-is).
