import { Container, Grid, GridItem, Section } from '@/components/layout/primitives';
import { Heading, Overline, Text } from '@/components/ui/Typography';
import { TextLink } from '@/components/ui/TextLink';
import { ShapeMedia } from '@/components/media/ShapeMedia';
import './brandStory.css';


/**
 * Brand Story — a teaser for /about (the full founder note + packing story), not a duplicate
 * of it. Motion: image reveal (ShapeMedia mask-wipe) on the packing/lifestyle still.
 */
export function BrandStory() {
  return (
    <Section surface="raised" aria-labelledby="story-title">
      <Container>
        <Grid className="story-teaser__grid">
          <GridItem span={{ base: 4, md: 8, lg: 5 }} className="story-teaser__copy">
            <Overline accent data-reveal="fade">
              The Sanovia story
            </Overline>
            <Heading level={2} size="h1" id="story-title" data-reveal="lines">
              Chosen by hand. Sent with a reply.
            </Heading>
            <Text size="body-l" muted className="t-measure" data-reveal="fade">
              Every piece is chosen before it is listed, wrapped at a kitchen table, and sent with a real reply — not
              a script. That is the whole approach, and it is not going to change as the drops get bigger.
            </Text>
            <div data-reveal="fade">
              <TextLink to="/about">Read the full story</TextLink>
            </div>
          </GridItem>

          <GridItem span={{ base: 4, md: 8, lg: 6 }} start={{ lg: 7 }} className="story-teaser__media">
            <ShapeMedia
              id="lifestyle/packing-table"
              shape="arch"
              ratio="4 / 5"
              tone="walnut"
              reveal
              placeholderLabel="Lifestyle photo needed"
              placeholderSpec="Hands wrapping an order, wood table, lamp glow"
              alt="An order being wrapped by hand"
            />
          </GridItem>
        </Grid>
      </Container>
    </Section>
  );
}
