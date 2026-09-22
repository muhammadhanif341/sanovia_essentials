import { useState } from 'react';
import { Pause, Play } from '@/components/icons';
import './motion.css';

/**
 * Text/tile ticker. CSS-driven (compositor thread — smoother and cheaper than a JS loop).
 * Accessibility: pauses on hover and focus-within, has a visible pause control
 * (WCAG 2.2.2), and under reduced motion becomes a static wrapped list. The duplicate
 * group used for the seamless loop is aria-hidden so content is announced once.
 * Never carry essential information in a marquee.
 *
 * items: ReactNode[]      seconds: loop duration (slower = calmer)
 */
export function Marquee({ items, seconds = 40, label = 'Highlights', className }) {
  const [paused, setPaused] = useState(false);
  const group = (hidden) => (
    <ul className="sv-marquee__group" aria-hidden={hidden || undefined} role={hidden ? 'presentation' : undefined}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );

  return (
    <div
      className={['sv-marquee', className].filter(Boolean).join(' ')}
      data-paused={paused}
      style={{ '--marquee-dur': `${seconds}s` }}
      role="group"
      aria-label={label}
    >
      <div className="sv-marquee__viewport">
        <div className="sv-marquee__track">
          {group(false)}
          {group(true)}
        </div>
      </div>
      <button
        type="button"
        className="sv-marquee__toggle"
        aria-pressed={paused}
        aria-label={paused ? `Play ${label}` : `Pause ${label}`}
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? <Play size={16} /> : <Pause size={16} />}
      </button>
    </div>
  );
}
