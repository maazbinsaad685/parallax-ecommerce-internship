import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { formatPrice } from '../utils/catalog';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/EmptyState';
import Button from '../components/ui/Button';

export default function ProductDetails() {
  const { id } = useParams();
  const { data: product, loading, error, retry } = useProducts(id);
  return (
    <div className="container page-section">
      <Link className="back-link" to="/">
        <ArrowLeft size={16} />
        Back to collection
      </Link>
      {loading ? (
        <Skeleton count={2} />
      ) : error ? (
        <EmptyState
          title="Product unavailable"
          message={error}
          action="Try again"
          onAction={retry}
        />
      ) : (
        <div className="detail-layout">
          <div className="detail-image">
            <img
              src={product.image}
              alt={product.title}
              width="600"
              height="600"
            />
          </div>
          <div className="detail-copy">
            <span className="eyebrow">
              {product.category} / {product.brand}
            </span>
            <h1>{product.title}</h1>
            <p className="rating">
              <Star size={16} fill="currentColor" />
              {product.rating.toFixed(1)} / 5
            </p>
            <strong className="detail-price">
              {formatPrice(product.price)}
            </strong>
            <p>{product.description}</p>
            <dl className="variant-list">
              {Object.entries(product.variants).map(([name, values]) => (
                <div key={name}>
                  <dt>{name}</dt>
                  <dd>{values.join(' / ')}</dd>
                </div>
              ))}
            </dl>
            <p className="stock-copy">
              {product.stock
                ? `${product.stock} available in the demo inventory`
                : 'Currently out of stock'}
            </p>
            <Button disabled>Shopping opens soon</Button>
            <p className="demo-note">
              Explore the collection today. Cart and checkout are coming in a
              future update.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
