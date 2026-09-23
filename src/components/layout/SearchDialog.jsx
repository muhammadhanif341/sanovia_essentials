import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { Close, Search, WhatsApp } from '@/components/icons';
import { getAllProducts, searchProducts } from '@/services/productRepository';
import { primaryNav } from '@/data/navigation';
import { whatsappLink } from '@/utils/whatsapp';
import './chrome.css';

const SUGGESTIONS = primaryNav.slice(1, 4); // Watches · Jewellery · Collections

/**
 * Search overlay: a panel that drops from the top. Filters the catalogue live (name / category) and
 * submits to /shop?q=… . While the catalogue is still empty it says so and offers WhatsApp, rather
 * than implying results. Focus lands in the field; Esc closes; results are announced politely.
 */
export function SearchDialog({ open, onClose }) {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const results = useMemo(() => searchProducts(q, 6), [q]);

  const submit = (e) => {
    e.preventDefault();
    if (!q) return;
    onClose();
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <Dialog open={open} onClose={onClose} label="Search" side="top" surface="darker" initialFocusRef={inputRef} className="sv-search">
      <form role="search" className="sv-search__form" onSubmit={submit}>
        <div className="sv-search__bar">
          <label htmlFor="sv-search-input" className="t-overline t-accent">
            Search
          </label>
          <button type="button" className="sv-dialog__close" aria-label="Close search" onClick={onClose}>
            <Close size={24} />
          </button>
        </div>
        <div className="sv-search__field">
          <Search size={26} />
          <input
            ref={inputRef}
            id="sv-search-input"
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            spellCheck="false"
            placeholder="Watches, jewellery…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </form>

      <div className="sv-search__body" aria-live="polite">
        {!q && (
          <div className="sv-search__suggest">
            <p className="t-overline t-muted">Browse</p>
            <ul>
              {SUGGESTIONS.map((link) => (
                <li key={link.to}>
                  <TransitionLink to={link.to} className="sv-search__link t-h2" onClick={onClose}>
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        {q && results.length > 0 && (
          <ul className="sv-search__results" aria-label={`${results.length} results`}>
            {results.map((p) => (
              <li key={p.slug}>
                <TransitionLink to={`/product/${p.slug}`} className="sv-search__link t-h3" onClick={onClose}>
                  {p.name}
                </TransitionLink>
              </li>
            ))}
          </ul>
        )}

        {q && results.length === 0 && (
          <div className="sv-stack" style={{ '--gap': 'var(--space-4)' }}>
            <p className="t-body-l">
              {getAllProducts().length === 0 ? 'The catalogue is on its way.' : `Nothing matches “${query.trim()}”.`}
            </p>
            <p className="t-small t-muted">Tell us what you are looking for and we will help you find a piece.</p>
            <div>
              <Button href={whatsappLink()} external variant="ghost" size="sm" iconBefore={<WhatsApp size={18} />}>
                Ask on WhatsApp
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
