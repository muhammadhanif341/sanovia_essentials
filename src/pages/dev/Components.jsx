import { useState } from 'react';
import { Heading, Overline, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { TextLink } from '@/components/ui/TextLink';
import { Tag } from '@/components/ui/Tag';
import { Card } from '@/components/ui/Card';
import { Accordion } from '@/components/ui/Accordion';
import { CheckboxField, SelectField, TextField, TextareaField } from '@/components/ui/Field';
import { RollLink } from '@/components/layout/RollLink';
import { ShapeMedia } from '@/components/media/ShapeMedia';
import { HeroVideo } from '@/components/media/HeroVideo';
import { Logo } from '@/components/media/Logo';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Price } from '@/components/product/Price';
import { AddToOrderList, OrderOnWhatsApp } from '@/components/product/OrderControls';
import { useOrderList } from '@/context/OrderListContext';
import { ArrowRight, WhatsApp } from '@/components/icons';
import { placeholderProducts } from '@/data/placeholders';
import { mediaStats } from '@/utils/media';

const SURFACE_DEMO = ['dark', 'ivory', 'plum'];

export function ControlsSection() {
  return (
    <>
      <Text className="sg-note">Every control on every surface. Hover, keyboard focus (Tab) and disabled states are live.</Text>
      {SURFACE_DEMO.map((s) => (
        <div key={s} data-surface={s} className="sg-surface" style={{ marginTop: 'var(--space-5)' }}>
          <Overline>{s}</Overline>
          <div className="sg-row">
            <Button>Primary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button iconAfter={<ArrowRight size={16} />}>With icon</Button>
            <Button iconBefore={<WhatsApp size={18} />}>WhatsApp</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="sg-row">
            <Button size="sm">Small (44px)</Button>
            <Button>Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="sg-row">
            <TextLink to="/shop">Internal link</TextLink>
            <TextLink href="https://www.instagram.com/" external>External link</TextLink>
            <TextLink plain to="/about">Plain link</TextLink>
            <Tag>Drop 01</Tag>
            <Tag tone="solid">Solid</Tag>
            <Tag tone="limited">Limited</Tag>
          </div>
        </div>
      ))}
    </>
  );
}

export function FormsSection() {
  const [agree, setAgree] = useState(false);
  return (
    <>
      <Text className="sg-note">Visible labels, hints and errors wired with aria-describedby / aria-invalid. Errors use icon + text, never colour alone.</Text>
      <div className="sg-grid" style={{ marginTop: 'var(--space-5)' }}>
        {['dark', 'ivory'].map((s) => (
          <form key={s} data-surface={s} className="sg-surface" onSubmit={(e) => e.preventDefault()} noValidate>
            <TextField label="Your name" name={`n-${s}`} autoComplete="name" required hint="As you'd like us to address you." />
            <TextField label="WhatsApp number" name={`p-${s}`} type="tel" inputMode="tel" autoComplete="tel" error="Enter a number with country code, e.g. +92 300 0000000." defaultValue="0300" />
            <SelectField label="Strap" name={`s-${s}`} options={[{ value: 'gold', label: 'Gold bracelet' }, { value: 'leather', label: 'Brown leather' }]} />
            <TextareaField label="Message" name={`m-${s}`} hint="Anything we should know?" />
            <CheckboxField label="Tell me when Drop 02 lands" checked={agree} onChange={(e) => setAgree(e.target.checked)} hint="Optional. One message per drop." />
            <div><Button type="submit" size="sm">Submit</Button></div>
          </form>
        ))}
      </div>

      <Heading level={3} size="h3" className="sg-sub">Accordion</Heading>
      <Accordion
        defaultOpen={['a']}
        items={[
          { id: 'a', title: 'What goes here?', content: 'Answers to questions the client confirms — shipping, returns, payment. Placeholder text only.' },
          { id: 'b', title: 'Keyboard behaviour', content: 'Each trigger is a button in a heading with aria-expanded; closed panels are inert.' },
        ]}
      />

      <Heading level={3} size="h3" className="sg-sub">Cards & navigation</Heading>
      <div className="sg-grid">
        <Card>
          <Overline accent>Raised</Overline>
          <Heading level={3}>Hairline frame</Heading>
          <Text muted>No shadows, no 8–16px radii. Hairlines do the structural work.</Text>
        </Card>
        <Card tone="outline" interactive>
          <Overline accent>Outline · interactive</Overline>
          <Heading level={3}>Hover the border</Heading>
          <Text muted>A card is not a control — real links go on headings.</Text>
        </Card>
      </div>
      <div className="sg-row" style={{ marginTop: 'var(--space-5)' }}>
        <div data-surface="dark" className="sg-surface sg-row">
          <RollLink to="/shop/watches">Watches</RollLink>
          <RollLink to="/shop/jewellery">Jewellery</RollLink>
          <RollLink to="/about">About</RollLink>
          <Text size="small" muted>← letter-roll links (the header uses these ≥1024px; below that, the menu).</Text>
        </div>
      </div>
    </>
  );
}

export function ProductSection() {
  const { openDrawer, count } = useOrderList();
  const [first, ...rest] = placeholderProducts;
  return (
    <>
      <Text className="sg-note">
        Fixtures are invented (dev only). Watch the grid recompose at 768 / 1024 / 1440: 2-up → 3-up → 3-up → 4-up, with a
        feature break every 7th card.
      </Text>
      <div className="sg-row" style={{ margin: 'var(--space-5) 0' }}>
        <Button variant="ghost" size="sm" onClick={openDrawer}>Open cart ({count})</Button>
        <Price amount={6500} />
        <Price amount={null} />
      </div>
      <ProductGrid products={placeholderProducts} label="Placeholder products" feature />

      <Heading level={3} size="h3" className="sg-sub">Card sizes & composition</Heading>
      <div className="sg-grid">
        <ProductCard product={first} index={1} />
        <ProductCard product={rest[2]} index={4} size="sm" />
        <div data-surface="ivory" className="sg-surface">
          <ProductCard product={rest[1]} index={3} />
        </div>
      </div>
      <div className="sg-row" style={{ marginTop: 'var(--space-5)' }}>
        <AddToOrderList product={first} />
        <OrderOnWhatsApp product={first} />
      </div>
    </>
  );
}

const SHAPES = [
  ['arch', '3 / 4'], ['oval', '3 / 4'], ['tonneau', '4 / 5'], ['circle', '1 / 1'], ['pill', '2 / 1'], ['rect', '4 / 5'],
];

export function MediaSection() {
  const stats = mediaStats();
  return (
    <>
      <Text className="sg-note">
        Media is discovered at build time from <code>src/assets/</code>; found now: {stats.images} image group(s),{' '}
        {stats.videos} video(s). With none supplied, every slot shows a labelled placeholder — the layout is already correct.
      </Text>
      <Heading level={3} size="h3" className="sg-sub">Shape masks</Heading>
      <div className="sg-grid">
        {SHAPES.map(([shape, ratio], i) => (
          <div key={shape} className="sv-stack" style={{ '--gap': 'var(--space-2)' }}>
            <ShapeMedia shape={shape} ratio={ratio} tone={['walnut', 'plum', 'espresso', 'cream'][i % 4]} placeholderLabel={shape} placeholderSpec={`ratio ${ratio}`} frame={i % 2 === 0} />
            <span className="t-small t-muted">{shape} · {ratio}</span>
          </div>
        ))}
      </div>
      <Heading level={3} size="h3" className="sg-sub">Scrims (text on photography)</Heading>
      <div className="sg-grid">
        {['bottom', 'top', 'full'].map((s) => (
          <ShapeMedia key={s} shape="rect" ratio="4 / 3" scrim={s} tone="plum" placeholderLabel={`scrim: ${s}`} />
        ))}
      </div>
      <Heading level={3} size="h3" className="sg-sub">Hero video slot</Heading>
      <HeroVideo ratio="16 / 9" />
      <Heading level={3} size="h3" className="sg-sub">Logo (placeholder — real files pending)</Heading>
      <div className="sg-row">
        <Logo variant="lockup" />
        <Logo variant="disc" />
        <Logo variant="wordmark" />
      </div>
    </>
  );
}
