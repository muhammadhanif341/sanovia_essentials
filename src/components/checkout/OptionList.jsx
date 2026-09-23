import { cn } from '@/utils/cn';
import './checkout.css';

/**
 * A single-select list of labelled cards — shipping method, payment method. Native radio
 * inputs under the hood (keyboard/AT behaviour for free), styled as cards.
 *   options: [{ id, icon, label, description, right }]
 */
export function OptionList({ name, legend, options, value, onChange }) {
  return (
    <fieldset className="sv-option-list">
      <legend className="sv-sr-only">{legend}</legend>
      {options.map((opt) => (
        <label key={opt.id} className="sv-option" data-selected={value === opt.id}>
          <input
            type="radio"
            name={name}
            value={opt.id}
            checked={value === opt.id}
            onChange={() => onChange(opt.id)}
            className="sv-option__input"
          />
          {opt.icon && (
            <span className="sv-option__icon" aria-hidden="true">
              {opt.icon}
            </span>
          )}
          <span className="sv-option__body">
            <span className="sv-option__label">{opt.label}</span>
            {opt.description && <span className={cn('t-small', 't-muted')}>{opt.description}</span>}
          </span>
          {opt.right && <span className="sv-option__right">{opt.right}</span>}
        </label>
      ))}
    </fieldset>
  );
}
