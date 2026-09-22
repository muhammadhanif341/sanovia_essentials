import './media.css';

/**
 * Tonal stand-in for a photograph that hasn't been supplied yet — labelled with the
 * SHOT NEEDED, so the placeholder doubles as a to-do list (blueprint §11.4). Stock
 * photography is deliberately not used: it would misrepresent the products.
 *
 * tone: 'walnut' | 'plum' | 'cream' | 'espresso'
 */
export function MediaPlaceholder({ label = 'Photo needed', spec, tone = 'walnut', alt, decorative }) {
  return (
    <div
      className="sv-ph"
      data-tone={tone}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? 'true' : undefined}
      aria-label={decorative ? undefined : alt || label}
    >
      <span className="sv-ph__label">{label}</span>
      {spec && <span className="sv-ph__spec">{spec}</span>}
    </div>
  );
}
