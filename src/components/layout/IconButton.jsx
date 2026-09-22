import { cn } from '@/utils/cn';
import { TransitionLink } from '@/components/motion/TransitionLink';
import './chrome.css';

/**
 * Header utility control: an icon with an accessible name, a ring that opens on hover/focus,
 * a label that slides in beneath it (fine pointers), and an optional count badge.
 *
 *   <IconButton label="Search" icon={<Search/>} onClick=… />      → <button>
 *   <IconButton label="Wishlist" icon={<Heart/>} to="/wishlist" /> → router link with page transition
 *
 * The visible label is decoration (aria-hidden); `aria-label` is the name. The badge is folded into
 * the name by the caller (e.g. "Cart, 2 items") and rendered aria-hidden here, so it is never read twice.
 * The badge re-mounts on change (`key`), which replays its CSS "pop" — no JS animation to clean up.
 */
export function IconButton({ label, icon, badge, to, className, ref, ...rest }) {
  const cls = cn('sv-iconbtn', className);
  const inner = (
    <>
      <span className="sv-iconbtn__ring" aria-hidden="true" />
      <span className="sv-iconbtn__icon" aria-hidden="true">
        {icon}
      </span>
      {badge !== undefined && (
        <span key={badge} className="sv-iconbtn__badge" data-empty={badge === 0} aria-hidden="true">
          {badge}
        </span>
      )}
      <span className="sv-iconbtn__tip" aria-hidden="true">
        {label}
      </span>
    </>
  );

  if (to) {
    return (
      <TransitionLink ref={ref} to={to} className={cls} aria-label={rest['aria-label'] ?? label} {...rest}>
        {inner}
      </TransitionLink>
    );
  }
  return (
    <button ref={ref} type="button" className={cls} aria-label={rest['aria-label'] ?? label} {...rest}>
      {inner}
    </button>
  );
}
