import { useRef } from 'react';
import { Container, Section } from '@/components/layout/primitives';
import { PageHead } from '@/components/layout/PageHead';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Typography';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useWishlist } from '@/context/WishlistContext';
import { getProduct } from '@/services/productRepository';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { usePageMotion } from '@/hooks/useSectionMotion';

/** Saved pieces, resolved live from the catalogue — see WishlistContext for what "saved" means. */
export default function Wishlist() {
  useDocumentTitle('Wishlist');
  const ref = useRef(null);
  usePageMotion(ref);
  const { slugs } = useWishlist();
  const products = slugs.map(getProduct).filter(Boolean);

  return (
    <div ref={ref}>
      <PageHead overline="Wishlist" title="Saved pieces" />
      <Section surface="dark" pad="tight">
        <Container>
          {products.length ? (
            <ProductGrid products={products} label="Saved pieces" />
          ) : (
            <div className="sv-stack sv-empty">
              <Text size="body-l">Nothing saved yet.</Text>
              <Text className="t-small" muted>
                Tap the heart on any piece to keep it here — on this device only, no account needed.
              </Text>
              <div>
                <Button to="/shop" variant="ghost">
                  Browse the shop
                </Button>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
