import { WhatsApp } from '@/components/icons';
import { whatsappLink } from '@/utils/whatsapp';
import './motion.css';

/**
 * Persistent, quiet WhatsApp entry point — the site's real "contact us," since there is
 * no other backend. Deliberately small and low-contrast until hovered/focused: one per
 * site, not shouting on every page. Number comes from data/site.js → VITE_WHATSAPP_NUMBER.
 *
 * Lives inside the normal Layout tree (not a portal), so it correctly goes `inert` with
 * the rest of the page while a dialog is open — never floats clickable above an overlay.
 */
export function WhatsAppFab() {
  return (
    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="sv-fab" aria-label="Chat with Sanovia on WhatsApp">
      <WhatsApp size={22} />
      <span className="sv-fab__tip" aria-hidden="true">
        Chat with us
      </span>
      <span className="sv-sr-only"> (opens in a new tab)</span>
    </a>
  );
}
