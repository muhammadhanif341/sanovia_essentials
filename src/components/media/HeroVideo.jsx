import { useFilm } from '@/hooks/useFilm';
import { FilmControl, FilmVideo } from './Film';
import { ShapeMedia } from './ShapeMedia';

/**
 * Stand-alone hero-video slot inside a ShapeMedia frame (used by the style guide and any page
 * that wants the film in a mask). The Phase 3 hero composes the lower-level pieces instead —
 * `useFilm` + `<FilmVideo/>` + `<FilmControl/>` — so it can place the control outside its
 * transformed film layer.
 *
 * The final film is supplied as files (no code change):
 *   src/assets/video/hero/hero.mp4     H.264, ≤ 1280×720, no audio, ≲ 1.5 MB
 *   src/assets/images/editorial/hero-poster-<w>.avif|webp|jpg   first frame (poster / LCP)
 *   src/assets/images/editorial/hero-hold-<w>.avif|webp|jpg     best still (reduced motion / blocked autoplay)
 * See src/assets/README.md for the encode command.
 */
export function HeroVideo({ id = 'hero/hero', shape = 'rect', ratio = '16 / 9', className, description, ...rest }) {
  const film = useFilm({ id });
  return (
    <div className="sv-herovideo">
      <ShapeMedia shape={shape} ratio={ratio} className={className} zoom={false} tone="espresso" {...rest}>
        <FilmVideo film={film} description={description} />
      </ShapeMedia>
      <FilmControl film={film} className="sv-film-ctl--corner" />
    </div>
  );
}
