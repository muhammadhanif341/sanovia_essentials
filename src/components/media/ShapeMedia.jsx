import { cn } from '@/utils/cn';
import { getPicture } from '@/utils/media';
import { Picture } from './Picture';
import { MediaPlaceholder } from './MediaPlaceholder';
import './media.css';

/**
 * The site's signature frame: any image, video or placeholder inside an
 * arch / oval / tonneau / circle / pill / rect mask with a reserved aspect ratio
 * (so nothing shifts while loading).
 *
 * Content: `id` (registry image) → `children` (custom, e.g. <video>) → placeholder.
 *
 * Layer structure (so motion never fights the mask):
 *   .sv-media          shape mask (border-radius, overflow hidden)
 *     .sv-media__inner   reveal target (clip-path wipe)
 *       .sv-media__plx     parallax target (oversized)
 *         img / video / placeholder
 *
 * Motion opt-ins (handled by usePageMotion / useHeroIntro on an ancestor):
 *   reveal    → data-reveal="mask"       parallax → data-parallax="<percent>"
 *
 * shape: 'arch' | 'oval' | 'tonneau' | 'circle' | 'pill' | 'rect'
 * ratio: CSS aspect-ratio, e.g. '4 / 5' (use '1 / 1' with circle)
 * hoverId: second image swapped in on hover (fine pointers only)
 * objectPos: focal point, e.g. '50% 30%'
 */
export function ShapeMedia({
  id,
  hoverId,
  alt = '',
  decorative,
  children,
  shape = 'rect',
  ratio = '4 / 5',
  sizes,
  priority,
  scrim,
  frame,
  tone = 'walnut',
  placeholderLabel,
  placeholderSpec,
  reveal,
  parallax,
  zoom = true,
  objectPos,
  className,
  style,
  ...rest
}) {
  const hasImage = Boolean(id && getPicture(id));
  const hasHover = Boolean(hoverId && getPicture(hoverId));
  const parallaxAmount = parallax ? (parallax === true ? 8 : parallax) : undefined;

  return (
    <div
      className={cn('sv-media', className)}
      data-shape={shape}
      data-frame={frame || undefined}
      data-hover={hasHover || undefined}
      data-zoom={zoom || undefined}
      data-reveal={reveal ? 'mask' : undefined}
      data-parallax={parallaxAmount}
      style={{ '--ratio': ratio, ...(objectPos ? { '--object-pos': objectPos } : null), ...style }}
      {...rest}
    >
      <div className="sv-media__inner">
        <div className="sv-media__plx">
          {children ??
            (hasImage ? (
              <Picture id={id} alt={alt} decorative={decorative} sizes={sizes} priority={priority} className="sv-media__img" />
            ) : (
              <MediaPlaceholder
                label={placeholderLabel ?? (id ? `Photo needed` : 'Photo needed')}
                spec={placeholderSpec ?? id}
                tone={tone}
                alt={alt}
                decorative={decorative}
              />
            ))}
          {hasHover && <Picture id={hoverId} decorative sizes={sizes} className="sv-media__img sv-media__img--hover" />}
        </div>
      </div>
      {scrim && <span className="sv-media__scrim" data-scrim={scrim} aria-hidden="true" />}
    </div>
  );
}
