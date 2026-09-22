import { useWishlist } from '@/context/WishlistContext';
import { Heart } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { announce } from '@/utils/a11y';
import { cn } from '@/utils/cn';
import './product.css';

/**
 * Wishlist toggle. Honest about what it is (see WishlistContext): saved on this device only.
 *
 *   variant="overlay"  → round icon button, for the corner of a ProductCard/gallery image
 *   variant="inline"    → labelled ghost button ("Save" / "Saved"), for the PDP info column
 *
 * The heart fills solid the instant it's saved — no separate "confirmed" state needed,
 * the toggle IS the feedback — and the change is announced for screen readers too.
 */
export function WishlistButton({ product, variant = 'overlay', size = 16, className }) {
  const { has, toggle } = useWishlist();
  const saved = has(product.slug);

  const onClick = (e) => {
    e.preventDefault(); // sits inside the card's stretched link
    e.stopPropagation();
    toggle(product);
    announce(saved ? `${product.name} removed from your wishlist.` : `${product.name} added to your wishlist.`);
  };

  if (variant === 'inline') {
    return (
      <Button
        variant="ghost"
        size="sm"
        aria-pressed={saved}
        iconBefore={<Heart size={size} />}
        className={cn('sv-wish sv-wish--inline', className)}
        data-saved={saved}
        onClick={onClick}
      >
        {saved ? 'Saved' : 'Save'}
      </Button>
    );
  }

  return (
    <button
      type="button"
      className={cn('sv-wish', className)}
      data-saved={saved}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      onClick={onClick}
    >
      <Heart size={size} />
    </button>
  );
}
