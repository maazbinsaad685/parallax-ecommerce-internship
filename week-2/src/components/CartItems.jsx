import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/catalog';
import { productQuantity } from '../utils/cart';
import QuantitySelector from './QuantitySelector';
import Button from './ui/Button';
export default function CartItems({ items, onUpdate, onRemove }) {
  return (
    <ul className="cart-items">
      {items.map((item) => (
        <li className="cart-item" key={item.key}>
          <Link to={`/products/${item.id}`}>
            <img src={item.image} alt={item.title} width="112" height="112" />
          </Link>
          <div>
            <h2>
              <Link to={`/products/${item.id}`}>{item.title}</Link>
            </h2>
            <p>
              {Object.entries(item.variants)
                .map(([name, value]) => `${name}: ${value}`)
                .join(' · ')}
            </p>
            <p>{formatPrice(item.price)} each</p>
            {onUpdate ? (
              <QuantitySelector
                value={item.quantity}
                max={
                  item.stock - productQuantity(items, item.id) + item.quantity
                }
                onChange={(quantity) => onUpdate(item.key, quantity)}
                label={`quantity for ${item.title}`}
              />
            ) : (
              <p>Quantity: {item.quantity}</p>
            )}
            {onRemove && (
              <Button
                variant="secondary"
                className="remove-button"
                aria-label={`Remove ${item.title}`}
                onClick={() => onRemove(item.key)}
              >
                Remove
              </Button>
            )}
          </div>
          <strong>
            {formatPrice((Math.round(item.price * 100) * item.quantity) / 100)}
          </strong>
        </li>
      ))}
    </ul>
  );
}
