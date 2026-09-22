import { cn } from '@/utils/cn';
import './controls.css';

/** Overline-style chip: "Drop 01", "Limited", "Most asked for". tone: 'outline' | 'solid' | 'limited' */
export function Tag({ tone = 'outline', className, children, ...rest }) {
  return (
    <span className={cn('sv-tag', tone === 'solid' && 'sv-tag--solid', tone === 'limited' && 'sv-tag--limited', className)} {...rest}>
      {children}
    </span>
  );
}
