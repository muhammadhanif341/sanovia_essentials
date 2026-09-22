import { Container } from '@/components/layout/primitives';
import { Heading, Overline } from '@/components/ui/Typography';
import { HorizontalScroller } from '@/components/motion/HorizontalScroller';
import { ShapeMedia } from '@/components/media/ShapeMedia';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { ArrowUpRight } from '@/components/icons';
import './collectionShowcase.css';


const STOPS = [
  { to: '/shop/watches', label: 'Watches', shape: 'tonneau', copy: 'Small-face cases for every day.' },
  { to: '/shop/jewellery', label: 'Jewellery', shape: 'oval', copy: 'Layered chains and thin gold-tone bands.' },
  { to: '/drops/01', label: 'Drop 01', shape: 'arch', copy: 'The first curated drop.' },
  { to: '/collections', label: 'Collections', shape: 'rect', copy: 'Every way to browse Sanovia.' },
  { to: '/about', label: 'About', shape: 'pill', copy: 'How we choose and pack each piece.' },
];

/**
 * Collection Showcase — horizontal movement (see HorizontalScroller: sticky-scrubbed at
 * ≥1024px with motion allowed, a native swipeable scroll-snap row everywhere else).
 */
export function CollectionShowcase() {
  return (
    <div data-surface="ivory" className="showcase">
      <HorizontalScroller
        label="Browse Sanovia"
        header={
          <Container className="showcase__head">
            <Overline accent data-reveal="fade">
              Find your way in
            </Overline>
            <Heading level={2} size="h1" data-reveal="lines">
              A collection for every reason.
            </Heading>
          </Container>
        }
      >
        {STOPS.map((s) => (
          <TransitionLink key={s.to} to={s.to} className="showcase__card">
            <ShapeMedia
              id={null}
              shape={s.shape}
              ratio={s.shape === 'oval' ? '1 / 1' : '4 / 5'}
              tone="cream"
              reveal
              placeholderLabel="Photo needed"
              placeholderSpec={s.label}
              alt={s.label}
            />
            <span className="showcase__title t-h3">
              {s.label}
              <ArrowUpRight size={18} />
            </span>
            <span className="showcase__copy t-small t-muted">{s.copy}</span>
          </TransitionLink>
        ))}
      </HorizontalScroller>
    </div>
  );
}
