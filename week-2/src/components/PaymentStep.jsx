import { useState } from 'react';
import Button from './ui/Button';
export default function PaymentStep({
  shipping,
  error,
  submitting,
  onBack,
  onSubmit,
}) {
  const [scenario, setScenario] = useState('success');
  return (
    <section className="checkout-panel" aria-busy={submitting}>
      <span className="eyebrow">DEMO PAYMENT ONLY</span>
      <h2>Try the checkout experience.</h2>
      <p>No card details are collected. No money will be charged.</p>
      <p className="shipping-preview">
        Deliver to {shipping.name}
        <br />
        {shipping.address}, {shipping.city}, {shipping.postalCode},{' '}
        {shipping.country}
      </p>
      <fieldset disabled={submitting}>
        <legend>Choose a demo outcome</legend>
        <label className="payment-option">
          <input
            type="radio"
            name="scenario"
            value="success"
            checked={scenario === 'success'}
            onChange={() => setScenario('success')}
          />{' '}
          Successful payment
        </label>
        <label className="payment-option">
          <input
            type="radio"
            name="scenario"
            value="failure"
            checked={scenario === 'failure'}
            onChange={() => setScenario('failure')}
          />{' '}
          Failed payment (test retry)
        </label>
      </fieldset>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      <div className="form-actions">
        <Button variant="secondary" disabled={submitting} onClick={onBack}>
          Back to shipping
        </Button>
        <Button disabled={submitting} onClick={() => onSubmit(scenario)}>
          {submitting
            ? 'Placing demo order…'
            : error
              ? 'Retry demo payment'
              : 'Place demo order'}
        </Button>
      </div>
      <p role="status">
        {submitting ? 'Please wait while we create your order.' : ''}
      </p>
    </section>
  );
}
