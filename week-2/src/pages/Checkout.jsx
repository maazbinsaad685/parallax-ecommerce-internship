import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useMachine } from '@xstate/react';
import { useQueryClient } from '@tanstack/react-query';
import { checkoutMachine } from '../state/checkoutMachine';
import { useCart } from '../state/CartContext';
import CartItems from '../components/CartItems';
import OrderSummary from '../components/OrderSummary';
import ShippingForm from '../components/ShippingForm';
import PaymentStep from '../components/PaymentStep';
import Button from '../components/ui/Button';
export default function Checkout() {
  const cart = useCart();
  const client = useQueryClient();
  const [state, send] = useMachine(checkoutMachine);
  const completed = useRef(false);
  const heading = useRef(null);
  const { items, shipping, errors, order, error } = state.context;
  useEffect(() => {
    heading.current?.focus();
  }, [state.value]);
  useEffect(() => {
    if (state.matches('confirmation') && !completed.current) {
      completed.current = true;
      cart.clear();
      client.setQueryData(['orders', order.id], order);
      client.invalidateQueries({ queryKey: ['products'] });
    }
  }, [state, order, cart, client]);
  const step = state.matches('submitting') ? 'payment' : state.value;
  return (
    <div className="container page-section">
      <h1 ref={heading} tabIndex={-1}>
        {state.matches('confirmation')
          ? 'Thank you. It’s on its way.'
          : 'A thoughtful checkout.'}
      </h1>
      <ol className="checkout-steps" aria-label="Checkout progress">
        {['cart', 'shipping', 'payment', 'confirmation'].map((name, index) => (
          <li key={name} aria-current={step === name ? 'step' : undefined}>
            {String(index + 1).padStart(2, '0')} · {name}
          </li>
        ))}
      </ol>
      {state.matches('confirmation') ? (
        <>
          <section className="checkout-panel">
            <span className="eyebrow">DEMO ORDER CONFIRMED</span>
            <h2>Order {order.id}</h2>
            <p role="status">
              Your mock payment was successful. No money was charged.
            </p>
            <p>
              Delivery to {order.shipping.name} · {order.shipping.address},{' '}
              {order.shipping.city}, {order.shipping.postalCode},{' '}
              {order.shipping.country}
            </p>
          </section>
          <div className="cart-layout">
            <CartItems items={order.items} />
            <OrderSummary items={order.items}>
              <Link className="button button-primary" to="/">
                Continue shopping
              </Link>
            </OrderSummary>
          </div>
        </>
      ) : state.matches('cart') ? (
        cart.items.length ? (
          <div className="cart-layout">
            <section className="checkout-panel">
              <h2>Review your bag</h2>
              <CartItems items={cart.items} />
              <Link className="back-link" to="/cart">
                Edit your bag
              </Link>
            </section>
            <OrderSummary items={cart.items}>
              <Button onClick={() => send({ type: 'NEXT', items: cart.items })}>
                Continue to shipping
              </Button>
            </OrderSummary>
          </div>
        ) : (
          <section className="placeholder-panel">
            <h2>Your bag is empty.</h2>
            <p>Add something to your bag to start checkout.</p>
            <Link className="button button-primary" to="/">
              Explore products
            </Link>
          </section>
        )
      ) : (
        <div className="cart-layout">
          {state.matches('shipping') ? (
            <ShippingForm
              initialValues={shipping}
              errors={errors}
              onNext={(values) => send({ type: 'NEXT', shipping: values })}
              onBack={(values) => send({ type: 'BACK', shipping: values })}
            />
          ) : (
            <PaymentStep
              shipping={shipping}
              error={error}
              submitting={state.matches('submitting')}
              onBack={() => send({ type: 'BACK' })}
              onSubmit={(scenario) => send({ type: 'SUBMIT', scenario })}
            />
          )}
          <OrderSummary items={items} />
        </div>
      )}
    </div>
  );
}
