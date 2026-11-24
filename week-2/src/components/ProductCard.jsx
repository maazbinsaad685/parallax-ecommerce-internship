import { ArrowUpRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/catalog';

export default function ProductCard({ product, view = 'grid' }) {
  const stockLabel =
    product.stock === 0
      ? 'Out of stock'
      : product.stock < 6
        ? 'Only a few left'
        : '';
  return (
    <article className={`product-card ${view === 'list' ? 'list-card' : ''}`}>
      <Link
        className="product-image"
        to={`/products/${product.id}`}
        tabIndex={-1}
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          width="400"
          height="400"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = '/product-fallback.svg';
          }}
        />
        {stockLabel && <span className="stock-tag">{stockLabel}</span>}
        <span className="product-arrow">
          <ArrowUpRight size={18} />
        </span>
      </Link>
      <div className="product-info">
        <div className="product-meta">
          <span>{product.category}</span>
          <span
            className="rating"
            aria-label={`${product.rating} out of 5 stars`}
          >
            <Star size={12} fill="currentColor" />
            {product.rating.toFixed(1)}
          </span>
        </div>
        <h3>
          <Link to={`/products/${product.id}`}>{product.title}</Link>
        </h3>
        {view === 'list' && (
          <p className="product-description">{product.description}</p>
        )}
        <div className="product-bottom">
          <strong>{formatPrice(product.price)}</strong>
          <span>{product.brand}</span>
        </div>
      </div>
    </article>
  );
}
