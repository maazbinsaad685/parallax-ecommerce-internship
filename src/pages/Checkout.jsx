import { Link } from 'react-router-dom';
import { LockKeyhole, ArrowLeft } from 'lucide-react';
export default function Checkout() {
  return (
    <div className="container page-section">
      <Link to="/cart" className="back-link">
        <ArrowLeft size={16} />
        Back to bag
      </Link>
      <h1>A thoughtful checkout.</h1>
      <ol className="checkout-steps" aria-label="Checkout preview steps">
        <li>01 · Bag</li>
        <li>02 · Shipping</li>
        <li>03 · Payment</li>
        <li>04 · Confirmation</li>
      </ol>
      <section className="placeholder-panel">
        <LockKeyhole size={38} strokeWidth={1.2} />
        <span className="eyebrow">COMING SOON</span>
        <h2>The next part of the journey.</h2>
        <p>
          This is a preview of our checkout. Ordering and payment are not
          available yet.
        </p>
        <Link className="button button-primary" to="/">
          Continue exploring
        </Link>
      </section>
    </div>
  );
}
