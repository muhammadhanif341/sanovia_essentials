import { useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { TransitionLink } from '@/components/motion/TransitionLink';
import './chrome.css';

/**
 * Nav link with a per-character roll on hover/focus. Screen readers get the label once
 * (sr-only span); the animated characters are aria-hidden. Marks the current page with
 * aria-current="page" — with `exact`, only on that exact path (so "Shop" is not also current on
 * /shop/watches).
 */
export function RollLink({ to, children, className, exact, ...rest }) {
  const { pathname } = useLocation();
  const current = pathname === to || (!exact && pathname.startsWith(`${to}/`));
  const label = String(children);

  return (
    <TransitionLink to={to} className={cn('sv-roll', className)} aria-current={current ? 'page' : undefined} {...rest}>
      <span className="sv-sr-only">{label}</span>
      <span className="sv-roll__vis" aria-hidden="true">
        {[...label].map((ch, i) => (
          <span key={i} className="sv-roll__c" style={{ '--i': i }}>
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </span>
    </TransitionLink>
  );
}
