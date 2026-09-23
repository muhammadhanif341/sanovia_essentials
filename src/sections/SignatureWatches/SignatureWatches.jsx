import { Container, Grid, GridItem, Section } from '@/components/layout/primitives';
import { Heading, Overline, Text } from '@/components/ui/Typography';
import { TextLink } from '@/components/ui/TextLink';
import { ShapeMedia } from '@/components/media/ShapeMedia';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { ArrowUpRight } from '@/components/icons';
import { getProductsByCategory } from '@/services/productRepository';
import './signatureWatches.css';

const CASE_SHAPES = [
  { shape: 'tonneau', label: 'Tonneau case', amount: 10 },
  { shape: 'oval', label: 'Oval case', amount: 16 },
  { shape: 'rect', label: 'Rectangular case', amount: 12 },
];

/**
 * Signature Watches — a category teaser, not the catalogue grid (that's /shop/watches).
 * Motion: scale/parallax — each case settles from a soft zoom as it crosses the viewport
 * (data-scale-parallax), never a hover-only effect so it reads the same on touch.
 */
export function SignatureWatches() {
  const real = getProductsByCategory('watches').slice(0, 3);
  const items = real.length
    ? real.map((p, i) => ({
        id: p.images?.primary,
        shape: p.shape ?? CASE_SHAPES[i % 3].shape,
        amount: CASE_SHAPES[i % 3].amount,
        label: p.name,
        to: `/product/${p.slug}`,
      }))
    : CASE_SHAPES.map((c) => ({ id: null, ...c, to: '/shop/watches' }));

  return (
    <Section surface="raised" aria-labelledby="watches-title">
      <Container>
        <div className="watches__head">
          <Overline accent data-reveal="fade">
            Watches
          </Overline>
          <Heading level={2} size="h1" id="watches-title" data-reveal="lines">
            Signature watches.
          </Heading>
          <Text size="body-l" muted className="t-measure" data-reveal="fade">
            Small-face, retro gold-tone cases — tonneau, oval and rectangular — sized to be worn every day, not saved
            for an occasion.
          </Text>
        </div>

        <Grid className="watches__row">
          {items.map((item, i) => (
            <GridItem key={item.to + i} span={{ base: 4, md: 4, lg: 4 }} className="watches__item" data-index={i}>
              <TransitionLink to={item.to} className="watches__link">
                <ShapeMedia
                  id={item.id}
                  shape={item.shape}
                  ratio={item.shape === 'oval' ? '1 / 1' : '4 / 5'}
                  tone="walnut"
                  data-scale-parallax={item.amount}
                  placeholderLabel="Watch photo needed"
                  placeholderSpec={item.label}
                  alt={item.label}
                />
                <span className="watches__label t-body-l">
                  {item.label}
                  <ArrowUpRight size={16} />
                </span>
              </TransitionLink>
            </GridItem>
          ))}
        </Grid>

        <div className="watches__foot" data-reveal="fade">
          <TextLink to="/shop/watches">Explore all watches</TextLink>
        </div>
      </Container>
    </Section>
  );
}
