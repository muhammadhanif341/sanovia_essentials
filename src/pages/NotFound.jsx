import { Container, Section } from '@/components/layout/primitives';
import { PageHead } from '@/components/layout/PageHead';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Typography';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <>
      <PageHead overline="404" title="That page isn't here" />
      <Section surface="dark" pad="tight">
        <Container>
          <div className="sv-stack">
            <Text size="body-l" muted>
              The link may be old, or the page may have moved.
            </Text>
            <div className="sv-cluster">
              <Button to="/">Back to home</Button>
              <Button to="/shop" variant="ghost">
                Browse the shop
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
