import { Minus, Plus } from '@/components/icons';
import { cn } from '@/utils/cn';
import './product.css';

/** Shared qty control — the cart drawer's inline version, and the PDP's larger one. */
export function QuantityStepper({ value, onChange, min = 1, max = 9, label = 'Quantity', size = 'md', className }) {
  return (
    <div className={cn('sv-qty', className)} data-size={size} role="group" aria-label={label}>
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus size={16} />
      </button>
      <output aria-live="polite">{value}</output>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
