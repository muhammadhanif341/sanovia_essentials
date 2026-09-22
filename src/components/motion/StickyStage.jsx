import { useRef } from 'react';
import { cn } from '@/utils/cn';
import { useStickyStage } from '@/hooks/useSectionMotion';
import './motion.css';

/**
 * Pinned scroll story, sticky-first (see animations/primitives/scrollStages.js).
 * `build(tl, { stage })` adds tweens to a scrubbed timeline spanning `steps` viewport-heights.
 * Below `minWidth` ('tabletUp' = ≥768, 'full' = ≥1024) or under reduced motion, children
 * render as ordinary stacked content — so they must be meaningful WITHOUT the scroll effect
 * (all content stays in DOM order for assistive tech).
 */
export function StickyStage({ steps = 3, build, minWidth = 'tabletUp', className, children, ...rest }) {
  const ref = useRef(null);
  useStickyStage(ref, build, { minWidth });
  return (
    <div ref={ref} className={cn('sv-stage', className)} data-stage style={{ '--stage-steps': steps }} {...rest}>
      <div className="sv-stage__sticky" data-stage-sticky>
        {children}
      </div>
    </div>
  );
}
