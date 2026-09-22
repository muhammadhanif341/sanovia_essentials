import { Picture } from './Picture';
import './media.css';

/**
 * The hero's film, canvas-driven: a scroll-scrubbed frame sequence when `active` (frame assets
 * exist — see `useHeroFrames`, hooks/useSectionMotion.js; NOT gated on reduced motion or
 * Save-Data, this is the product animation itself), otherwise a single still (only when no
 * frames are registered at all). Reuses `.sv-film` / `.sv-film__el` from <FilmVideo/> — same
 * box, same fill-parent contract — just a different element inside it.
 *
 * Purely decorative (aria-hidden); the page's headline and actions carry the message, but
 * WCAG 1.2.1 asks for a text alternative to visual-only content, so `description` is exposed
 * as visually-hidden text — same contract as <FilmVideo/>.
 */
export function FrameFilm({ canvasRef, active, stillId, description, className }) {
  return (
    <div className={['sv-film', className].filter(Boolean).join(' ')}>
      {active ? (
        <canvas ref={canvasRef} className="sv-film__el" aria-hidden="true" />
      ) : (
        <Picture id={stillId} decorative priority className="sv-film__el" />
      )}
      {description && <p className="sv-sr-only">{description}</p>}
    </div>
  );
}
