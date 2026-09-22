import { Container, Section } from '@/components/layout/primitives';
import { PageHead } from '@/components/layout/PageHead';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Typography';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/** Collections index shell. One named drop exists so far; the editorial pages arrive with the content. */
export default function Collections() {
  useDocumentTitle('Collections', 'Sanovia Essentials collections — small, considered drops of watches and jewellery.');
  return (
    <>
      <PageHead overline="Sanovia" title="Collections" />
      <Section surface="dark" pad="tight">
        <Container>
          <div className="sv-stack">
            <Text size="body-l" muted className="t-measure">
              Each drop is a small, considered set of watches and jewellery. The editorial pages for them arrive with
              the photography.
            </Text>
            <div>
              <Button to="/drops/01" variant="ghost">
                Drop 01
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
