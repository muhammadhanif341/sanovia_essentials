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

const TILES = Array.from({ length: SPANS.length }, (_, i) => ({
  id: `social/on-the-table-${i + 1}`,
  span: SPANS[i],
}));

/**
 * Social / Instagram — real handle, real link; the photography is a placeholder grid
 * until stills are supplied (DESIGN-BLUEPRINT: "on the table" strip). Motion: image reveal,
 * each tile wiping in on a small hand-placed stagger (data-reveal-delay).
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
