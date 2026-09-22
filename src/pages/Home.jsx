import { useRef } from 'react';
import {
  Hero,
  BrandIntro,
  FeaturedCollection,
  SignatureWatches,
  JewelleryEditorial,
  ScrollStory,
  CollectionShowcase,
  BestSellers,
  BrandStory,
  Reviews,
  Social,
  Newsletter,
} from '@/sections';
import { usePageMotion } from '@/hooks/useSectionMotion';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/**
 * Home = the full landing page (Phase 3: hero + navigation; Phase 4: everything below it).
 *
 * Structure matters for the hero hand-off: <Hero/> is `position: sticky`, and its next sibling
 * (<BrandIntro/>, which renders the `.sv-sheet` surface) slides over it — `useHeroIntro` finds
 * it as `nextElementSibling`. Both are wrapped in `.hero-stage`, which is not just grouping:
 * a `position: sticky` element stays sticky-eligible for the full height of its CONTAINING
 * BLOCK. Without this inner wrapper, that containing block would be the whole page (every
 * section below), so the hero would still be sticky-eligible thousands of pixels down and
 * could paint over any later section that isn't itself positioned with a higher stacking
 * order. Scoping the wrapper to just hero+sheet keeps the hero's sticky range exactly what
 * Phase 3 verified — it un-stickies for good once the sheet has fully passed.
 *
 * Every section below reads its own motion from data-reveal / data-parallax / data-scale-parallax
 * attributes, wired once here via usePageMotion — sections themselves stay declarative. The two
 * exceptions (ScrollStory's pinned stage, CollectionShowcase's horizontal scroller) manage their
 * own ScrollTrigger internally and just need to be mounted.
 */
export default function Home() {
  const ref = useRef(null);
  usePageMotion(ref);
  useDocumentTitle('');

  return (
    <div ref={ref}>
      <div className="hero-stage">
        <Hero />
        <BrandIntro />
      </div>
      <FeaturedCollection />
      <SignatureWatches />
      <JewelleryEditorial />
      <ScrollStory />
      <CollectionShowcase />
      <BestSellers />
      <BrandStory />
      <Reviews />
      <Social />
      <Newsletter />
    </div>
  );
}
