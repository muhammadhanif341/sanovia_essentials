import { Container } from '@/components/layout/primitives';
import { Button } from '@/components/ui/Button';
import { StickyStage } from '@/components/motion/StickyStage';
import { ArrowRight } from '@/components/icons';
import { scrollStoryBuild } from '@/animations';
import './scrollStory.css';

const FRAMES = [
  { n: '01', title: 'Chosen', body: 'Each piece is chosen before it is listed — not mass-produced, not guessed at.' },
  {
    n: '02',
    title: 'Wrapped',
    body: 'Tissue, a box, a hand-tied ribbon. Packed like a gift, because it usually is one.',
  },
  { n: '03', title: 'Sent', body: 'A real person replies on WhatsApp — not a script, not a queue.' },
  { n: '04', title: 'Worn', body: 'Small enough for every day. That is the whole idea.', cta: true },
];

/**
 * Cinematic Scroll Story — the one PINNED stage on the landing page (StickyStage, sticky-first:
 * see animations/primitives/scrollStages.js). Below tablet width, or under reduced motion, the
 * same four frames simply stack as ordinary sections — the story is complete without the pin.
 */
export function ScrollStory() {
  return (
    <StickyStage
      steps={FRAMES.length}
      build={scrollStoryBuild}
      minWidth="tabletUp"
      data-surface="darker"
      className="story"
      aria-label="How a Sanovia order comes together"
    >
      {FRAMES.map((f) => (
        <div key={f.n} className="story__frame" data-story-frame>
          <Container size="narrow">
            <div className="story__inner">
              <span className="t-numeral story__numeral" aria-hidden="true">
                {f.n}
              </span>
              <p className="t-overline t-accent">{f.n}</p>
              <h2 className="t-display-l">{f.title}.</h2>
              <p className="t-body-l t-muted story__body">{f.body}</p>
              {f.cta && (
                <div className="story__cta">
                  <Button to="/shop" iconAfter={<ArrowRight size={18} />}>
                    Shop the collection
                  </Button>
                </div>
              )}
            </div>
          </Container>
        </div>
      ))}
    </StickyStage>
  );
}
