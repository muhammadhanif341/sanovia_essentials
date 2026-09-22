import { cn } from '@/utils/cn';

/** Width-constrained, gutter-padded column. size: 'default' | 'wide' | 'narrow' | 'bleed'. */
export function Container({ as: Tag = 'div', size = 'default', className, children, ...rest }) {
  return (
    <Tag className={cn('sv-container', size !== 'default' && `sv-container--${size}`, className)} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * A page band that owns a colour surface. Children read semantic tokens
 * (--fg, --accent…), so anything inside is legible on that surface.
 * surface: 'dark' | 'darker' | 'raised' | 'ivory' | 'cream' | 'plum'
 * pad: 'default' | 'tight' | 'flush'
 */
export function Section({ as: Tag = 'section', surface = 'dark', pad = 'default', className, children, ...rest }) {
  return (
    <Tag
      data-surface={surface}
      className={cn('sv-section', pad !== 'default' && `sv-section--${pad}`, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** 4/8/12-column grid. Items declare placement per breakpoint via <GridItem>. */
export function Grid({ as: Tag = 'div', gap, rowGap, className, style, children, ...rest }) {
  const vars = {
    ...(gap ? { '--grid-gap': gap } : null),
    ...(rowGap ? { '--grid-row-gap': rowGap } : null),
    ...style,
  };
  return (
    <Tag className={cn('sv-grid', className)} style={vars} {...rest}>
      {children}
    </Tag>
  );
}

const BPS = ['base', 'md', 'lg', 'xl'];

/**
 * Placement per breakpoint (mobile → desktop). Each may be omitted to inherit.
 *   <GridItem span={{ base: 4, md: 8, lg: 6 }} start={{ lg: 7 }} row={{ lg: 1 }}>
 * base = <768 (4 cols) · md = 768 (8 cols) · lg = 1024 (12 cols) · xl = 1440 (12 cols)
 */
export function GridItem({ as: Tag = 'div', span, start, row, className, style, children, ...rest }) {
  const vars = { ...style };
  for (const bp of BPS) {
    const s = span?.[bp];
    const st = start?.[bp];
    if (s != null || st != null) {
      vars[`--col-${bp}`] = st != null ? `${st} / span ${s ?? 1}` : `span ${s}`;
    }
    if (row?.[bp] != null) vars[`--row-${bp}`] = row[bp];
  }
  return (
    <Tag className={cn('sv-grid__item', className)} style={vars} {...rest}>
      {children}
    </Tag>
  );
}

export function Stack({ as: Tag = 'div', gap, className, style, children, ...rest }) {
  return (
    <Tag className={cn('sv-stack', className)} style={{ ...(gap ? { '--gap': gap } : null), ...style }} {...rest}>
      {children}
    </Tag>
  );
}

export function Cluster({ as: Tag = 'div', gap, align, className, style, children, ...rest }) {
  const vars = { ...(gap ? { '--gap': gap } : null), ...(align ? { '--align': align } : null), ...style };
  return (
    <Tag className={cn('sv-cluster', className)} style={vars} {...rest}>
      {children}
    </Tag>
  );
}
