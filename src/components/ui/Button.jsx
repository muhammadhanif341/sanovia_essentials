import { cn } from '@/utils/cn';
import { TransitionLink } from '@/components/motion/TransitionLink';
import './controls.css';

/**
 * One button, three render targets:
 *   <Button onClick>            → <button>
 *   <Button to="/shop">         → router link (with page transition)
 *   <Button href="https://…" external>  → <a>, opens in a new tab, announced as such
 *
 * variant: 'primary' | 'ghost'      size: 'sm' | 'md' | 'lg'      block: full width
 * `loading` sets aria-busy and blocks interaction; `disabled` uses the native attribute.
 * `ref` is a plain prop (React 19).
 */
export function Button({
  variant = 'primary',
  size = 'md',
  block,
  to,
  href,
  external,
  loading,
  iconBefore,
  iconAfter,
  className,
  children,
  ref,
  type,
  ...rest
}) {
  const cls = cn('sv-btn', `sv-btn--${variant}`, size !== 'md' && `sv-btn--${size}`, block && 'sv-btn--block', className);

  const content = (
    <>
      {loading && <span className="sv-btn__spinner" aria-hidden="true" />}
      {iconBefore && !loading && (
        <span className="sv-btn__icon" aria-hidden="true">
          {iconBefore}
        </span>
      )}
      <span className="sv-btn__label">{children}</span>
      {iconAfter && (
        <span className="sv-btn__icon" aria-hidden="true">
          {iconAfter}
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <TransitionLink ref={ref} to={to} className={cls} {...rest}>
        {content}
      </TransitionLink>
    );
  }
  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
        {...rest}
      >
        {content}
        {external && <span className="sv-sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <button ref={ref} type={type ?? 'button'} className={cls} aria-busy={loading || undefined} {...rest}>
      {content}
    </button>
  );
}
