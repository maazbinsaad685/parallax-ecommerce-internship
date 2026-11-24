import { useRef, useState } from 'react';

export default function ProductGallery({ product }) {
  const images = [...new Set([product.image, ...(product.images || [])])];
  const [selected, setSelected] = useState(0);
  const buttons = useRef([]);
  const fallback = (event) => {
    if (!event.currentTarget.src.endsWith('/product-fallback.svg'))
      event.currentTarget.src = '/product-fallback.svg';
  };
  return (
    <section aria-label="Product images">
      <div className="detail-image">
        <img
          src={images[selected]}
          alt={`${product.title}, view ${selected + 1}`}
          width="600"
          height="600"
          onError={fallback}
        />
      </div>
      <div className="gallery-thumbnails" aria-label="Choose product image">
        {images.map((src, index) => (
          <button
            key={src}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            aria-label={`Show ${product.title}, view ${index + 1}`}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              let next;
              if (event.key === 'ArrowRight') next = (index + 1) % images.length;
              if (event.key === 'ArrowLeft')
                next = (index - 1 + images.length) % images.length;
              if (event.key === 'Home') next = 0;
              if (event.key === 'End') next = images.length - 1;
              if (next === undefined) return;
              event.preventDefault();
              setSelected(next);
              buttons.current[next]?.focus();
            }}
          >
            <img src={src} alt="" width="70" height="70" onError={fallback} />
          </button>
        ))}
      </div>
      {images.length === 1 && <p>One product image available.</p>}
    </section>
  );
}
