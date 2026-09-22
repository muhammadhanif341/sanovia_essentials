import { useLayoutEffect, useRef, useState } from 'react';
import { Grid, GridItem } from '@/components/layout/primitives';
import { Heading, Overline, Text } from '@/components/ui/Typography';

/* ---------- live contrast measurement (rendered colours, not assumptions) ---------- */
const parse = (rgb) => rgb.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [0, 0, 0];
const lum = ([r, g, b]) => {
  const f = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Text sample that reports its own rendered contrast against the surface it sits on. */
function Measured({ children, className, min = 4.5 }) {
  const ref = useRef(null);
  const [r, setR] = useState(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const surface = el.closest('.sg-surface');
    setR(ratio(parse(getComputedStyle(el).color), parse(getComputedStyle(surface).backgroundColor)));
  }, []);
  return (
    <p ref={ref} className={className}>
      {children}
      {r != null && (
        <span className="t-small" style={{ marginLeft: '0.75em', opacity: 0.85 }}>
          {r.toFixed(2)}:1 {r >= min ? '✓' : '✗ FAIL'}
        </span>
      )}
    </p>
  );
}

const PALETTE = [
  ['espresso-950', '#160D08'], ['espresso-900', '#1E120B'], ['espresso-800', '#2A1A11'], ['espresso-700', '#3A2417'],
  ['walnut-600', '#5A3A28'], ['champagne-300', '#E2C99A'], ['champagne-400', '#C9A66B'], ['champagne-500', '#B08A4E'],
  ['brass-700', '#7D5A22'], ['brass-800', '#654716'], ['ivory-50', '#F7F1E7'], ['cream-100', '#EDE3D3'],
  ['sand-200', '#DCCDB5'], ['taupe-600', '#6B5A4A'], ['ink', '#1C120C'], ['plum-800', '#33223B'],
  ['plum-700', '#4A3352'], ['burgundy-600', '#7A1F2B'], ['burgundy-300', '#D98A93'], ['mailer-300', '#C7D0D8'],
];
const SURFACES = ['dark', 'darker', 'raised', 'ivory', 'cream', 'plum'];

export function ColourSection() {
  return (
    <>
      <Text className="sg-note">
        Components only use semantic tokens (<code>--surface</code>, <code>--fg</code>, <code>--accent</code>…). Each
        surface redefines them, so any component works on any surface. Ratios below are measured from the rendered
        pixels; <code>npm run check:contrast</code> guards the same pairs from the CSS source.
      </Text>

      <Heading level={3} size="h3" className="sg-sub">Surfaces</Heading>
      <div className="sg-grid">
        {SURFACES.map((s) => (
          <div key={s} data-surface={s} className="sg-surface">
            <Overline>{s}</Overline>
            <Measured className="t-body">Body text on {s}</Measured>
            <Measured className="t-body t-muted">Muted text</Measured>
            <Measured className="t-body t-accent">Accent text (gold / brass)</Measured>
          </div>
        ))}
      </div>

      <Heading level={3} size="h3" className="sg-sub">Primitives</Heading>
      <div className="sg-grid">
        {PALETTE.map(([name, hex]) => (
          <div key={name} className="sg-swatch">
            <div className="sg-swatch__chip" style={{ background: `var(--${name})` }} />
            <span>--{name}</span>
            <span style={{ color: 'var(--fg-muted)' }}>{hex}</span>
          </div>
        ))}
      </div>

      <Heading level={3} size="h3" className="sg-sub">Rule: gold on light</Heading>
      <div className="sg-grid">
        <div data-surface="ivory" className="sg-surface">
          <Overline>Correct</Overline>
          <Measured className="t-body t-accent">Brass on ivory (accent token)</Measured>
        </div>
        <div className="sg-surface" style={{ background: 'var(--ivory-50)' }}>
          <Overline style={{ color: 'var(--ink)' }}>Wrong — never do this</Overline>
          <p className="t-body" style={{ color: 'var(--champagne-400)' }}>
            Logo-gold text on ivory <span className="t-small">(2.04:1 ✗)</span>
          </p>
        </div>
      </div>
    </>
  );
}

const TYPE_ROWS = [
  ['display-xl', 'Minimal everyday essentials.'],
  ['display-l', 'Quiet gold, worn daily'],
  ['h1', 'Page title in Cormorant'],
  ['h2', 'Section title'],
  ['h3', 'Product name — Tonneau'],
  ['quote', 'The one watch that suits every outfit.'],
];

export function TypeSection() {
  return (
    <>
      <div className="sv-stack" style={{ '--gap': 'var(--space-6)' }}>
        {TYPE_ROWS.map(([size, sample]) => (
          <div key={size}>
            <Overline>{size}</Overline>
            <p className={`t-${size}`}>{sample}</p>
          </div>
        ))}
        <div>
          <Overline>Headline with the signature accent word</Overline>
          <Heading level={2} size="display-l">
            Minimal <em>everyday</em> essentials.
          </Heading>
        </div>
        <div>
          <Overline>body-l · Jost 300</Overline>
          <p className="t-body-l t-measure">
            Small-face gold watches and delicate layered necklaces — pieces meant to be worn every day.
          </p>
        </div>
        <div>
          <Overline>body · Jost 400 · 16px min</Overline>
          <p className="t-body t-measure">
            Body copy is never below 16px. Line height 1.65, measure capped at 62 characters for comfortable reading.
          </p>
        </div>
        <div>
          <Overline>small · price · overline</Overline>
          <p className="t-small">Caption and meta text at 14px.</p>
          <p className="t-price" style={{ marginTop: 'var(--space-2)' }}>PKR 6,500</p>
        </div>
      </div>
    </>
  );
}

export function LayoutSection() {
  return (
    <>
      <Heading level={3} size="h3" className="sg-sub">Space scale (4px base, 8-pt steps)</Heading>
      <div className="sv-stack" style={{ '--gap': 'var(--space-2)' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <div key={n} className="sv-cluster" style={{ '--gap': 'var(--space-4)' }}>
            <span className="t-small" style={{ width: '5.5rem' }}>--space-{n}</span>
            <div className="sg-bar" style={{ width: `var(--space-${n})` }} />
          </div>
        ))}
      </div>

      <Heading level={3} size="h3" className="sg-sub">Grid: 4 → 8 → 12 columns (resize the window)</Heading>
      <Text className="sg-note">
        Items declare placement per breakpoint. This block spans 4 of 4 on mobile, 4 of 8 on tablet, 4 of 12 on laptop
        — recomposed, not scaled.
      </Text>
      <Grid style={{ marginTop: 'var(--space-4)' }}>
        <GridItem span={{ base: 4, md: 4, lg: 4 }}><div className="sg-colcell" /></GridItem>
        <GridItem span={{ base: 4, md: 4, lg: 4 }}><div className="sg-colcell" /></GridItem>
        <GridItem span={{ base: 4, md: 8, lg: 4 }}><div className="sg-colcell" /></GridItem>
        <GridItem span={{ base: 2, md: 2, lg: 3 }}><div className="sg-colcell" /></GridItem>
        <GridItem span={{ base: 2, md: 6, lg: 9 }}><div className="sg-colcell" /></GridItem>
      </Grid>

      <Heading level={3} size="h3" className="sg-sub">Breakpoints & containers</Heading>
      {/* A wide table scrolls inside its own region (focusable, so keyboard users can scroll it) instead of widening the page. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div className="sg-scroll" role="region" aria-label="Breakpoints table" tabIndex={0}>
      <table className="t-small" style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '40rem' }}>
        <caption className="sv-sr-only">Breakpoints</caption>
        <thead>
          <tr>
            {['Class', 'Range', 'Design width', 'Columns', 'Gutter'].map((h) => (
              <th key={h} scope="col" style={{ textAlign: 'left', padding: '0.5rem 0.75rem 0.5rem 0', color: 'var(--fg-muted)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ['Mobile', '< 768', '390', '4', 'clamp(20px, 5vw, 80px)'],
            ['Tablet', '768–1023', '820', '8', '〃'],
            ['Laptop', '1024–1439', '1280', '12', '〃'],
            ['Desktop', '≥ 1440', '1536 (max 1440 content)', '12', '〃'],
          ].map((row) => (
            <tr key={row[0]} style={{ borderTop: '1px solid var(--hairline)' }}>
              {row.map((c, i) => (
                <td key={i} style={{ padding: '0.5rem 0.75rem 0.5rem 0' }}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}
