import { Picture } from './Picture';
import { MediaPlaceholder } from './MediaPlaceholder';
import { Pause, Play, Replay } from '@/components/icons';
import './media.css';

/**
 * The film itself: a <video> when a file exists, otherwise the still frame, otherwise a
 * labelled placeholder. The element is decorative for assistive tech (aria-hidden) — the page's
 * headline and actions carry the message — but WCAG 1.2.1 asks for a text alternative to
 * video-only content, so `description` is exposed as visually-hidden text.
 *
 * Fills its parent (position: absolute; inset: 0) and covers it; focal point via `objectPos`.
 */
export function FilmVideo({ film, description, label = 'Hero film', spec = 'Drop hero.mp4 into src/assets/video/hero/', className }) {
  const { source, videoProps, stillId, still } = film;

  let media;
  if (source) {
    media = (
      // The film has no audio track at all (encoded with -an), so captions do not apply; `muted` is
      // stated literally here so the a11y linter (and readers) can see it.
      <video muted className="sv-film__el" aria-hidden="true" tabIndex={-1} {...videoProps}>
        {source.webm && <source src={source.webm} type="video/webm" />}
        {source.mp4 && <source src={source.mp4} type="video/mp4" />}
      </video>
    );
  } else if (still) {
    media = <Picture id={stillId} decorative priority className="sv-film__el" />;
  } else {
    media = <MediaPlaceholder label={label} spec={spec} tone="espresso" />;
  }

  return (
    <div className={['sv-film', className].filter(Boolean).join(' ')}>
      {media}
      {description && <p className="sv-sr-only">{description}</p>}
    </div>
  );
}

const CONTROL = {
  playing: { label: 'Pause background film', Icon: Pause },
  ended: { label: 'Replay background film', Icon: Replay },
  paused: { label: 'Play background film', Icon: Play },
  idle: { label: 'Play background film', Icon: Play },
};

/** Pause / play / replay. WCAG 2.2.2: moving content that lasts > 5 s must be pausable. */
export function FilmControl({ film, className }) {
  if (!film.source) return null;
  // While the first frames are loading the film is effectively "playing" if it will autoplay.
  const status = film.status === 'idle' && film.auto ? 'playing' : film.status;
  const { label, Icon } = CONTROL[status];
  return (
    <button type="button" className={['sv-film-ctl', className].filter(Boolean).join(' ')} onClick={film.toggle} aria-label={label}>
      <Icon size={18} />
    </button>
  );
}
