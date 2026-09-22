import { useEffect, useRef, useState } from 'react';
import { ShapeMedia } from '@/components/media/ShapeMedia';
import { ChevronLeft, ChevronRight } from '@/components/icons';
import './product.css';

/**
 * PDP gallery, one markup for both layouts (DESIGN-BLUEPRINT §6.4):
 *   <1024   swipeable snap carousel, dot indicators, 44px arrows
 *   ≥1024   vertical stack beside the sticky info column (see pages/Product.jsx)
 * `images.gallery` (Product typedef) drives it; falls back to [primary, hover], then to
 * one placeholder frame so a product with no photography yet still renders a real gallery.
 */
export function Gallery({ product }) {
  const fromGallery = product.images?.gallery?.filter(Boolean);
  const ids = fromGallery?.length ? fromGallery : [product.images?.primary, product.images?.hover].filter(Boolean);
  const views = ids.length ? ids : [null];
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || views.length < 2) return undefined;
    const items = [...track.querySelectorAll('[data-gallery-item]')];
    const io = new IntersectionObserver(
      (entries) => {
        const most = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (most) setActive(items.indexOf(most.target));
      },
      { root: track, threshold: [0.6] }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [views.length]);

  const scrollTo = (i) => {
    const clamped = Math.max(0, Math.min(views.length - 1, i));
    trackRef.current?.querySelectorAll('[data-gallery-item]')[clamped]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    });
  };

  const shape = product.shape ?? 'arch';
  const ratio = shape === 'circle' ? '1 / 1' : '4 / 5';

  return (
    <div className="sv-gallery">
      <div ref={trackRef} className="sv-gallery__track" role="group" aria-label={`${product.name} — photos`}>
        {views.map((id, i) => (
          <div key={id ?? i} className="sv-gallery__item" data-gallery-item>
            <ShapeMedia
              id={id}
              alt={i === 0 ? product.name : `${product.name} — view ${i + 1}`}
              shape={shape}
              ratio={ratio}
              priority={i === 0}
              reveal={i === 0}
              placeholderLabel="Product photo needed"
              placeholderSpec={`${product.name} — view ${i + 1}`}
            />
          </div>
        ))}
      </div>

      {views.length > 1 && (
        <>
          <button
            type="button"
            className="sv-gallery__arrow sv-gallery__arrow--prev"
            aria-label="Previous view"
            onClick={() => scrollTo(active - 1)}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className="sv-gallery__arrow sv-gallery__arrow--next"
            aria-label="Next view"
            onClick={() => scrollTo(active + 1)}
          >
            <ChevronRight size={20} />
          </button>
          <div className="sv-gallery__dots" role="tablist" aria-label="Gallery views">
            {views.map((id, i) => (
              <button
                key={id ?? i}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-label={`View ${i + 1} of ${views.length}`}
                className="sv-gallery__dot"
                data-active={active === i}
                onClick={() => scrollTo(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
