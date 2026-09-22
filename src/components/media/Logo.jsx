import { cn } from '@/utils/cn';
import './media.css';

/**
 * PLACEHOLDER LOGO. The real brand mark (disc + wordmark) has not been supplied — see
 * assets-src/README.md. Replace this component's body with an <img>/<svg> of the real
 * file (src/assets/logos/) and every usage updates; the API stays the same.
 *
 * Decorative by design: the enclosing link/heading supplies the accessible name
 * (e.g. aria-label="Sanovia Essentials — home").
 *
 * variant: 'disc' | 'wordmark' | 'lockup'      size: disc diameter (CSS length)
 */
export function Logo({ variant = 'lockup', size, className }) {
  return (
    <span
      className={cn('sv-logo', `sv-logo--${variant}`, className)}
      style={size ? { '--logo-size': size } : undefined}
      aria-hidden="true"
    >
      {variant !== 'wordmark' && <span className="sv-logo__disc">S</span>}
      {variant !== 'disc' && (
        <span className="sv-logo__type">
          <span className="sv-logo__word">Sanovia</span>
          <span className="sv-logo__sub">Essentials</span>
        </span>
      )}
    </span>
  );
}
