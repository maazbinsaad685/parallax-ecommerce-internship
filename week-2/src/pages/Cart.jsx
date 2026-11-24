import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../state/CartContext';
import CartItems from '../components/CartItems';
import OrderSummary from '../components/OrderSummary';
export default function Cart() {
  const { items, update, remove, storageError } = useCart();
  return (
    <div className="container page-section">
      <span className="eyebrow">YOUR EVERYDAY FINDS</span>
      <h1>Your shopping bag</h1>
      {storageError && <p role="alert">{storageError}</p>}
      {items.length ? (
        <div className="cart-layout">
          <section>
            <CartItems items={items} onUpdate={update} onRemove={remove} />
            <Link className="back-link" to="/">
              Continue shopping
            </Link>
          </section>
          <OrderSummary items={items}>
            <Link className="button button-primary" to="/checkout">
              Proceed to checkout
            </Link>
          </OrderSummary>
        </div>
      ) : (
        <section className="placeholder-panel">
          <ShoppingBag size={38} />
          <h2>A little space for good things.</h2>
          <p>
            Your bag is empty. Discover something you’ll love in our collection.
          </p>
          <Link className="button button-primary" to="/">
            Explore products
          </Link>
        </section>
      )}
    </div>
  );
}
