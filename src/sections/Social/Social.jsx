import { Container, Grid, GridItem, Section } from '@/components/layout/primitives';
import { Heading, Overline } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { ShapeMedia } from '@/components/media/ShapeMedia';
import { Instagram } from '@/components/icons';
import { site } from '@/data/site';
import './social.css';


// Column span per tile at ≥1024px — 6+3+3 then 3+3+6: an asymmetric two-row mosaic,
// not a uniform grid. Below that every tile is a plain 2-up row (see social.css).
const SPANS = [6, 3, 3, 3, 3, 6];

// Real catalogue photography (worn/detail shots read more "on the table"/lifestyle than the
// plain front-facing product card crop), not a dedicated Instagram shoot — see
// docs/ARCHITECTURE.md §13 for why stand-in social photography wasn't generated: these are the
// same real Sanovia pieces, just the candid angle a brand's own feed would actually post.
const TILE_IDS = [
  'products/tonneau-signature-watch/wrist',
  'products/layered-chain-necklace/worn',
  'products/huggie-hoop-earrings/worn',
  'products/cuff-bracelet/worn',
  'products/signet-ring/worn',
  'products/circle-rose-gold-watch/wrist',
];

const TILES = TILE_IDS.map((id, i) => ({ id, span: SPANS[i] }));

/**
 * Social / Instagram — real handle, real link, real catalogue photography styled as the
 * "on the table" strip (DESIGN-BLUEPRINT). Motion: image reveal, each tile wiping in on a
 * small hand-placed stagger (data-reveal-delay).
 */
export function Social() {
  return (
    <Section surface="ivory" aria-labelledby="social-title">
      <Container>
        <div className="social__head">
          <Overline accent data-reveal="fade">
            On the table
          </Overline>
          <Heading level={2} size="h1" id="social-title" data-reveal="lines">
            @{site.instagram.handle}
          </Heading>
        </div>

        <Grid className="social__grid">
          {TILES.map((tile, i) => (
            <GridItem key={tile.id} span={{ base: 2, md: 4, lg: tile.span }} className="social__tile">
              <ShapeMedia
                id={tile.id}
                shape="rect"
                ratio="1 / 1"
                tone="cream"
                reveal
                data-reveal-delay={(i * 0.06).toFixed(2)}
                placeholderLabel="Instagram photo needed"
                placeholderSpec="Square, lifestyle / on-the-table still"
                decorative
              />
            </GridItem>
          ))}
        </Grid>

        <div className="social__foot" data-reveal="fade">
          <Button href={site.instagram.url} external variant="ghost" iconBefore={<Instagram size={18} />}>
            Follow @{site.instagram.handle}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
