import { useRef, useState } from 'react';
import { Container } from '@/components/layout/primitives';
import { Button } from '@/components/ui/Button';
import { FilmControl, FilmVideo } from '@/components/media/Film';
import { LampGlow } from '@/components/motion/LampGlow';
import { Magnetic } from '@/components/motion/Magnetic';
import { ArrowRight, WhatsApp } from '@/components/icons';
import { useFilm } from '@/hooks/useFilm';
import { useHeroIntro } from '@/hooks/useSectionMotion';
import { whatsappLink } from '@/utils/whatsapp';
import './hero.css';

/**
 * Cinematic hero — a full-viewport, product-focused film with the brand statement over it.
 *
 * COMPOSITION (recomposed per orientation, not scaled):
 *   landscape   film full-bleed; copy bottom-left, actions bottom-right, controls on the right edge
 *   portrait    the film becomes a feathered band under the header (so the watch is never cropped
 *               to its dial); copy and full-width actions sit below it
 *
 * MOTION (all GSAP, via useHeroIntro → animations/hero.js):
 *   load     veil lifts · film settles from a slow push-in · headline rises out of masked lines ·
 *            supporting copy fades up · actions rise and settle · a hairline draws
 *   scroll   the hero is `position: sticky`; the NEXT section slides over it while the film pushes
 *            in and dims and the copy lifts away — then the film is paused (`covered`)
 *
 * The film plays once and holds its last frame (front-on watch = the hero composition).
 * Reduced motion / Save-Data: no autoplay, no scroll choreography — the still frame and all copy.
 */
export function Hero() {
  const ref = useRef(null);
  const [covered, setCovered] = useState(false);
  const film = useFilm({ id: 'hero/hero', loop: false, suspended: covered });

  useHeroIntro(ref, { exit: true, onCovered: setCovered });

  return (
    <section ref={ref} className="sv-hero" data-surface="darker" aria-labelledby="hero-title">
      <div className="sv-hero__plate" data-hero-plate>
        <div className="sv-hero__film" data-hero-media>
          <FilmVideo
            film={film}
            description="A two-tone rose-gold and steel watch with a diamond bezel lifts apart to show its movement, then comes back together."
          />
        </div>
      </div>

      <div className="sv-hero__shade" aria-hidden="true" />
      <LampGlow />
      <div className="sv-hero__grain" aria-hidden="true" />
      <div className="sv-hero__dim" data-hero-dim aria-hidden="true" />

      <div className="sv-hero__content" data-hero-content>
        <Container>
          <div className="sv-hero__grid">
            <div className="sv-hero__copy">
              <p className="t-overline t-accent" data-hero-fade>
                Watches &amp; jewellery
              </p>
              <h1 id="hero-title" className="sv-hero__title" data-hero-headline>
                Minimal <em>everyday</em> essentials.
              </h1>
              <span className="sv-hero__rule" data-hero-rule aria-hidden="true" />
            </div>

            {/* The animated nodes are plain wrappers: a .sv-btn carries CSS transitions on opacity/color,
                and a CSS transition on a property GSAP is tweening makes GSAP read a mid-transition value
                as its end state (the button would stay invisible). Same rule for any data-hero-* / data-reveal target. */}
            <div className="sv-hero__actions">
              <div data-hero-cta>
                <Magnetic>
                  <Button to="/shop" iconAfter={<ArrowRight size={18} />}>
                    Shop the collection
                  </Button>
                </Magnetic>
              </div>
              <div data-hero-cta>
                <Button href={whatsappLink()} external variant="ghost" iconBefore={<WhatsApp size={18} />}>
                  Order on WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Controls + scroll cue. Outside the film layer so they are never scaled or covered. */}
      <div className="sv-hero__rail" data-hero-rail>
        <FilmControl film={film} />
        <span className="sv-hero__cue" aria-hidden="true">
          <span className="sv-hero__cue-text">Scroll</span>
          <span className="sv-hero__cue-line" />
        </span>
      </div>

      {/* Lifts to reveal the film at load. Hidden by default in CSS, so it can never strand content. */}
      <div className="sv-hero__veil" data-hero-veil aria-hidden="true" />
    </section>
  );
}
