export const shippingFields = [
  ['name', 'Full name', 'text', 'name'],
  ['email', 'Email', 'email', 'email'],
  ['phone', 'Phone number', 'tel', 'tel'],
  ['address', 'Address', 'text', 'street-address'],
  ['city', 'City', 'text', 'address-level2'],
  ['postalCode', 'Postal code', 'text', 'postal-code'],
  ['country', 'Country', 'text', 'country-name'],
];
export function validateShipping(values = {}) {
  values = values && typeof values === 'object' ? values : {};
  const errors = {};
  for (const [key, label] of shippingFields)
    if (typeof values[key] !== 'string' || !values[key].trim())
      errors[key] = `${label} is required.`;
  if (!errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = 'Enter a valid email address.';
  if (
    !errors.phone &&
    (!/^[+\d\s().-]+$/.test(values.phone) ||
      values.phone.replace(/\D/g, '').length < 7 ||
      values.phone.replace(/\D/g, '').length > 15)
  )
    errors.phone = 'Enter a phone number with 7–15 digits.';
  return errors;
}
