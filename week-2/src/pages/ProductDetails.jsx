import ProductGallery from '../components/ProductGallery';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { formatPrice } from '../utils/catalog';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/EmptyState';
import ProductPurchase from '../components/ProductPurchase';

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
          <ProductGallery key={product.id} product={product} />
          <div className="detail-copy">
            <span className="eyebrow">
              {product.category} / {product.brand}
            </span>
            <h1>{product.title}</h1>
            <p className="rating">
              <Star size={16} fill="currentColor" />
              {product.rating.toFixed(1)} / 5
            </p>
            <strong className="detail-price">{formatPrice(product.price)}</strong>
            <p>{product.description}</p>
            <ProductPurchase key={product.id} product={product} />
          </div>
        </div>
      )}
    </div>
  );
}
