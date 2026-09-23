import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Section } from '@/components/layout/primitives';
import { PageHead } from '@/components/layout/PageHead';
import { Button } from '@/components/ui/Button';
import { Text, Overline, Heading } from '@/components/ui/Typography';
import { Tag } from '@/components/ui/Tag';
import { Accordion } from '@/components/ui/Accordion';
import { Gallery } from '@/components/product/Gallery';
import { Price } from '@/components/product/Price';
import { Rating } from '@/components/product/Rating';
import { ReviewList } from '@/components/product/ReviewList';
import { VariantPicker } from '@/components/product/VariantPicker';
import { QuantityStepper } from '@/components/product/QuantityStepper';
import { WishlistButton } from '@/components/product/WishlistButton';
import { AddToOrderList, OrderOnWhatsApp } from '@/components/product/OrderControls';
import { ProductGrid } from '@/components/product/ProductGrid';
import { WhatsApp } from '@/components/icons';
import { getProduct, getRelatedProducts, availabilityMeta } from '@/services/productRepository';
import { whatsappLink } from '@/utils/whatsapp';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { usePageMotion } from '@/hooks/useSectionMotion';
import { setProductSchema } from '@/utils/seo';

const CATEGORY_LABEL = { watches: 'Watches', jewellery: 'Jewellery' };

/** Product detail page. Full build: gallery, variants, quantity, order actions, accordion, related pieces. */
export default function Product() {
  const { slug } = useParams();
  const product = getProduct(slug);
  useDocumentTitle(product?.name ?? 'Piece not found', product?.shortDescription ?? product?.description);

  // Product JSON-LD (utils/seo.js) — architecture only today: the catalogue is empty until the
  // client supplies real pieces (data/products.js), so this is a no-op in production for now and
  // activates the moment real data lands. Runs outside useDocumentTitle's effect since it depends
  // on the whole product object, not just name/description, and must clear on a not-found page.
  useEffect(() => {
    setProductSchema(product);
    return () => setProductSchema(null);
  }, [product]);

  return product ? <ProductDetail product={product} /> : <ProductNotFound slug={slug} />;
}

function ProductDetail({ product }) {
  const ref = useRef(null);
  usePageMotion(ref);
  const [variant, setVariant] = useState(product.variants?.[0]);
  const [qty, setQty] = useState(1);
  const avail = availabilityMeta(product.availability);
  const related = getRelatedProducts(product);
  const overline = [CATEGORY_LABEL[product.category], product.drop && `Drop ${product.drop}`].filter(Boolean).join(' · ');

  const accordionItems = [
    {
      id: 'details',
      title: 'Details',
      content: (
        <div className="sv-stack" style={{ '--gap': 'var(--space-4)' }}>
          <Text muted>{product.description || "Full details for this piece will be added soon — ask us on WhatsApp in the meantime."}</Text>
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <dl className="sv-pdp__specs">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="sv-pdp__spec">
                  <dt className="t-small t-muted">{key}</dt>
                  <dd className="t-small">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      ),
    },
    {
      id: 'shipping',
      title: 'Shipping & care',
      content: (
        <div className="sv-stack" style={{ '--gap': 'var(--space-3)' }}>
          <Text muted>
            We confirm delivery time, cost and payment with you on WhatsApp before anything is final — it depends
            where you are.
          </Text>
          <Button
            href={whatsappLink(`Hi Sanovia! I have a shipping question about the ${product.name}.`)}
            external
            variant="ghost"
            size="sm"
            iconBefore={<WhatsApp size={16} />}
          >
            Ask about shipping
          </Button>
        </div>
      ),
    },
    {
      id: 'reviews',
      title: product.reviews?.length ? `Reviews (${product.reviews.length})` : 'Reviews',
      content: <ReviewList product={product} />,
    },
  ];

  return (
    <div ref={ref}>
      <Section surface="dark" pad="tight">
        <Container>
          <div className="sv-pdp">
            <Gallery product={product} />

            <div className="sv-pdp__info">
              {overline && <Overline accent>{overline}</Overline>}
              <div className="sv-pdp__head">
                <Heading level={1} size="h1" style={{ marginTop: 'var(--space-2)' }}>
                  {product.name}
                </Heading>
                <WishlistButton product={product} variant="inline" />
              </div>

              {(product.tag || avail) && (
                <div className="sv-cluster" style={{ '--gap': 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                  {product.tag && <Tag tone={product.tag === 'Limited' ? 'limited' : 'outline'}>{product.tag}</Tag>}
                  {avail && <Tag tone={avail.tone}>{avail.label}</Tag>}
                </div>
              )}

              <Price amount={product.price} compareAt={product.compareAtPrice} className="sv-pdp__price" />
              {product.sku && (
                <Text size="small" muted className="sv-pdp__sku">
                  SKU: {product.sku}
                </Text>
              )}
              <Rating rating={product.rating} className="sv-pdp__rating" />

              {product.description && (
                <Text className="sv-pdp__desc" size="body-l" muted>
                  {product.description}
                </Text>
              )}

              <VariantPicker variants={product.variants} value={variant} onChange={setVariant} label={`Variant for ${product.name}`} />

              <div className="sv-pdp__actions">
                {avail?.orderable === false ? (
                  <OrderOnWhatsApp
                    product={product}
                    variant={variant}
                    label={`Ask about ${avail.label.toLowerCase()}`}
                    block
                    variantStyle="ghost"
                  />
                ) : (
                  <>
                    <QuantityStepper value={qty} onChange={setQty} label={`Quantity for ${product.name}`} size="lg" />
                    <OrderOnWhatsApp product={product} variant={variant} qty={qty} block />
                    <AddToOrderList product={product} variant={variant} qty={qty} block variantStyle="ghost" />
                  </>
                )}
              </div>

              <Accordion className="sv-pdp__meta" items={accordionItems} />
            </div>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section surface="raised" pad="tight" className="sv-pdp__related">
          <Container>
            <Overline accent>Wear it with</Overline>
            <Heading level={2} size="h2" style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-7)' }}>
              You might also like
            </Heading>
            <ProductGrid products={related} label="Related pieces" />
          </Container>
        </Section>
      )}
    </div>
  );
}

/** A dev placeholder slug (`placeholder-…`) says so plainly; a real, unknown slug is a 404-style message. */
function ProductNotFound({ slug }) {
  const isDevPlaceholder = import.meta.env.DEV && slug?.startsWith('placeholder-');
  return (
    <>
      <PageHead overline="Product" title={isDevPlaceholder ? 'Placeholder product' : 'Piece not found'} />
      <Section surface="dark" pad="tight">
        <Container>
          <div className="sv-empty">
            <Text size="body-l">
              {isDevPlaceholder
                ? 'This dev fixture has no route content of its own — see /design-system for the product UI.'
                : "We couldn't find that piece. It may have moved, sold out, or not launched yet."}
            </Text>
            <p style={{ marginTop: 'var(--space-5)' }}>
              <Button to="/shop" variant="ghost">
                Back to the shop
              </Button>
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
