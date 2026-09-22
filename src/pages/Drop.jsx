import { useParams } from 'react-router-dom';
import { Container, Section } from '@/components/layout/primitives';
import { PageHead } from '@/components/layout/PageHead';
import { Text } from '@/components/ui/Typography';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/** Editorial landing for a numbered drop ("Watch drop 1", "Collection 01"). Built in Phase 3. */
export default function Drop() {
  const { drop } = useParams();
  const title = `Drop ${drop}`;
  useDocumentTitle(title);

  return (
    <>
      <PageHead overline="Collection" title={title} />
      <Section surface="dark" pad="tight">
        <Container>
          <Text size="body-l" muted className="sv-empty">
            The editorial page for this drop arrives in Phase 3.
          </Text>
        </Container>
      </Section>
    </>
  );
}
