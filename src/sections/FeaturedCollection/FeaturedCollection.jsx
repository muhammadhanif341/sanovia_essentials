import { Container, Grid, GridItem, Section } from '@/components/layout/primitives';
import { Heading, Overline, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { TextLink } from '@/components/ui/TextLink';
import { Tag } from '@/components/ui/Tag';
import { ShapeMedia } from '@/components/media/ShapeMedia';
import { ArrowRight, WhatsApp } from '@/components/icons';
import { products } from '@/data/products';
import { whatsappLink } from '@/utils/whatsapp';
import './featuredCollection.css';

/**
 * Featured Collection — a single large spotlight rather than a grid (the brief merges this
 * conceptually with "the drop" model already in the data schema: Product.drop, /drops/:drop).
 * Motion: image + product reveal (ShapeMedia mask-wipe on the photo, fade on the copy).
 */
export function FeaturedCollection() {
  const drop01 = products.filter((p) => p.drop === '01');

  return (
    <Section surface="dark" aria-labelledby="featured-title">
      <Container className="featured">
        <Grid className="featured__grid">
          <GridItem span={{ base: 4, md: 8, lg: 7 }} className="featured__media">
            <Tag className="featured__tag" data-reveal="fade">
              Drop 01
            </Tag>
            <ShapeMedia
              id="editorial/drop-01-hero"
              shape="tonneau"
              ratio="4 / 5"
              tone="espresso"
              reveal
              placeholderLabel="Drop 01 photo needed"
              placeholderSpec="Watch or jewellery hero shot, 4:5"
              alt="A piece from Drop 01"
            />
          </GridItem>

          <GridItem span={{ base: 4, md: 8, lg: 4 }} start={{ lg: 9 }} className="featured__copy">
            <Overline accent data-reveal="fade">
              Featured collection
            </Overline>
            <Heading level={2} size="h1" id="featured-title" data-reveal="lines">
              The first drop.
            </Heading>

            {drop01.length ? (
              <>
                <Text size="body-l" muted data-reveal="fade">
                  {drop01.length} {drop01.length === 1 ? 'piece' : 'pieces'} now available.
                </Text>
                <div data-reveal="fade">
                  <Button to="/drops/01" iconAfter={<ArrowRight size={18} />}>
                    View Drop 01
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Text size="body-l" muted data-reveal="fade">
                  Drop 01 is being finalised — photography, pricing and stock are on the way. Message us and we will
                  let you know the moment it lands.
                </Text>
                <div className="featured__actions" data-reveal="fade">
                  <Button
                    href={whatsappLink("Hi Sanovia! Let me know when Drop 01 is available.")}
                    external
                    variant="ghost"
                    iconBefore={<WhatsApp size={18} />}
                  >
                    Get notified on WhatsApp
                  </Button>
                  <TextLink to="/drops/01">Preview the drop page</TextLink>
                </div>
              </>
            )}
          </GridItem>
        </Grid>
      </Container>
    </Section>
  );
}
