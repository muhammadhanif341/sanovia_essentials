import { Container, Grid, GridItem, Section } from '@/components/layout/primitives';
import { PageHead } from '@/components/layout/PageHead';
import { Heading, Text } from '@/components/ui/Typography';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { ShapeMedia } from '@/components/media/ShapeMedia';
import { ArrowUpRight } from '@/components/icons';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/** Every real way to browse the catalogue today — one named drop, plus the standing category
 * and demand-driven views. New collections appear here as they're curated; nothing invented. */
const COLLECTIONS = [
  {
    to: '/drops/01',
    label: 'Drop 01',
    copy: 'The first curated drop — a signature watch, an everyday case, and the necklace-and-cuff pairing that opened the jewellery line.',
    shape: 'tonneau',
    id: 'editorial/drop-01-hero',
  },
  {
    to: '/shop/watches',
    label: 'Watches',
    copy: 'Tonneau, oval and rectangular cases in brushed steel and gold-tone finishes.',
    shape: 'oval',
    id: 'products/tonneau-signature-watch/front',
  },
  {
    to: '/shop/jewellery',
    label: 'Jewellery',
    copy: 'Layered chains, small pendants and thin gold-tone bands, built to be worn two or three at once.',
    shape: 'arch',
    id: 'products/layered-chain-necklace/front',
  },
  {
    to: '/shop/best-sellers',
    label: 'Best Sellers',
    copy: 'The pieces asked for most often — set by real demand, never an invented ranking.',
    shape: 'rect',
    id: 'products/huggie-hoop-earrings/front',
  },
  {
    to: '/shop/new-arrivals',
    label: 'New Arrivals',
    copy: "What's just landed, before it settles into a permanent drop.",
    shape: 'pill',
    id: 'products/circle-rose-gold-watch/front',
  },
];

export default function Collections() {
  useDocumentTitle('Collections', 'Sanovia Essentials collections — small, considered drops of watches and jewellery.');
  return (
    <>
      <PageHead overline="Sanovia" title="Collections">
        <Text size="body-l" muted className="t-measure">
          Every way to browse Sanovia today — one named drop, the two standing categories, and the pieces real
          demand has already sorted for you.
        </Text>
      </PageHead>
      <Section surface="dark" pad="tight">
        <Container>
          <Grid>
            {COLLECTIONS.map((c) => (
              <GridItem key={c.to} span={{ base: 4, md: 4, lg: 4 }}>
                <TransitionLink to={c.to} className="sv-stack" style={{ '--gap': 'var(--space-3)' }}>
                  <ShapeMedia
                    id={c.id}
                    shape={c.shape}
                    ratio={c.shape === 'oval' ? '1 / 1' : '4 / 5'}
                    tone="cream"
                    reveal
                    placeholderLabel="Photo needed"
                    placeholderSpec={c.label}
                    alt={c.label}
                  />
                  <Heading level={3} size="h3" className="sv-cluster" style={{ '--gap': 'var(--space-2)' }}>
                    {c.label}
                    <ArrowUpRight size={16} />
                  </Heading>
                  <Text size="small" muted>
                    {c.copy}
                  </Text>
                </TransitionLink>
              </GridItem>
            ))}
          </Grid>
        </Container>
      </Section>
    </>
  );
}
