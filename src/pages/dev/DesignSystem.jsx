import { useEffect, useState } from 'react';
import { Container, Section } from '@/components/layout/primitives';
import { Heading, Overline } from '@/components/ui/Typography';
import { useBreakpoint, useFinePointer, useReducedMotion } from '@/hooks/useMediaQuery';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ColourSection, LayoutSection, TypeSection } from './Foundations';
import { ControlsSection, FormsSection, MediaSection, ProductSection } from './Components';
import { MotionLab } from './MotionLab';
import './styleguide.css';

/**
 * Living design system + motion lab. DEVELOPMENT ONLY: registered in routes.jsx behind
 * import.meta.env.DEV, excluded from production builds and disallowed in robots.txt.
 * It is the visual test-bed for every token, component and animation primitive.
 */
const SECTIONS = [
  ['colour', 'Colour', ColourSection],
  ['type', 'Typography', TypeSection],
  ['layout', 'Space & grid', LayoutSection],
  ['controls', 'Controls', ControlsSection],
  ['forms', 'Forms & cards', FormsSection],
  ['product', 'Product UI', ProductSection],
  ['media', 'Image treatments', MediaSection],
  ['motion', 'Motion lab', MotionLab],
];

function useLiveEnv() {
  const [w, setW] = useState(window.innerWidth);
  const [triggers, setTriggers] = useState(0);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener('resize', onResize);
    const id = window.setInterval(() => setTriggers(window.__SV__?.ScrollTrigger.getAll().length ?? 0), 300);
    return () => {
      window.removeEventListener('resize', onResize);
      window.clearInterval(id);
    };
  }, []);
  return { w, triggers };
}

export default function DesignSystem() {
  useDocumentTitle('Design system');
  const bp = useBreakpoint();
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const { w, triggers } = useLiveEnv();

  return (
    <>
      <Section surface="dark" pad="flush" className="sv-page-head">
        <Container>
          <div className="sv-stack" style={{ '--gap': 'var(--space-5)' }}>
            <Overline accent>Development only</Overline>
            <Heading level={1} size="h1">
              Design system <em>&amp;</em> motion lab
            </Heading>
            <dl className="sg-readout" aria-label="Live environment">
              <div><dt>Viewport</dt><dd data-testid="env-width">{w}px</dd></div>
              <div><dt>Breakpoint</dt><dd data-testid="env-bp">{bp}</dd></div>
              <div><dt>Pointer</dt><dd>{fine ? 'fine (hover)' : 'coarse / no hover'}</dd></div>
              <div><dt>Reduced motion</dt><dd>{reduced ? 'on' : 'off'}</dd></div>
              <div><dt>Live ScrollTriggers</dt><dd data-testid="env-triggers">{triggers}</dd></div>
            </dl>
          </div>
        </Container>
      </Section>

      <nav className="sg-nav" aria-label="Design system sections">
        <ul>
          {SECTIONS.map(([id, label]) => (
            <li key={id}>
              <a className="t-overline" href={`#${id}`}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>

      {SECTIONS.map(([id, label, Body]) => (
        <Section key={id} id={id} surface="dark" pad="flush" className="sg-block">
          <Container>
            <div className="sg-title">
              <Heading level={2} size="h2">{label}</Heading>
            </div>
            <Body />
          </Container>
        </Section>
      ))}
    </>
  );
}
