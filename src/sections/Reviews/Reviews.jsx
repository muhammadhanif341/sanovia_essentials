import { Container, Section } from '@/components/layout/primitives';
import { Overline, Text } from '@/components/ui/Typography';
import { TextLink } from '@/components/ui/TextLink';
import { site } from '@/data/site';
import './reviews.css';


/**
 * Customer Reviews — no reviews are invented (DESIGN-BLUEPRINT §12: "any invented copy,
 * review, or press mention would damage trust"). Real Instagram comments are genuine social
 * proof that already exists, so the honest bridge is a link out, not a fabricated quote.
 * Motion: subtle — a single fade, no split-text, no scrub. This section says the least, so it
 * moves the least.
 */
export function Reviews() {
  return (
    <Section surface="dark" pad="tight" aria-labelledby="reviews-title">
      <Container size="narrow">
        <div className="reviews" data-reveal="fade">
          <span className="reviews__mark" aria-hidden="true">
            &ldquo;
          </span>
          <Overline accent id="reviews-title">
            In their words
          </Overline>
          <Text size="quote" as="p" className="reviews__line">
            Real reviews take time — and consent.
          </Text>
          <Text size="body-l" muted className="t-measure reviews__body">
            Screenshots go here once a customer says it&rsquo;s okay to share them. Nothing is written for them in
            the meantime.
          </Text>
          <TextLink href={site.instagram.url} external>
            See real comments on Instagram
          </TextLink>
        </div>
      </Container>
    </Section>
  );
}
