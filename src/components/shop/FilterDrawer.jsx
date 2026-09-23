import { useRef } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { TextField, CheckboxField } from '@/components/ui/Field';
import { Close } from '@/components/icons';
import { site } from '@/data/site';
import './shopToolbar.css';

/**
 * Filters as a real Dialog (bottom sheet on phones, right drawer from tablet up — same
 * primitive the cart and Quick View already use), not an inline disclosure panel. Answers
 * the brief's "filters become an accessible drawer/sheet on mobile" without a bespoke
 * mobile-only component: the Dialog already handles that responsively.
 */
export function FilterDrawer({
  open,
  onClose,
  typeLabel,
  typeOptions,
  selectedTypes,
  onToggleType,
  hideUnavailable,
  onToggleAvailability,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onClear,
  resultCount,
}) {
  const closeRef = useRef(null);

  return (
    <Dialog open={open} onClose={onClose} labelledBy="sv-filters-title" side="drawer" initialFocusRef={closeRef}>
      <div className="sv-dialog__bar">
        <h2 id="sv-filters-title" className="t-h3">
          Filters
        </h2>
        <button ref={closeRef} type="button" className="sv-dialog__close" aria-label="Close filters" onClick={onClose}>
          <Close size={22} />
        </button>
      </div>

      <div className="sv-filters">
        <div className="sv-filters__body">
          {typeOptions.length > 0 && (
            <fieldset className="sv-filters__group">
              <legend className="sv-filters__legend t-overline">{typeLabel}</legend>
              <div className="sv-filters__options">
                {typeOptions.map((opt) => (
                  <CheckboxField
                    key={opt}
                    label={opt}
                    checked={selectedTypes.includes(opt)}
                    onChange={() => onToggleType(opt)}
                  />
                ))}
              </div>
            </fieldset>
          )}

          <fieldset className="sv-filters__group">
            <legend className="sv-filters__legend t-overline">Availability</legend>
            <CheckboxField
              label="Hide out-of-stock & coming soon"
              checked={hideUnavailable}
              onChange={(e) => onToggleAvailability(e.target.checked)}
            />
          </fieldset>

          {site.showPrices && (
            <fieldset className="sv-filters__group">
              <legend className="sv-filters__legend t-overline">Price ({site.currency})</legend>
              <div className="sv-filters__price">
                <TextField
                  label="Min"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={minPrice}
                  onChange={(e) => onMinPriceChange(e.target.value)}
                />
                <TextField
                  label="Max"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => onMaxPriceChange(e.target.value)}
                />
              </div>
            </fieldset>
          )}
        </div>

        <div className="sv-filters__foot">
          <Button block onClick={onClose}>
            Show {resultCount} {resultCount === 1 ? 'piece' : 'pieces'}
          </Button>
          <Button variant="ghost" size="sm" block onClick={onClear}>
            Clear filters
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
