import { useMemo } from 'react';
import { Container, Grid, GridItem, Section } from '@/components/layout/primitives';
import { Heading, Overline, Text } from '@/components/ui/Typography';
import { TextLink } from '@/components/ui/TextLink';
import { ShapeMedia } from '@/components/media/ShapeMedia';
import { getProductsByCategory } from '@/services/productRepository';
import { cn } from '@/utils/cn';
import './shopHero.css';

/**
 * Editorial category hero for /shop/watches and /shop/jewellery — replaces the bare
 * "Shop / Watches" PageHead + dead space with a real spotlight, deliberately different in
 * composition per category (single tonneau case vs. a staggered jewellery pair, mirrored
 * left/right) rather than a cloned template. Uses real catalogue photography only — no new
 * imagery introduced. See docs/ARCHITECTURE.md for the brief this answers.
 */
const COPY = {
  watches: {
    overline: 'Watches',
    heading: (
      <>
        Small cases, worn <em>every day</em>.
      </>
    ),
    body: 'Tonneau, oval and rectangular cases in brushed steel and gold-tone finishes — built small enough to layer, precise enough to wear alone.',
    surface: 'raised',
    mediaTone: 'walnut',
  },
  jewellery: {
    overline: 'Jewellery',
    heading: (
      <>
        Pieces made to be <em>layered</em>.
      </>
    ),
    body: 'Layered chains, small pendants and thin gold-tone bands — styled two or three at once, never precious enough to save for later.',
    surface: 'plum',
    mediaTone: 'plum',
  },
};

function scrollToGrid(e) {
  e.preventDefault();
  document.getElementById('sv-shop-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function CategoryHero({ category, count }) {
  const copy = COPY[category];
  const pieces = useMemo(() => getProductsByCategory(category).slice(0, 2), [category]);
  if (!copy) return null;

  return (
    <Section
      surface={copy.surface}
      pad="flush"
      className={cn('sv-cat-hero', `sv-cat-hero--${category}`)}
      aria-labelledby="cat-hero-title"
    >
      <Container>
        <Grid className="sv-cat-hero__grid">
          {category === 'watches' ? (
            <GridItem span={{ base: 4, md: 8, lg: 7 }} className="sv-cat-hero__media">
              <ShapeMedia
                id={pieces[0]?.images?.primary}
                shape="tonneau"
                ratio="4 / 5"
                tone={copy.mediaTone}
                reveal
                placeholderLabel="Watch photo needed"
                placeholderSpec={pieces[0]?.name}
                alt={pieces[0]?.name ?? 'A Sanovia watch'}
              />
            </GridItem>
          ) : (
            <>
              <GridItem span={{ base: 4, md: 4, lg: 3 }} start={{ lg: 6 }} className="sv-cat-hero__media sv-cat-hero__media--a">
                <ShapeMedia
                  id={pieces[0]?.images?.primary}
                  shape="oval"
                  ratio="4 / 5"
                  tone={copy.mediaTone}
                  reveal
                  placeholderLabel="Jewellery photo needed"
                  placeholderSpec={pieces[0]?.name}
                  alt={pieces[0]?.name ?? 'A Sanovia jewellery piece'}
                />
              </GridItem>
              <GridItem span={{ base: 4, md: 4, lg: 3 }} start={{ lg: 8 }} className="sv-cat-hero__media sv-cat-hero__media--b">
                <ShapeMedia
                  id={pieces[1]?.images?.primary}
                  shape="arch"
                  ratio="4 / 5"
                  tone={copy.mediaTone}
                  reveal
                  data-reveal-delay="0.15"
                  placeholderLabel="Jewellery photo needed"
                  placeholderSpec={pieces[1]?.name}
                  alt={pieces[1]?.name ?? 'A Sanovia jewellery piece'}
                />
              </GridItem>
            </>
          )}

          <GridItem
            span={{ base: 4, md: 8, lg: 4 }}
            start={{ lg: category === 'watches' ? 9 : 1 }}
            className="sv-cat-hero__copy"
          >
            <Overline accent data-reveal="fade">
              {copy.overline}
            </Overline>
            <Heading level={1} size="h1" id="cat-hero-title" data-reveal="lines">
              {copy.heading}
            </Heading>
            <Text size="body-l" muted className="t-measure" data-reveal="fade" data-reveal-delay="0.1">
              {copy.body}
            </Text>
            <p className="sv-cat-hero__meta t-overline" data-reveal="fade" data-reveal-delay="0.15">
              {count} {count === 1 ? 'piece' : 'pieces'}
            </p>
            <div data-reveal="fade" data-reveal-delay="0.2">
              <TextLink href="#sv-shop-grid" onClick={scrollToGrid}>
                View the collection
              </TextLink>
            </div>
          </GridItem>
        </Grid>
      </Container>
    </Section>
  );
}
