import { Cluster, Container, Grid, GridItem, Section, Stack } from '@/components/layout/primitives';
import { PageHead } from '@/components/layout/PageHead';
import { Heading, Overline, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { ShapeMedia } from '@/components/media/ShapeMedia';
import { WhatsApp, Instagram, ArrowRight } from '@/components/icons';
import { site } from '@/data/site';
import { whatsappLink } from '@/utils/whatsapp';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/** About / brand story — the founder note and packing story teased from BrandStory.jsx. */
export default function Story() {
  useDocumentTitle('About', 'The story behind Sanovia Essentials — how pieces are chosen, and how every order is packed.');
  return (
    <>
      <PageHead overline="Sanovia" title="About Sanovia" />

      <Section surface="dark" pad="tight">
        <Container size="narrow">
          <Stack gap="var(--space-4)">
            <Text size="body-l" muted className="t-measure">
              Sanovia Essentials started with a simple frustration: watches and jewellery either cost more than they
              should, or looked exactly like everything else on the shelf. We wanted small-face cases and fine
              gold-tone pieces that felt considered — the kind of thing you reach for every day, not save for one
              occasion.
            </Text>
            <Text size="body-l" muted className="t-measure">
              No warehouse, no showroom, no sales team. Just a small, working catalogue, kept honest — real stock
              counts, real photography of the actual piece you&rsquo;ll receive, and prices that don&rsquo;t move
              depending on who&rsquo;s asking.
            </Text>
          </Stack>
        </Container>
      </Section>

      <Section surface="raised" aria-labelledby="about-choose-title">
        <Container>
          <Grid>
            <GridItem span={{ base: 4, md: 8, lg: 6 }}>
              <Overline accent>How we choose</Overline>
              <Heading level={2} size="h1" id="about-choose-title">
                Every piece earns its place.
              </Heading>
              <Text size="body-l" muted className="t-measure">
                Nothing is listed because a supplier had extra stock. Each case shape, each chain length, each clasp
                is picked first, worn ourselves for a few weeks, and only then added to the catalogue. If a piece
                doesn&rsquo;t hold up past the first month of actual wear, it doesn&rsquo;t go up for sale — that
                filter matters more to us than filling out the grid.
              </Text>
            </GridItem>
          </Grid>
        </Container>
      </Section>

      <Section surface="dark" aria-labelledby="about-pack-title">
        <Container>
          <Grid>
            <GridItem span={{ base: 4, md: 8, lg: 6 }} start={{ lg: 7 }} row={{ lg: 1 }}>
              <Overline accent>How we pack</Overline>
              <Heading level={2} size="h1" id="about-pack-title">
                Wrapped at a kitchen table, not a warehouse.
              </Heading>
              <Text size="body-l" muted className="t-measure">
                There&rsquo;s no fulfilment centre behind Sanovia — just a table, tissue paper, and someone checking
                the piece once more before it&rsquo;s boxed. Every order gets a real reply from a real person, not an
                automated one, because that&rsquo;s still what &ldquo;small&rdquo; is supposed to mean.
              </Text>
            </GridItem>
            <GridItem span={{ base: 4, md: 8, lg: 6 }} start={{ lg: 1 }} row={{ lg: 1 }}>
              <ShapeMedia
                id="lifestyle/packing-table"
                shape="arch"
                ratio="4 / 5"
                tone="walnut"
                reveal
                placeholderLabel="Lifestyle photo needed"
                placeholderSpec="Hands wrapping an order, wood table, lamp glow"
                alt="An order being wrapped by hand at a wood table"
              />
            </GridItem>
          </Grid>
        </Container>
      </Section>

      <Section surface="ivory" pad="tight" aria-labelledby="about-cta-title">
        <Container size="narrow">
          <Stack gap="var(--space-5)">
            <div>
              <Overline accent>Say hello</Overline>
              <Heading level={2} size="h2" id="about-cta-title">
                Questions before you order?
              </Heading>
              <Text size="body-l" muted className="t-measure">
                Ask about sizing, a strap swap, or when the next drop lands — message us directly, or follow along on
                Instagram.
              </Text>
            </div>
            <Cluster gap="var(--space-3)">
              <Button href={whatsappLink()} external iconBefore={<WhatsApp size={18} />}>
                Message us on WhatsApp
              </Button>
              <Button href={site.instagram.url} external variant="ghost" iconBefore={<Instagram size={18} />}>
                Follow @{site.instagram.handle}
              </Button>
              <Button to="/shop" variant="ghost" iconAfter={<ArrowRight size={18} />}>
                Shop the collection
              </Button>
            </Cluster>
          </Stack>
        </Container>
      </Section>
    </>
  );
}
