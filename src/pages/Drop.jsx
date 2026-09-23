import { useParams } from 'react-router-dom';
import { Container, Grid, GridItem, Section } from '@/components/layout/primitives';
import { PageHead } from '@/components/layout/PageHead';
import { Heading, Overline, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { ShapeMedia } from '@/components/media/ShapeMedia';
import { ProductGrid } from '@/components/product/ProductGrid';
import { WhatsApp } from '@/components/icons';
import { getProductsByDrop } from '@/services/productRepository';
import { whatsappLink } from '@/utils/whatsapp';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/** Editorial hero copy per drop number — Drop 01 is the only drop that has shipped so far. */
const DROP_COPY = {
  '01': {
    heading: 'The first drop.',
    body: 'Four pieces chosen to open the catalogue — a signature two-tone watch, an everyday steel case, and the necklace-and-cuff pairing that started the jewellery line. Small on purpose: easier to get exactly right.',
    mediaId: 'editorial/drop-01-hero',
  },
};

export default function Drop() {
  const { drop } = useParams();
  const title = `Drop ${drop}`;
  const pieces = getProductsByDrop(drop);
  const copy = DROP_COPY[drop];
  useDocumentTitle(title, `${title} at Sanovia Essentials.`);

  return (
    <>
      {copy ? (
        <Section surface="dark" pad="flush" aria-labelledby="drop-title">
          <Container>
            <Grid>
              <GridItem span={{ base: 4, md: 8, lg: 7 }}>
                <Tag>Drop {drop}</Tag>
                <ShapeMedia
                  id={copy.mediaId}
                  shape="tonneau"
                  ratio="4 / 5"
                  tone="espresso"
                  reveal
                  placeholderLabel={`Drop ${drop} photo needed`}
                  placeholderSpec="Watch or jewellery hero shot, 4:5"
                  alt={`A piece from Drop ${drop}`}
                />
              </GridItem>
              <GridItem span={{ base: 4, md: 8, lg: 4 }} start={{ lg: 9 }}>
                <Overline accent>Collection</Overline>
                <Heading level={1} size="h1" id="drop-title">
                  {copy.heading}
                </Heading>
                <Text size="body-l" muted className="t-measure">
                  {copy.body}
                </Text>
                <p className="t-overline t-muted">
                  {pieces.length} {pieces.length === 1 ? 'piece' : 'pieces'}
                </p>
              </GridItem>
            </Grid>
          </Container>
        </Section>
      ) : (
        <PageHead overline="Collection" title={title} />
      )}

      <Section surface={copy ? 'raised' : 'dark'} pad="tight">
        <Container>
          {pieces.length ? (
            <ProductGrid products={pieces} label={title} />
          ) : (
            <div className="sv-stack">
              <Text size="body-l" muted>
                {copy ? 'This drop is between pieces right now.' : `Drop ${drop} hasn’t launched yet.`}
              </Text>
              <Text size="small" muted>
                New drops are announced on Instagram first. Message us on WhatsApp and we&rsquo;ll let you know the
                moment this one lands.
              </Text>
              <div className="sv-cluster">
                <Button href={whatsappLink(`Hi Sanovia! Let me know when Drop ${drop} is available.`)} external iconBefore={<WhatsApp size={18} />}>
                  Get notified on WhatsApp
                </Button>
                <Button to="/shop" variant="ghost">
                  Browse all pieces
                </Button>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
