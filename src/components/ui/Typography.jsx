import { cn } from '@/utils/cn';

const SIZE_BY_LEVEL = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h3', 5: 'h3', 6: 'h3' };

/**
 * Semantic heading with a decoupled visual size.
 *   <Heading level={2} size="display-l">Minimal <em>everyday</em> essentials.</Heading>
 * Put ONE <em> in a headline for the signature italic accent-brown word.
 */
export function Heading({ level = 2, size, as, className, children, ...rest }) {
  const Tag = as ?? `h${level}`;
  return (
    <Tag className={cn(`t-${size ?? SIZE_BY_LEVEL[level]}`, className)} {...rest}>
      {children}
    </Tag>
  );
}

/** Body copy. size: 'body-l' | 'body' | 'small'. */
export function Text({ as: Tag = 'p', size = 'body', muted, className, children, ...rest }) {
  return (
    <Tag className={cn(`t-${size}`, muted && 't-muted', className)} {...rest}>
      {children}
    </Tag>
  );
}

/** Tracked, uppercase label — the only all-caps text in the system. */
export function Overline({ as: Tag = 'p', accent, className, children, ...rest }) {
  return (
    <Tag className={cn('t-overline', accent ? 't-accent' : 't-muted', className)} {...rest}>
      {children}
    </Tag>
  );
}
