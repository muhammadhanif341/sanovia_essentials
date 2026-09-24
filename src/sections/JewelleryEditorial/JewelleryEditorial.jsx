import { Container, Grid, GridItem, Section } from '@/components/layout/primitives';
import { Heading, Overline, Text } from '@/components/ui/Typography';
import { TextLink } from '@/components/ui/TextLink';
import { ShapeMedia } from '@/components/media/ShapeMedia';
import { getProductsByCategory } from '@/services/productRepository';
import './jewelleryEditorial.css';

/**
 * Jewellery Editorial — the plum surface reserved for exactly this passage (tokens.css).
 * Motion: editorial stagger — heading lines, then the two photos wipe in on a hand-placed
 * offset (data-reveal-delay) rather than all at once, so the composition reads in sequence.
 */
export function JewelleryEditorial() {
  const real = getProductsByCategory('jewellery').slice(0, 2);
  const [first, second] = [
    real[0] ?? { images: {}, name: 'Necklace or pendant' },
    real[1] ?? { images: {}, name: 'Ring or bracelet' },
  ];

  return (
    <Section surface="plum" aria-labelledby="jewellery-title">
      <Container>
        <Grid className="jewel__grid">
          <GridItem span={{ base: 4, md: 8, lg: 6 }} row={{ lg: 1 }} className="jewel__copy">
            <Overline accent data-reveal="fade">
              Jewellery
            </Overline>
            <Heading level={2} size="h1" id="jewellery-title" data-reveal="lines">
              Delicate enough to <em>forget</em> you&rsquo;re wearing it.
            </Heading>
            <Text size="body-l" muted className="t-measure" data-reveal="fade" data-reveal-delay="0.1">
              Layered chains, small pendants and thin gold-tone bands — pieces built for every day, styled to be worn
              two or three at once.
            </Text>
            <div data-reveal="fade" data-reveal-delay="0.15">
              <TextLink to="/shop/jewellery">Explore jewellery</TextLink>
            </div>
          </GridItem>

          <GridItem span={{ base: 4, md: 4, lg: 3 }} start={{ lg: 8 }} row={{ lg: 1 }} className="jewel__media jewel__media--a">
            <ShapeMedia
              id={first.images?.primary}
              shape="oval"
              ratio="4 / 5"
              tone="plum"
              reveal
              placeholderLabel="Jewellery photo needed"
              placeholderSpec={first.name}
              alt={first.name}
            />
          </GridItem>
          <GridItem span={{ base: 4, md: 4, lg: 3 }} start={{ lg: 10 }} row={{ lg: 1 }} className="jewel__media jewel__media--b">
            <ShapeMedia
              id={second.images?.primary}
              shape="arch"
              ratio="4 / 5"
              tone="plum"
              reveal
              data-reveal-delay="0.25"
              placeholderLabel="Jewellery photo needed"
              placeholderSpec={second.name}
              alt={second.name}
            />
          </GridItem>
        </Grid>
      </Container>
    </Section>
  );
}
