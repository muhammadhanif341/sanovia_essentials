import { Container, Section } from '@/components/layout/primitives';
import { Heading, Overline, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Price } from '@/components/product/Price';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { ArrowUpRight, WhatsApp } from '@/components/icons';
import { pad2 } from '@/utils/format';
import { getBestsellers } from '@/services/productRepository';
import { whatsappLink } from '@/utils/whatsapp';
import './bestSellers.css';


/**
 * Best Sellers — a flag inside the real catalogue (`product.bestseller === true`), never an
 * invented ranking. An early brand has no sales dashboard to point to; an honest "we don't
 * know yet" beats a fabricated top-five. Motion: product interaction — each row lifts and its
 * arrow slides on hover/focus, the same affordance a real catalogue row will have.
 */
export function BestSellers() {
  const sellers = getBestsellers();

  return (
    <Section surface="ivory" aria-labelledby="sellers-title">
      <Container size="narrow">
        <div className="sellers__head">
          <Overline accent data-reveal="fade">
            Best sellers
          </Overline>
          <Heading level={2} size="h1" id="sellers-title" data-reveal="lines">
            What people ask for most.
          </Heading>
        </div>

        {sellers.length ? (
          <ol className="sellers__list" aria-label="Best sellers">
            {sellers.map((p, i) => (
              <li key={p.slug} className="sellers__row" data-reveal="fade">
                <TransitionLink to={`/product/${p.slug}`} className="sellers__link">
                  <span className="sellers__index t-overline">{pad2(i + 1)}</span>
                  <span className="sellers__name t-h2">{p.name}</span>
                  <Price amount={p.price} className="sellers__price" />
                  <ArrowUpRight size={22} className="sellers__arrow" />
                </TransitionLink>
              </li>
            ))}
          </ol>
        ) : (
          <div className="sellers__empty" data-reveal="fade">
            <Text size="body-l" muted className="t-measure">
              We don&rsquo;t have real order history yet, so we won&rsquo;t invent a top five. Ask us on WhatsApp —
              we&rsquo;ll tell you honestly what people have been asking for.
            </Text>
            <div className="sellers__cta">
              <Button
                href={whatsappLink('Hi Sanovia! What are people asking for most right now?')}
                external
                variant="whatsapp"
                iconBefore={<WhatsApp size={18} />}
              >
                Ask on WhatsApp
              </Button>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
