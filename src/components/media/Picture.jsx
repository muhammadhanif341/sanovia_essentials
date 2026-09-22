import { getPicture } from '@/utils/media';

/**
 * Responsive <picture> for a registry id (see utils/media.js). Renders nothing when
 * the id has no files yet — ShapeMedia then shows a MediaPlaceholder.
 *
 * `alt` is required for content images; pass `decorative` for purely visual ones.
 * `priority` marks the LCP image (eager + high fetch priority); everything else lazy-loads.
 */
export function Picture({ id, alt = '', decorative, sizes = '100vw', priority, className }) {
  const pic = getPicture(id);
  if (!pic) return null;
  return (
    <picture>
      {pic.sources.map((s) => (
        <source key={s.type} type={s.type} srcSet={s.srcSet} sizes={sizes} />
      ))}
      <img
        className={className}
        src={pic.src}
        alt={decorative ? '' : alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
      />
    </picture>
  );
}
