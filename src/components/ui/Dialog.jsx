import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { useFocusTrap, useScrollLock, useInertBackground } from '@/hooks/useOverlay';
import './dialog.css';

const EXIT_MS = 460; // > the longest CSS exit transition (--dur-cine .. with headroom)

/**
 * Modal surface. Handles what every modal needs, once:
 *   • portals to <body>; the app root becomes `inert` (AT, Tab and clicks can't leak)
 *   • focus moves in, is trapped, Esc closes, focus returns to the trigger
 *   • page scroll is locked (ref-counted)
 *   • click/tap on the backdrop closes
 * Visual enter/exit is CSS, keyed off data-state, so there is nothing to clean up — unless
 * `motion="external"`: then the caller (e.g. the mobile menu) choreographs the panel with GSAP,
 * the CSS transitions step aside, and `exitMs` must cover that animation's exit.
 *
 * side: 'drawer' (bottom sheet on mobile → right drawer ≥768) | 'top' (panel drops from the top edge)
 *       | 'fullscreen' (circular wipe, or caller-driven with motion="external")
 * origin: {x,y} px the fullscreen wipe grows from (e.g. the menu button centre)
 * surface: colour surface for the panel (default 'raised')
 * motion: 'css' (default) | 'external'
 * exitMs: how long the panel stays mounted after `open` goes false
 */
export function Dialog({
  open,
  onClose,
  label,
  labelledBy,
  side = 'drawer',
  surface = 'raised',
  motion = 'css',
  exitMs = EXIT_MS,
  origin,
  initialFocusRef,
  className,
  children,
}) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const panelRef = useRef(null);

  // Two-phase presence: mount → (next frames) data-state=open; close → data-state=closed → unmount.
  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(raf);
    }
    setShown(false);
    const t = window.setTimeout(() => setMounted(false), exitMs);
    return () => window.clearTimeout(t);
  }, [open, exitMs]);

  useFocusTrap(panelRef, { active: open && mounted, initialFocusRef, onEscape: onClose });
  useScrollLock(mounted);
  // Tied to `open` (not `mounted`): the page must become reachable again the moment the
  // dialog starts closing, so focus can be handed back to the trigger immediately.
  useInertBackground(open && mounted);

  if (!mounted) return null;

  return createPortal(
    <div
      className="sv-dialog"
      role="presentation"
      data-side={side}
      data-motion={motion}
      data-state={open && shown ? 'open' : 'closed'}
      style={origin ? { '--ox': `${origin.x}px`, '--oy': `${origin.y}px` } : undefined}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={labelledBy ? undefined : label}
        aria-labelledby={labelledBy}
        tabIndex={-1}
        data-surface={surface}
        className={cn('sv-dialog__panel', className)}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
