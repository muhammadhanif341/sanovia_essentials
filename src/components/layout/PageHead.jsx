import { Container, Section } from './primitives';
import { Heading, Overline } from '@/components/ui/Typography';

/** Consistent top-of-page block for interior pages. */
export function PageHead({ overline, title, children }) {
  return (
    <Section surface="dark" pad="flush" className="sv-page-head">
      <Container>
        <div className="sv-stack" style={{ '--gap': 'var(--space-4)' }}>
          {overline && <Overline accent>{overline}</Overline>}
          <Heading level={1} size="h1">
            {title}
          </Heading>
          {children}
        </div>
      </Container>
    </Section>
  );
}
