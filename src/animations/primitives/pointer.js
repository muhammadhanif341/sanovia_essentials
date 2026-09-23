/**
 * Pointer-driven primitives. Fine-pointer only: callers gate on the `fine`
 * matchMedia condition, and every function returns a cleanup for its listeners.
 */
import { gsap } from '../register';

/** Pull an element a little toward the cursor; spring back on leave. Primary CTAs only. */
export function magnetic(el, { strength = 0.35 } = {}) {
  const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });

  const onMove = (e) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - (r.left + r.width / 2)) * strength);
    yTo((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    xTo(0);
    yTo(0);
  };
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerleave', onLeave);
  return () => {
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerleave', onLeave);
  };
}

/**
 * A small label that follows the pointer inside `host` while it's hovered (fine pointer only) —
 * the "Order"/"View" cursor label from DESIGN-BLUEPRINT §7.5. `el` is the label element itself
 * (already positioned via CSS: absolute, opacity 0, translate(-50%,-50%)); this only drives its
 * x/y/opacity/scale. Purely decorative — `el` must be aria-hidden.
 */
export function cursorFollow(el, host) {
  gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.8 });
  const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });

  const place = (e) => {
    const r = host.getBoundingClientRect();
    xTo(e.clientX - r.left);
    yTo(e.clientY - r.top);
  };
  const onEnter = (e) => {
    place(e);
    gsap.to(el, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
  };
  const onLeave = () => gsap.to(el, { opacity: 0, scale: 0.8, duration: 0.2, ease: 'power2.in' });

  host.addEventListener('pointermove', place);
  host.addEventListener('pointerenter', onEnter);
  host.addEventListener('pointerleave', onLeave);
  return () => {
    host.removeEventListener('pointermove', place);
    host.removeEventListener('pointerenter', onEnter);
    host.removeEventListener('pointerleave', onLeave);
  };
}

/**
 * The "lamp": a warm radial light that follows the cursor inside `el`'s parent
 * (fine pointer) or drifts slowly on its own (touch). Both breathe gently.
 * See DESIGN-BLUEPRINT §1.2 — the lamp-glow motif from the reference reel.
 *
 * The breathe/drift tweens are infinite (`repeat: -1`) by design — but that means they'd
 * otherwise keep ticking forever once the lamp scrolls out of view (e.g. the Hero's lamp,
 * still mounted underneath the sheet that covers it), costing main-thread/compositor work on
 * every subsequent scroll for no visible result. Callers that can detect "now hidden" should
 * call `setCovered(true)`/`(false)` on the returned handle rather than let it run unseen.
 *
 * @returns {{ setCovered: (covered: boolean) => void, teardown: () => void }}
 */
export function lampGlow(el, { follow = true } = {}) {
  const area = el.parentElement;
  gsap.set(el, { xPercent: -50, yPercent: -50 });

  const breathe = gsap.to(el, { scale: 1.08, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  let drift = null;
  let onMove = null;

  if (!follow) {
    drift = gsap.to(el, { x: 40, y: -30, duration: 12, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  } else {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3' });
    onMove = (e) => {
      const r = area.getBoundingClientRect();
      xTo(e.clientX - r.left - r.width / 2);
      yTo(e.clientY - r.top - r.height / 2);
    };
    area.addEventListener('pointermove', onMove);
  }

  return {
    setCovered(covered) {
      if (covered) {
        breathe.pause();
        drift?.pause();
      } else {
        breathe.resume();
        drift?.resume();
      }
    },
    teardown() {
      if (onMove) area.removeEventListener('pointermove', onMove);
    },
  };
}
