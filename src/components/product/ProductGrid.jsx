import { ProductCard } from './ProductCard';
import { cn } from '@/utils/cn';
import './product.css';

/**
 * Responsive product grid — recomposed per breakpoint, not scaled:
 *   mobile 2-up compact · tablet 3-up · laptop 3-up · desktop 4-up
 * `feature`: every 7th card breaks the rhythm (full row on phones, 2 columns from tablet up)
 * with a wider crop — the editorial variety from the blueprint.
 * `label` names the list for assistive tech.
 */
export function ProductGrid({ products, label = 'Products', feature = false, className }) {
  return (
    <ul className={cn('sv-pgrid', className)} aria-label={label}>
      {products.map((product, i) => {
        const isFeature = feature && i % 7 === 0;
        return (
          <li key={product.slug} data-feature={isFeature || undefined}>
            <ProductCard product={product} index={i + 1} ratio={isFeature ? '5 / 4' : '4 / 5'} priority={i < 2} />
          </li>
        );
      })}
    </ul>
  );
}
