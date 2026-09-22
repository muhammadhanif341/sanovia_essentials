import { cn } from '@/utils/cn';
import './surfaces.css';

/**
 * Hairline-framed container. tone: 'raised' (default, filled) | 'outline' (transparent).
 * A card is NOT a control: if the whole card should navigate, put a real link on its
 * heading and stretch it (see ProductCard) — never make the wrapper itself clickable.
 * `interactive` only adds the hover border affordance for such cards.
 */
export function Card({ as: Tag = 'div', tone = 'raised', flush, interactive, className, children, ...rest }) {
  return (
    <Tag
      className={cn(
        'sv-card',
        tone === 'outline' && 'sv-card--outline',
        flush && 'sv-card--flush',
        interactive && 'sv-card--interactive',
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
