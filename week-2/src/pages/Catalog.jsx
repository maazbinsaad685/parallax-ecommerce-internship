import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowDown, Leaf, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { filterProducts } from '../utils/catalog';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ViewToggle from '../components/ViewToggle';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/EmptyState';

export default function Catalog() {
  const { data: products, loading, error, retry } = useProducts();
  const [params, setParams] = useSearchParams();
  const search = params.get('q') || '';
  const category = params.get('category') || 'All';
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('featured');
  const updateFilter = (key, value) =>
    setParams(
      (current) => {
        if (!value || value === 'All') current.delete(key);
        else current.set(key, value);
        return current;
      },
      { replace: true },
    );
  const categories = [
    ...new Set((products || []).map((item) => item.category)),
  ];
  const visibleProducts = filterProducts(
    products || [],
    search,
    category,
    sort,
  );
  const clearFilters = () => setParams({});
  return (
    <div className="container">
      <section className="hero" aria-labelledby="collection-title">
        <div className="hero-copy">
          <div className="eyebrow">
            <span />
            THE EVERYDAY COLLECTION
          </div>
          <h1 id="collection-title">
            Good things.
            <br />
            <em>For everyday living.</em>
          </h1>
          <p>
            Considered essentials for your space, your style,
            <br className="desktop-break" /> and everything in between.
          </p>
          <a href="#collection" className="hero-link">
            Explore the collection <ArrowDown size={16} />
          </a>
        </div>
        <div className="hero-visual">
          <img
            src="/images/hero.webp"
            alt="A modern lounge chair for a thoughtfully furnished home"
            width="480"
            height="480"
          />
          <div className="hero-caption">
            <Leaf size={17} />
            <span>
              Thoughtfully chosen.
              <br />
              <strong>Made for the everyday.</strong>
            </span>
          </div>
          <span className="hero-number">01 / THE HOME EDIT</span>
        </div>
      </section>
      <section
        id="collection"
        className="collection"
        aria-labelledby="products-heading"
      >
        <div className="collection-heading">
          <div>
            <span className="eyebrow">FIND YOUR NEXT FAVORITE</span>
            <h2 id="products-heading">
              Shop the collection<span>{products?.length ?? '—'}</span>
            </h2>
          </div>
          <SearchBar
            value={search}
            onChange={(value) => updateFilter('q', value)}
          />
        </div>
        <div className="catalog-layout">
          <CategoryFilter
            categories={categories}
            selected={category}
            onChange={(value) => updateFilter('category', value)}
            products={products || []}
          />
          <div className="catalog-results">
            <div className="results-toolbar">
              <p role="status" aria-live="polite">
                {loading
                  ? 'Finding your favorites…'
                  : `${visibleProducts.length} products`}
                {category !== 'All' && <span> in {category}</span>}
              </p>
              <div className="toolbar-actions">
                <div className="sort-control">
                  <SlidersHorizontal size={15} aria-hidden="true" />
                  <label className="sr-only" htmlFor="sort">
                    Sort products
                  </label>
                  <select
                    id="sort"
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                    <option value="rating">Top rated</option>
                  </select>
                </div>
                <ViewToggle value={view} onChange={setView} />
              </div>
            </div>
            {loading ? (
              <Skeleton />
            ) : error ? (
              <div role="alert">
                <EmptyState
                  title="Something went wrong"
                  message={error}
                  action="Try again"
                  onAction={retry}
                />
              </div>
            ) : visibleProducts.length === 0 ? (
              <EmptyState
                title="No matches just yet"
                message="Try a different search or explore all categories."
                action="Clear filters"
                onAction={clearFilters}
              />
            ) : (
              <div
                className={view === 'grid' ? 'product-grid' : 'product-list'}
              >
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} view={view} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <div className="closing-note">
        <Leaf size={23} />
        <p>A good everyday starts with the little things.</p>
        <span>Explore. Discover. Make it yours.</span>
      </div>
    </div>
  );
}
