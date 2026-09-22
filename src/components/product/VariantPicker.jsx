import { cn } from '@/utils/cn';
import './product.css';

/** Pill selector for strap/colour variants — only rendered when `variants` are real (see Product typedef). */
export function VariantPicker({ variants, value, onChange, label = 'Variant', className }) {
  if (!variants?.length) return null;
  return (
    <div className={cn('sv-variants', className)} role="group" aria-label={label}>
      {variants.map((v) => (
        <button
          key={v}
          type="button"
          className="sv-variants__pill"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
