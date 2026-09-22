import { Link, useLocation } from 'react-router-dom';
import { useTransition } from './PageTransition';

/**
 * A router <Link> that plays the page transition. Behaves like a normal link for
 * modified clicks (new tab / window), `target=_blank`, and links to the current page.
 * Keyboard activation (click with detail 0) grows the curtain from the link's centre.
 */
export function TransitionLink({ to, onClick, children, ref, ...rest }) {
  const { go } = useTransition();
  const location = useLocation();

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target && rest.target !== '_self') return;

    const path = typeof to === 'string' ? to.split(/[?#]/)[0] : to.pathname;
    if (path === location.pathname) return; // same page: let <Link> handle it

    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const fromKeyboard = e.detail === 0;
    go(to, {
      x: fromKeyboard ? rect.left + rect.width / 2 : e.clientX,
      y: fromKeyboard ? rect.top + rect.height / 2 : e.clientY,
    });
  };

  return (
    <Link ref={ref} to={to} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
