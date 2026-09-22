import { useCallback, useEffect, useRef, useState } from 'react';
import { getPicture, getVideo } from '@/utils/media';
import { useReducedMotion } from './useMediaQuery';

/**
 * Playback logic for a background "film" (the hero video) — everything except pixels.
 * Pair it with <FilmVideo film={film}/> and <FilmControl film={film}/> (components/media/Film.jsx);
 * they are separate on purpose so a page can put the control OUTSIDE the transformed film layer.
 *
 * Policy:
 *   • muted, inline, no sound ever
 *   • reduced motion or Save-Data → does NOT autoplay and never preloads; the still "hold" frame
 *     is shown and the visitor can press play (a user-initiated action is always allowed)
 *   • autoplay blocked by the browser (iOS Low Power Mode…) → falls back to the same still + play button
 *   • pauses while off-screen (`observe`) or while a page says it is covered (`suspended`), and
 *     resumes after — unless the visitor paused it themselves
 *   • plays once and HOLDS the last frame by default (`loop: false`): the final frame is the hero
 *     composition. A replay button appears when it ends.
 *
 * @param {object}  o
 * @param {string}  [o.id]        video id → src/assets/video/<id>.mp4|webm
 * @param {string}  [o.posterId]  image shown while loading — the film's first frame, so the start is seamless
 * @param {string}  [o.holdId]    image shown when the film is not playing automatically — its best still
 * @param {boolean} [o.loop]
 * @param {boolean} [o.suspended] a parent says the film is not visible (e.g. covered by the next section)
 * @param {boolean} [o.observe]   pause when scrolled out of view
 */
export function useFilm({
  id = 'hero/hero',
  posterId = 'editorial/hero-poster',
  holdId = 'editorial/hero-hold',
  loop = false,
  suspended = false,
  observe = true,
} = {}) {
  const source = getVideo(id);
  const reduced = useReducedMotion();
  const saveData = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
  const auto = !reduced && !saveData;

  const ref = useRef(null);
  const userPaused = useRef(false);
  const suspendedRef = useRef(suspended);
  const [status, setStatus] = useState('idle'); // idle | playing | paused | ended

  // Autoplaying → the first frame (seamless hand-off to video); otherwise the best still.
  const stillId = getPicture(auto ? posterId : holdId) ? (auto ? posterId : holdId) : getPicture(posterId) ? posterId : holdId;
  const still = getPicture(stillId);

  const tryPlay = useCallback(() => {
    const el = ref.current;
    if (!el || el.ended || userPaused.current || suspendedRef.current) return;
    el.muted = true; // the muted *property* is what autoplay policies check; React only sets the attribute
    el.play().catch(() => setStatus('paused')); // blocked → still frame + play button
  }, []);

  // Parent-controlled suspension (covered by the next section).
  useEffect(() => {
    suspendedRef.current = suspended;
    const el = ref.current;
    if (!el || !auto) return;
    if (suspended) el.pause();
    else tryPlay();
  }, [suspended, auto, tryPlay]);

  // Off-screen pause / on-screen resume.
  useEffect(() => {
    const el = ref.current;
    if (!el || !auto || !observe || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) tryPlay();
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [auto, observe, source, tryPlay]);

  // Background tabs shouldn't decode video.
  useEffect(() => {
    const el = ref.current;
    if (!el || !auto) return undefined;
    const onVisibility = () => (document.hidden ? el.pause() : tryPlay());
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [auto, source, tryPlay]);

  const toggle = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (el.ended) {
      el.currentTime = 0;
      userPaused.current = false;
      el.muted = true;
      el.play().catch(() => setStatus('paused'));
    } else if (el.paused) {
      userPaused.current = false;
      el.muted = true;
      el.play().catch(() => setStatus('paused'));
    } else {
      userPaused.current = true;
      el.pause();
    }
  }, []);

  const videoProps = {
    ref,
    muted: true,
    playsInline: true,
    loop,
    autoPlay: auto,
    preload: auto ? 'auto' : 'none',
    poster: still?.src,
    onPlay: () => setStatus('playing'),
    onPause: () => {
      if (!ref.current?.ended) setStatus('paused');
    },
    onEnded: () => setStatus('ended'),
  };

  return { source, ref, auto, status, toggle, stillId, still, videoProps };
}
