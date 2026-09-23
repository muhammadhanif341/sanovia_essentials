import { createContext, useContext, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { pad2 } from '@/utils/format';
import { ShapeMedia } from '@/components/media/ShapeMedia';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { Tag } from '@/components/ui/Tag';
import { Eye } from '@/components/icons';
import { availabilityMeta } from '@/services/productRepository';
import { useCursorFollow } from '@/hooks/useSectionMotion';
import { Price } from './Price';
import { AddToOrderList } from './OrderControls';
import { WishlistButton } from './WishlistButton';
import { QuickView } from './QuickView';
import './product.css';

/**
 * Compound product card: <ProductCard> provides context, slots consume it.
 * (API shape inspired by the 21st.dev compound Product Card; the implementation is ours.)
 *
 *   <ProductCard product={p} index={1}>
 *     <ProductCardMedia />
 *     <ProductCardBody />
 *     <ProductCardActions />
 *   </ProductCard>
 *
 * …or just <ProductCard product={p} /> for the default composition.
 *
 * Accessibility: the card is an <article>; the title holds the only link and is
 * stretched over the card with ::after, so the whole card is clickable without nesting
 * interactive elements or making a div behave like a button. The wishlist/quick-view
 * corner controls sit ABOVE the stretched link (z-index) so they stay independently
 * clickable, same pattern as the "add to cart" action below.
 *
 * size: 'md' | 'sm'        ratio: media aspect ratio        priority: LCP image
 */
const CardContext = createContext(null);
const useCard = () => {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error('ProductCard slots must be rendered inside <ProductCard>');
  return ctx;
};

export function ProductCard({ product, index, size = 'md', ratio = '4 / 5', priority, className, children }) {
  return (
    <CardContext.Provider value={{ product, index, size, ratio, priority }}>
      <article className={cn('sv-pcard', className)} data-size={size}>
        {children ?? (
          <>
            <ProductCardMedia />
            <ProductCardBody />
            <ProductCardActions />
          </>
        )}
      </article>
    </CardContext.Provider>
  );
}

export function ProductCardMedia({ reveal = true, parallax = false }) {
  const { product, ratio, priority } = useCard();
  const [quickView, setQuickView] = useState(false);
  const shape = product.shape ?? 'arch';
  const avail = availabilityMeta(product.availability);
  const mediaRef = useRef(null);
  const cursorRef = useRef(null);
  useCursorFollow(mediaRef, cursorRef);

  return (
    <div className="sv-pcard__media" ref={mediaRef}>
      <div className="sv-pcard__badges">
        {product.tag && <Tag tone={product.tag === 'Limited' ? 'limited' : 'outline'}>{product.tag}</Tag>}
        {avail && <Tag tone={avail.tone}>{avail.label}</Tag>}
      </div>
      <WishlistButton product={product} className="sv-pcard__wish" />
      <span ref={cursorRef} className="sv-pcard__cursor" aria-hidden="true">
        View
      </span>
      <ShapeMedia
        id={product.images?.primary}
        hoverId={product.images?.hover}
        alt={product.name}
        shape={shape}
        ratio={shape === 'circle' ? '1 / 1' : ratio}
        priority={priority}
        reveal={reveal}
        parallax={parallax}
        sizes="(min-width: 1440px) 25vw, (min-width: 768px) 33vw, 50vw"
        placeholderLabel="Product photo needed"
        placeholderSpec={product.name}
      />
      <button
        type="button"
        className="sv-pcard__quickview"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setQuickView(true);
        }}
      >
        <Eye size={16} />
        Quick view
      </button>
      <QuickView product={product} open={quickView} onClose={() => setQuickView(false)} />
    </div>
  );
}

export function ProductCardBody() {
  const { product, index } = useCard();
  return (
    <div className="sv-pcard__body">
      {index != null && (
        <span className="sv-pcard__index t-overline" aria-hidden="true">
          {pad2(index)}
        </span>
      )}
      <h3 className="sv-pcard__title">
        <TransitionLink to={`/product/${product.slug}`} className="sv-pcard__link">
          <span className="sv-pcard__link-text">{product.name}</span>
        </TransitionLink>
      </h3>
      <Price amount={product.price} compareAt={product.compareAtPrice} />
    </div>
  );
}

export function ProductCardActions({ children }) {
  const { product } = useCard();
  const avail = availabilityMeta(product.availability);
  return (
    <div className="sv-pcard__actions">
      {children ?? <AddToOrderList product={product} size="sm" disabled={avail?.orderable === false} />}
    </div>
  );
}
