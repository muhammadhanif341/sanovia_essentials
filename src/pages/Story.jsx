import { Container, Section } from '@/components/layout/primitives';
import { PageHead } from '@/components/layout/PageHead';
import { Text } from '@/components/ui/Typography';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/** About / brand story shell (founder note + "how we pack"). Content is the client's; built in Phase 3. */
export default function Story() {
  useDocumentTitle('About');
  return (
    <>
      <PageHead overline="Sanovia" title="About Sanovia" />
      <Section surface="dark" pad="tight">
        <Container size="narrow">
          <Text size="body-l" muted>
            The story page arrives in Phase 3, with the founder note and the packing story.
          </Text>
        </Container>
      </Section>
    </>
  );
}
