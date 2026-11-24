export default function Skeleton({ count = 8 }) {
  return (
    <div className="product-grid" role="status" aria-label="Loading products">
      <span className="sr-only">Loading products…</span>
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton-card" key={index} aria-hidden="true">
          <div className="skeleton skeleton-image" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line short" />
        </div>
      ))}
    </div>
  );
}
