import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
export default function Cart() {
  return (
    <div className="container page-section">
      <span className="eyebrow">YOUR EVERYDAY FINDS</span>
      <h1>Your shopping bag</h1>
      <div className="cart-layout">
        <section className="placeholder-panel">
          <ShoppingBag size={38} strokeWidth={1.2} />
          <h2>A little space for good things.</h2>
          <p>
            Your bag is empty. Discover something you’ll love in our collection.
          </p>
          <Link className="button button-primary" to="/">
            Explore products <ArrowRight size={17} />
          </Link>
        </section>
        <aside className="summary-panel">
          <h2>Order summary</h2>
          <div>
            <span>Subtotal</span>
            <strong>$0.00</strong>
          </div>
          <div>
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>$0.00</strong>
          </div>
          <Link className="button button-secondary" to="/checkout">
            Preview checkout
          </Link>
          <p className="demo-note">
            Cart interactions will arrive in a future update.
          </p>
        </aside>
      </div>
    </div>
  );
}
