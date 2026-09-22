import { Container, Grid, GridItem } from '@/components/layout/primitives';
import { Heading, Overline, Text } from '@/components/ui/Typography';
import { TextLink } from '@/components/ui/TextLink';
import './brandIntro.css';

/**
 * Brand Introduction — the "sheet" that rises over the sticky hero (see sections/Hero/hero.css
 * → .sv-sheet). Pure typography, deliberately: the hand-off from a full-bleed film to a quiet
 * light surface IS the composition; a second image here would compete with the hero's.
 *
 * Motion: text reveal only (data-reveal="lines" / "fade"), wired by the page-level usePageMotion
 * that already scopes the whole Home tree — this component itself touches no GSAP.
 */
export function BrandIntro() {
  return (
    <section className="sv-sheet brand-intro" data-surface="ivory" aria-labelledby="brand-intro-title">
      <Container>
        <Grid className="brand-intro__grid">
          <GridItem span={{ base: 4, md: 7, lg: 7 }} className="brand-intro__copy">
            <Overline accent data-reveal="fade">
              Sanovia Essentials
            </Overline>
            <Heading level={2} size="display-l" id="brand-intro-title" data-reveal="lines">
              Made to be worn, not <em>saved</em>.
            </Heading>
            <Text size="body-l" muted className="t-measure" data-reveal="fade">
              Small-face watches and delicate gold-tone jewellery for every day — chosen one piece at a time, and
              ordered with a single message on WhatsApp. No showroom, no minimum order, no pressure.
            </Text>
            <div className="brand-intro__links" data-reveal="fade">
              <TextLink to="/shop">Explore the shop</TextLink>
              <TextLink to="/about">Our approach</TextLink>
            </div>
          </GridItem>

          <GridItem span={{ lg: 4 }} start={{ lg: 9 }} className="brand-intro__mark" aria-hidden="true">
            <span className="t-numeral">01</span>
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
}
