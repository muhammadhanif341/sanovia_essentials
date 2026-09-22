import { Children, useRef } from 'react';
import { cn } from '@/utils/cn';
import { useHorizontalScroll } from '@/hooks/useSectionMotion';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { ChevronLeft, ChevronRight } from '@/components/icons';
import './motion.css';

/**
 * Horizontal gallery with two modes from ONE markup:
 *   • ≥1024px, motion allowed → vertical scroll drives the track sideways (sticky stage)
 *   • everything else         → native scroll-snap carousel (swipe / trackpad / keyboard)
 * Arrow buttons work in both modes and are the keyboard/AT path; focusing any card
 * brings it into view. Every card stays in DOM order either way.
 *
 * children: one node per item.       label: accessible name for the region.
 */
export function HorizontalScroller({ label, children, className, header }) {
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const reduced = useReducedMotion();
  const api = useHorizontalScroll(wrapperRef);
  const items = Children.toArray(children);

  const step = (dir) => {
    const scrubbed = api.current;
    if (scrubbed) {
      scrubbed.scrollToIndex(scrubbed.currentIndex() + dir);
      return;
    }
    const track = trackRef.current;
    const first = track?.querySelector('[data-hscroll-item]');
    if (!track || !first) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: dir * (first.getBoundingClientRect().width + gap), behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section
      ref={wrapperRef}
      className={cn('sv-hscroll', className)}
      data-hscroll-root
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="sv-hscroll__stage" data-hscroll-stage>
        {header}
        {/* A scrollable region must be keyboard-focusable so non-mouse users can scroll it (WCAG 2.1.1). */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div ref={trackRef} className="sv-hscroll__track" data-hscroll-track tabIndex={0} role="group" aria-label={`${label} — scrollable`}>
          {items.map((child, i) => (
            <div
              key={child.key ?? i}
              className="sv-hscroll__item"
              data-hscroll-item
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
            >
              {child}
            </div>
          ))}
        </div>
        <div className="sv-hscroll__controls">
          <div className="sv-hscroll__progress" aria-hidden="true" />
          <div className="sv-hscroll__arrows">
            <button type="button" className="sv-hscroll__arrow" aria-label="Previous" onClick={() => step(-1)}>
              <ChevronLeft size={20} />
            </button>
            <button type="button" className="sv-hscroll__arrow" aria-label="Next" onClick={() => step(1)}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
