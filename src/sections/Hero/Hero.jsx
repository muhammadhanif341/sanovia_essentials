import { Container } from '@/components/layout/primitives';
import { Button } from '@/components/ui/Button';
import { FrameFilm } from '@/components/media/FrameFilm';
import { LampGlow } from '@/components/motion/LampGlow';
import { Magnetic } from '@/components/motion/Magnetic';
import { ArrowRight, WhatsApp } from '@/components/icons';
import { useHeroFrames, useHeroIntro } from '@/hooks/useSectionMotion';
import { whatsappLink } from '@/utils/whatsapp';
import './hero.css';

/**
 * Cinematic hero — a full-viewport, scroll-driven product animation with the brand statement over it.
 *
 * COMPOSITION (recomposed per orientation, not scaled):
 *   landscape   film full-bleed; copy bottom-left, actions bottom-right, controls on the right edge
 *   portrait    the film becomes a feathered band under the header (so the watch is never cropped
 *               to its dial); copy and full-width actions sit below it
 *
 * MOTION:
 *   load     (GSAP, via useHeroIntro → animations/hero.js) veil lifts · film settles from a slow
 *            push-in · headline rises out of masked lines · supporting copy fades up · actions
 *            rise and settle · a hairline draws
 *   scroll   (useHeroFrames → animations/primitives/frameSequence.js) the hero stays pinned
 *            (CSS sticky, unchanged from Phase 3–6) while the frame sequence is scrubbed 1:1
 *            with scroll position across a dedicated inert spacer, `.sv-hero__runway`, rendered
 *            right after this `<section>` — see hero.css's architecture note for why the runway
 *            has to be a sibling rather than extra height on the section itself. Down opens the
 *            mechanism frame by frame, up closes it, no click/tap/play-button ever required.
 *            Once fully open, scrolling continues straight into the existing hand-off: the NEXT
 *            section slides over the (still-pinned) hero while the film pushes in and dims and
 *            the copy lifts away. That hand-off (animations/hero.js heroExit) is untouched by
 *            this — `useHeroIntro` below just skips the runway when it looks for "the next
 *            section" (hooks/useSectionMotion.js).
 *
 * The frame set (`src/assets/video/hero/frames/frame-001.jpg` … `frame-185.jpg`) is already
 * trimmed to just the closed→open half of the client-supplied 300-frame clip: the source footage
 * is a closed → open → closed LOOP (settles open ~frame 130–190, fully reassembled again by
 * ~frame 220), so frames past 185 are simply not shipped — using them would mean scrolling to
 * the end of the Hero shows a closed watch again, not open. Reverse playback (closing) comes for
 * free from scrolling back up through this same 185-frame range.
 *
 * The frame sequence itself is NOT gated on reduced motion or Save-Data — it's the product
 * animation, not decorative chrome, per the client's explicit brief (see useHeroFrames' own
 * comment). The entrance choreography and scroll hand-off above still are, same as always; the
 * `editorial/hero-hold` still only ever shows up if no frame assets are registered at all.
 */
export function Hero() {
  const { wrapperRef, canvasRef, runwayRef, active, stillId } = useHeroFrames({ id: 'hero' });
  useHeroIntro(wrapperRef, { exit: true });

  return (
    <>
      <section ref={wrapperRef} className="sv-hero" data-surface="darker" aria-labelledby="hero-title">
        <div className="sv-hero__plate" data-hero-plate>
          <div className="sv-hero__film" data-hero-media>
            <FrameFilm
              canvasRef={canvasRef}
              active={active}
              stillId={stillId}
              description="A two-tone rose-gold and steel watch with a diamond bezel lifts apart to show its movement, driven by scroll."
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

        {/* Scroll cue only — no play/pause control. The sequence is 100% scroll-position-driven
            (never plays on its own), so WCAG 2.2.2's "provide a way to pause moving content"
            doesn't apply here any more than it would to a native scrollbar. */}
        <div className="sv-hero__rail" data-hero-rail>
          <span className="sv-hero__cue" aria-hidden="true">
            <span className="sv-hero__cue-text">Scroll</span>
            <span className="sv-hero__cue-line" />
          </span>
        </div>

        {/* Lifts to reveal the film at load. Hidden by default in CSS, so it can never strand content. */}
        <div className="sv-hero__veil" data-hero-veil aria-hidden="true" />
      </section>

      {/* Inert scroll-runway spacer — only when the real frame sequence is active (never for the
          static-Picture fallback, which has nothing to scrub). Purely layout, no visual content;
          `data-hero-runway` lets useHeroIntro's hand-off look-up skip past it. See hero.css. */}
      {active && <div ref={runwayRef} className="sv-hero__runway" data-hero-runway aria-hidden="true" />}
    </>
  );
}
