import { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import { shippingFields, validateShipping } from '../utils/shipping';
export default function ShippingForm({
  initialValues,
  errors,
  onNext,
  onBack,
}) {
  const [values, setValues] = useState(initialValues);
  function submit(event) {
    event.preventDefault();
    onNext(values);
    const firstError = Object.keys(validateShipping(values))[0];
    if (firstError) document.getElementById(`shipping-${firstError}`)?.focus();
  }
  return (
    <form noValidate onSubmit={submit} className="checkout-panel">
      <h2>Where should it go?</h2>
      <p className="demo-note">Use fictional contact details for this demo.</p>
      <div className="shipping-grid">
        {shippingFields.map(([name, label, type, autoComplete]) => (
          <div key={name}>
            <Input
              id={`shipping-${name}`}
              label={label}
              type={type}
              autoComplete={autoComplete}
              required
              maxLength={name === 'address' ? 250 : 100}
              value={values[name] || ''}
              onChange={(event) =>
                setValues({ ...values, [name]: event.target.value })
              }
              aria-invalid={!!errors[name]}
              aria-describedby={errors[name] ? `error-${name}` : undefined}
            />
            {errors[name] && (
              <p id={`error-${name}`} className="field-error">
                {errors[name]}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="form-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onBack(values)}
        >
          Back to bag review
        </Button>
        <Button type="submit">Continue to payment</Button>
      </div>
    </form>
  );
}
