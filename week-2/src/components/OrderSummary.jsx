import { totalCents } from '../utils/cart';
import { formatPrice } from '../utils/catalog';
export default function OrderSummary({ items, children }) {
  const total = totalCents(items) / 100;
  return (
    <aside className="summary-panel">
      <h2>Order summary</h2>
      <div>
        <span>Subtotal</span>
        <strong>{formatPrice(total)}</strong>
      </div>
      <div>
        <span>Demo shipping</span>
        <span>Free</span>
      </div>
      <div className="summary-total">
        <span>Total</span>
        <strong>{formatPrice(total)}</strong>
      </div>
      {children}
      <p className="demo-note">Demo store · USD prices · No real charges.</p>
    </aside>
  );
}
