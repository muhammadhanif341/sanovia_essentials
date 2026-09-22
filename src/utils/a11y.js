/**
 * Announce a message to screen readers via the polite live region in index.html.
 * The region sits OUTSIDE #root (which becomes `inert` while a dialog is open), so
 * announcements still work from inside dialogs.
 */
export function announce(message) {
  const el = document.getElementById('sv-live');
  if (!el) return;
  el.textContent = '';
  // Re-set on the next task so identical consecutive messages are re-announced.
  window.setTimeout(() => {
    el.textContent = message;
  }, 50);
}
