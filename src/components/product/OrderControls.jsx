import { useEffect, useState } from 'react';
import { useOrderList } from '@/context/OrderListContext';
import { Button } from '@/components/ui/Button';
import { Bag, Check, Plus, WhatsApp } from '@/components/icons';
import { IconButton } from '@/components/layout/IconButton';
import { productMessage, whatsappLink } from '@/utils/whatsapp';
import './product.css';

/**
 * "Add to order list". Gives immediate visual feedback (label → "Added" for 1.6s) AND
 * announces to screen readers (via the context's polite live region), so the change is
 * never visual-only. `qty` (PDP) defaults to 1 (card/quick-add).
 */
export function AddToOrderList({ product, variant, qty = 1, size = 'md', variantStyle = 'ghost', block, disabled }) {
  const { add } = useOrderList();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return undefined;
    const t = window.setTimeout(() => setJustAdded(false), 1600);
    return () => window.clearTimeout(t);
  }, [justAdded]);

  return (
    <Button
      variant={variantStyle}
      size={size}
      block={block}
      disabled={disabled}
      iconBefore={justAdded ? <Check size={16} /> : <Plus size={16} />}
      onClick={() => {
        add(product, variant, qty);
        setJustAdded(true);
      }}
    >
      {justAdded ? 'Added' : 'Add to cart'}
    </Button>
  );
}

/** One-tap order: opens WhatsApp with a prefilled message. The PDP's "buy now" — no cart detour. */
export function OrderOnWhatsApp({ product, variant, qty = 1, label = 'Order on WhatsApp', size = 'md', block, variantStyle = 'whatsapp' }) {
  return (
    <Button
      variant={variantStyle}
      size={size}
      block={block}
      href={whatsappLink(productMessage(product, variant, qty))}
      external
      iconBefore={<WhatsApp size={18} />}
    >
      {label}
    </Button>
  );
}

/** Header trigger: opens the cart drawer. The accessible name carries the live count. */
export function OrderListButton({ className }) {
  const { count, openDrawer } = useOrderList();
  return (
    <IconButton
      label="Cart"
      icon={<Bag size={22} />}
      badge={count}
      className={className}
      aria-haspopup="dialog"
      aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
      onClick={openDrawer}
    />
  );
}
