import { useRef, useState } from 'react';
import { gsap } from '@/animations';
import { Button } from '@/components/ui/Button';
import { Overline, Text } from '@/components/ui/Typography';
import { ShapeMedia } from '@/components/media/ShapeMedia';
import { LampGlow } from '@/components/motion/LampGlow';
import { Magnetic } from '@/components/motion/Magnetic';
import { Marquee } from '@/components/motion/Marquee';
import { HorizontalScroller } from '@/components/motion/HorizontalScroller';
import { StickyStage } from '@/components/motion/StickyStage';
import { useHeroIntro, usePageMotion } from '@/hooks/useSectionMotion';

/* Motion lab: one small, real demo per primitive. Toggle the whole lab off/on to prove
   cleanup — the ScrollTrigger count in the page header must fall back to the baseline. */

function RevealDemo() {
  const ref = useRef(null);
  usePageMotion(ref);
  return (
    <div ref={ref} className="sv-stack" style={{ '--gap': 'var(--space-7)' }}>
      <h3 className="t-display-l" data-reveal="lines">
        Lines <em>reveal</em> inside masks
      </h3>
      <p className="t-h2" data-reveal="words">
        Words reveal quickly for short phrases.
      </p>
      <p className="t-h2 t-measure" data-reveal="scrub-words">
        Scrub illumination: these words light up one after another as you scroll through this paragraph, tied to the
        scrollbar rather than to time.
      </p>
      <div className="sg-grid">
        <ShapeMedia reveal parallax shape="arch" ratio="3 / 4" tone="plum" placeholderLabel="mask reveal + parallax" />
        <ShapeMedia reveal shape="oval" ratio="3 / 4" tone="espresso" placeholderLabel="mask reveal" />
        <div className="sv-stack" data-reveal="fade">
          <Overline accent>Fade group</Overline>
          <p className="t-body">Siblings entering together are staggered by ScrollTrigger.batch.</p>
        </div>
        <div className="sv-stack" data-reveal="fade">
          <Overline accent>Fade group</Overline>
          <p className="t-body">Nothing is hidden under reduced motion — content is simply present.</p>
        </div>
      </div>
    </div>
  );
}

function HeroStage() {
  const ref = useRef(null);
  useHeroIntro(ref);
  return (
    <div ref={ref} data-surface="darker" className="sv-lamp-host sg-demo" style={{ minHeight: '28rem' }}>
      <LampGlow />
      <div className="sv-stack" style={{ position: 'relative', zIndex: 1, '--gap': 'var(--space-5)' }}>
        <p className="t-overline t-accent" data-hero-fade>
          Drop 01
        </p>
        <h3 className="t-display-l" data-hero-headline>
          Minimal <em>everyday</em> essentials.
        </h3>
        <div className="sv-cluster" style={{ alignItems: 'flex-end' }}>
          <div style={{ width: 'min(12rem, 40vw)' }}>
            <ShapeMedia data-hero-media shape="arch" ratio="3 / 4" tone="plum" placeholderLabel="hero arch" />
          </div>
          <div style={{ width: 'min(6rem, 22vw)' }}>
            <ShapeMedia data-hero-detail shape="oval" ratio="3 / 4" tone="walnut" placeholderLabel="detail" />
          </div>
        </div>
        <div data-hero-fade>
          <Button size="sm">Order on WhatsApp</Button>
        </div>
      </div>
    </div>
  );
}

function HeroDemo() {
  const [run, setRun] = useState(0);
  return (
    <div className="sv-stack" style={{ '--gap': 'var(--space-4)' }}>
      <div>
        <Button size="sm" variant="ghost" onClick={() => setRun((r) => r + 1)}>
          Replay hero intro
        </Button>
      </div>
      <HeroStage key={run} />
    </div>
  );
}

function HorizontalDemo() {
  const cards = ['Tonneau', 'Oval', 'Rectangular', 'Stretch band', 'Leather strap', 'Bracelet'];
  return (
    <HorizontalScroller
      label="Placeholder Drop 01 watches"
      header={
        <div className="sv-container" style={{ paddingBottom: 'var(--space-4)' }}>
          <Overline accent>Drop 01 · horizontal scroll</Overline>
          <p className="t-h2">≥1024px: vertical scroll drives this row. Below: native swipe.</p>
        </div>
      }
    >
      {cards.map((name, i) => (
        <div key={name} className="sv-stack" style={{ '--gap': 'var(--space-3)' }}>
          <ShapeMedia shape={i % 2 ? 'oval' : 'tonneau'} ratio="4 / 5" tone={['walnut', 'plum', 'espresso'][i % 3]} placeholderLabel={name} />
          <span className="t-h3">{name}</span>
        </div>
      ))}
    </HorizontalScroller>
  );
}

function StickyDemo() {
  const build = (tl, { stage }) => {
    const layers = gsap.utils.toArray('[data-step]', stage);
    tl.to({}, { duration: layers.length }, 0); // fix total length: one unit per step
    layers.forEach((layer, i) => {
      if (i > 0) tl.fromTo(layer, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, i - 0.15);
      if (i < layers.length - 1) tl.to(layer, { autoAlpha: 0, duration: 0.3 }, i + 1 - 0.15);
    });
  };
  const steps = ['01 — Placed in tissue', '02 — Boxed', '03 — Sealed with the round sticker'];
  return (
    <StickyStage steps={steps.length} build={build} data-stage-demo data-surface="cream" className="sg-story">
      {steps.map((s) => (
        <div key={s} data-step className="sg-step">
          <p className="t-display-l">{s}</p>
        </div>
      ))}
    </StickyStage>
  );
}

export function MotionLab() {
  const [on, setOn] = useState(true);
  return (
    <>
      <div className="sg-row">
        <Button variant="ghost" size="sm" onClick={() => setOn((v) => !v)} aria-pressed={on}>
          {on ? 'Unmount motion demos' : 'Mount motion demos'}
        </Button>
        <Text size="small" muted>
          Toggle to verify cleanup: the ScrollTrigger count above drops to the baseline (header + ring) when unmounted.
        </Text>
      </div>
      {on && (
        <div className="sv-stack" style={{ '--gap': 'var(--space-9)', marginTop: 'var(--space-7)' }}>
          <RevealDemo />
          <HeroDemo />
          <div className="sg-row">
            <Magnetic>
              <Button>Magnetic primary CTA</Button>
            </Magnetic>
            <Text size="small" muted>Fine pointer only. Move toward it.</Text>
          </div>
          <Marquee label="Categories" items={['Watches', 'Necklaces', 'Rings', 'Bracelets', 'Gifting'].map((t) => <span key={t} className="t-h2">{t}</span>)} />
          <HorizontalDemo />
          <StickyDemo />
        </div>
      )}
    </>
  );
}
