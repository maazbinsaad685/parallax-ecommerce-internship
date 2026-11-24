import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../state/CartContext';
import { productQuantity } from '../utils/cart';
import QuantitySelector from './QuantitySelector';
import Button from './ui/Button';
export default function ProductPurchase({ product }) {
  const { items, add } = useCart();
  const [variants, setVariants] = useState(() =>
    Object.fromEntries(
      Object.entries(product.variants).map(([name, values]) => [
        name,
        values[0],
      ]),
    ),
  );
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const remaining = Math.max(
    0,
    product.stock - productQuantity(items, product.id),
  );
  const selectedQuantity = Math.min(quantity, Math.max(1, remaining));
  return (
    <div>
      <div className="variant-fields">
        {Object.entries(product.variants).map(([name, values]) => (
          <div className="field" key={name}>
            <label htmlFor={`variant-${name}`}>{name}</label>
            <select
              id={`variant-${name}`}
              value={variants[name]}
              onChange={(event) => {
                setVariants({ ...variants, [name]: event.target.value });
                setMessage('');
              }}
            >
              {values.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <p className="stock-copy">
        {product.stock
          ? `${product.stock} available · ${remaining} more can be added`
          : 'Currently out of stock'}
      </p>
      <div className="purchase-actions">
        <QuantitySelector
          value={selectedQuantity}
          max={remaining}
          onChange={setQuantity}
        />
        <Button
          disabled={!remaining}
          onClick={() => {
            add(product, variants, selectedQuantity);
            setMessage('Added to your bag.');
          }}
        >
          {!product.stock
            ? 'Out of stock'
            : !remaining
              ? 'Stock limit reached'
              : 'Add to Cart'}
        </Button>
      </div>
      <p role="status" className="purchase-status">
        {message} {message && <Link to="/cart">View bag →</Link>}
      </p>
    </div>
  );
}
