import { cn } from '@/utils/cn';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { ArrowUpRight } from '@/components/icons';
import './controls.css';

/**
 * Inline / standalone text link. Gold by default (an accent — never used on light
 * surfaces at champagne; the token switches to brass there). `plain` inherits the
 * surrounding colour and draws its underline on hover instead.
 * External links open in a new tab and say so to screen readers.
 */
export function TextLink({ to, href, external, plain, className, children, ref, ...rest }) {
  const cls = cn('sv-link', plain && 'sv-link--plain', className);

  if (to) {
    return (
      <TransitionLink ref={ref} to={to} className={cls} {...rest}>
        {children}
      </TransitionLink>
    );
  }
  return (
    <a
      ref={ref}
      href={href}
      className={cls}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
      {...rest}
    >
      {children}
      {external && (
        <>
          <ArrowUpRight size={14} />
          <span className="sv-sr-only"> (opens in a new tab)</span>
        </>
      )}
    </a>
  );
}
