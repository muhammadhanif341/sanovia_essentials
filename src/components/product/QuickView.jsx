import { useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Close } from '@/components/icons';
import { ShapeMedia } from '@/components/media/ShapeMedia';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { Tag } from '@/components/ui/Tag';
import { Price } from './Price';
import { Rating } from './Rating';
import { VariantPicker } from './VariantPicker';
import { QuantityStepper } from './QuantityStepper';
import { WishlistButton } from './WishlistButton';
import { Button } from '@/components/ui/Button';
import { WhatsApp } from '@/components/icons';
import { AddToOrderList, OrderOnWhatsApp } from './OrderControls';
import { availabilityMeta } from '@/services/productRepository';
import { whatsappLink } from '@/utils/whatsapp';
import './product.css';

/**
 * A fast look without leaving the grid: drawer on mobile, right panel from tablet up
 * (same Dialog as the cart, so it feels like the same product). Same order actions as
 * the PDP — variant, quantity, add to cart — plus a link to the full page. WhatsApp is
 * support-only here too, matching the PDP (see docs/ARCHITECTURE.md §14).
 */
export function QuickView({ product, open, onClose }) {
  const [variant, setVariant] = useState(product?.variants?.[0]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (open) {
      setVariant(product?.variants?.[0]);
      setQty(1);
    }
  }, [open, product]);

  if (!product) return null;
  const avail = availabilityMeta(product.availability);

  return (
    <Dialog open={open} onClose={onClose} labelledBy="sv-qv-title" side="drawer" surface="raised" className="sv-qv">
      <div className="sv-dialog__bar">
        <span className="t-overline t-muted">Quick view</span>
        <button type="button" className="sv-dialog__close" aria-label="Close quick view" onClick={onClose}>
          <Close size={22} />
        </button>
      </div>
      <div className="sv-qv__body">
        <ShapeMedia
          id={product.images?.primary}
          hoverId={product.images?.hover}
          alt={product.name}
          shape={product.shape ?? 'arch'}
          ratio={product.shape === 'circle' ? '1 / 1' : '4 / 5'}
          placeholderLabel="Product photo needed"
          placeholderSpec={product.name}
        />
        <div className="sv-qv__info">
          <div className="sv-cluster" style={{ '--gap': 'var(--space-3)' }}>
            {product.tag && <Tag tone={product.tag === 'Limited' ? 'limited' : 'outline'}>{product.tag}</Tag>}
            {avail && <Tag tone={avail.tone}>{avail.label}</Tag>}
          </div>
          <h2 id="sv-qv-title" className="t-h2" style={{ marginTop: 'var(--space-3)' }}>
            {product.name}
          </h2>
          <Rating rating={product.rating} className="sv-qv__rating" />
          <Price amount={product.price} compareAt={product.compareAtPrice} className="sv-qv__price" />
          {product.description && <p className="t-body t-muted sv-qv__desc">{product.description}</p>}
          <VariantPicker variants={product.variants} value={variant} onChange={setVariant} />
          <div className="sv-cluster" style={{ '--gap': 'var(--space-4)', marginTop: 'var(--space-4)' }}>
            <QuantityStepper value={qty} onChange={setQty} label={`Quantity for ${product.name}`} />
            <WishlistButton product={product} variant="inline" />
          </div>
          <div className="sv-stack" style={{ '--gap': 'var(--space-3)', marginTop: 'var(--space-5)' }}>
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
                <AddToOrderList product={product} variant={variant} qty={qty} block variantStyle="primary" />
                <Button
                  href={whatsappLink(`Hi Sanovia! I have a question about the ${product.name}.`)}
                  external
                  variant="ghost"
                  block
                  iconBefore={<WhatsApp size={18} />}
                >
                  Ask a question on WhatsApp
                </Button>
              </>
            )}
          </div>
          <TransitionLink to={`/product/${product.slug}`} className="sv-link sv-qv__full" onClick={onClose}>
            View full details
          </TransitionLink>
        </div>
      </div>
    </Dialog>
  );
}
