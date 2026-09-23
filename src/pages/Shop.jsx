import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Container, Section } from '@/components/layout/primitives';
import { PageHead } from '@/components/layout/PageHead';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Typography';
import { RollLink } from '@/components/layout/RollLink';
import { SelectField } from '@/components/ui/Field';
import { Search, Sliders } from '@/components/icons';
import { CategoryHero } from '@/components/shop/CategoryHero';
import { FilterDrawer } from '@/components/shop/FilterDrawer';
import { getProductsByCategory, SHOP_VIEWS } from '@/services/productRepository';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { usePageMotion } from '@/hooks/useSectionMotion';
import './shop.css';

const TITLES = { watches: 'Watches', jewellery: 'Jewellery' };

const VIEWS = [
  { label: 'All', to: '/shop' },
  { label: 'Watches', to: '/shop/watches' },
  { label: 'Jewellery', to: '/shop/jewellery' },
  { label: 'New Arrivals', to: '/shop/new-arrivals' },
  { label: 'Best Sellers', to: '/shop/best-sellers' },
];

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'new', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

function sortProducts(list, sort) {
  const withIndex = list.map((p, i) => ({ p, i }));
  const byPrice = (dir) =>
    withIndex
      .slice()
      .sort((a, b) => {
        if (a.p.price == null && b.p.price == null) return a.i - b.i;
        if (a.p.price == null) return 1; // unpriced pieces sort last, either direction
        if (b.p.price == null) return -1;
        return dir * (a.p.price - b.p.price);
      })
      .map((x) => x.p);
  switch (sort) {
    case 'price-asc':
      return byPrice(1);
    case 'price-desc':
      return byPrice(-1);
    case 'new':
      return withIndex
        .slice()
        .sort((a, b) => (b.p.isNew ? 1 : 0) - (a.p.isNew ? 1 : 0) || a.i - b.i)
        .map((x) => x.p);
    default:
      return list;
  }
}

/** Catalogue shell. Category pills, search, sort and an availability/price filter panel — all
 * real logic over `data/products.js`, rendering an honest empty state until it has data. */
export default function Shop() {
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  const ref = useRef(null);
  usePageMotion(ref);

  const query = params.get('q')?.trim() ?? '';
  const sort = params.get('sort') ?? 'featured';
  const hideUnavailable = params.get('avail') === '1';
  const minPrice = params.get('min') ?? '';
  const maxPrice = params.get('max') ?? '';
  const selectedTypes = useMemo(() => params.get('type')?.split(',').filter(Boolean) ?? [], [params]);

  const [queryInput, setQueryInput] = useState(query);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Light debounce so typing doesn't spam the URL/history.
  useEffect(() => {
    if (queryInput === query) return undefined;
    const t = window.setTimeout(() => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (queryInput) next.set('q', queryInput);
          else next.delete('q');
          return next;
        },
        { replace: true }
      );
    }, 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryInput]);

  const view = SHOP_VIEWS[category];
  const title = query ? `Results for “${query}”` : (view?.title ?? TITLES[category] ?? 'All pieces');

  const base = view ? view.get() : getProductsByCategory(category);

  const typeOptions = useMemo(
    () => [...new Set(base.map((p) => p.subcategory).filter(Boolean))].sort(),
    [base]
  );
  const typeLabel = category === 'jewellery' ? 'Type' : 'Collection';

  const filtered = useMemo(() => {
    let list = base;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q));
    }
    if (selectedTypes.length) {
      list = list.filter((p) => p.subcategory && selectedTypes.includes(p.subcategory));
    }
    if (hideUnavailable) {
      list = list.filter((p) => p.availability !== 'out-of-stock' && p.availability !== 'coming-soon');
    }
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;
    if (min != null || max != null) {
      list = list.filter((p) => p.price == null || ((min == null || p.price >= min) && (max == null || p.price <= max)));
    }
    return sortProducts(list, sort);
  }, [base, query, selectedTypes, hideUnavailable, minPrice, maxPrice, sort]);

  useDocumentTitle(query ? 'Search' : title, query ? undefined : `Shop ${title.toLowerCase()} at Sanovia Essentials — minimal everyday watches and jewellery.`);

  const setParam = (key, value) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }
    );

  const toggleType = (value) => {
    const next = selectedTypes.includes(value) ? selectedTypes.filter((v) => v !== value) : [...selectedTypes, value];
    setParam('type', next.join(','));
  };

  const clearFilters = () =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        ['type', 'avail', 'min', 'max'].forEach((k) => next.delete(k));
        return next;
      },
      { replace: true }
    );

  const activeFilterCount = selectedTypes.length + (hideUnavailable ? 1 : 0) + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);
  const showCategoryHero = (category === 'watches' || category === 'jewellery') && !query;

  return (
    <div ref={ref}>
      {showCategoryHero ? <CategoryHero category={category} count={base.length} /> : <PageHead overline="Shop" title={title} />}
      <Section surface="dark" pad="tight">
        <Container>
          <div className="sv-shop-toolbar">
            <nav className="sv-shop-views" aria-label="Shop categories">
              {VIEWS.map((v) => (
                <RollLink key={v.to} to={v.to} exact>
                  {v.label}
                </RollLink>
              ))}
            </nav>

            <div className="sv-shop-controls">
              <div className="sv-shop-search">
                <Search size={18} />
                <input
                  type="search"
                  inputMode="search"
                  aria-label="Search this catalogue"
                  placeholder="Search…"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                />
              </div>
              <SelectField
                label="Sort"
                className="sv-shop-sort"
                hideLabel
                options={SORTS}
                value={sort}
                onChange={(e) => setParam('sort', e.target.value === 'featured' ? '' : e.target.value)}
              />
              <Button
                variant="ghost"
                size="sm"
                iconBefore={<Sliders size={16} />}
                aria-haspopup="dialog"
                onClick={() => setFiltersOpen(true)}
              >
                Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </Button>
            </div>
          </div>

          <FilterDrawer
            open={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            typeLabel={typeLabel}
            typeOptions={typeOptions}
            selectedTypes={selectedTypes}
            onToggleType={toggleType}
            hideUnavailable={hideUnavailable}
            onToggleAvailability={(checked) => setParam('avail', checked ? '1' : '')}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={(v) => setParam('min', v)}
            onMaxPriceChange={(v) => setParam('max', v)}
            onClear={clearFilters}
            resultCount={filtered.length}
          />

          <p className="sv-shop-count t-small t-muted" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
          </p>

          {filtered.length ? (
            <div id="sv-shop-grid">
              <ProductGrid products={filtered} label={title} />
            </div>
          ) : (
            <div className="sv-empty">
              <Text size="body-l">
                {base.length === 0 ? 'The catalogue arrives with product data.' : 'Nothing matches these filters.'}
              </Text>
              <Text className="t-small" muted>
                {base.length === 0
                  ? 'Pieces will appear here as soon as photography and details are supplied.'
                  : 'Try clearing a filter or searching a different word.'}
              </Text>
              {import.meta.env.DEV && base.length === 0 && (
                <p style={{ marginTop: 'var(--space-5)' }}>
                  <Button to="/design-system" variant="ghost" size="sm">
                    See product UI with placeholders
                  </Button>
                </p>
              )}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
