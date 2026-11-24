import { beforeAll, afterAll, beforeEach, it, expect } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers, resetMockStore } from './handlers';
import products from '../data/products.json';
const server = setupServer(...handlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
beforeEach(resetMockStore);
const product = products[0];
const item = {
  id: product.id,
  quantity: 1,
  price: 0.01,
  variants: Object.fromEntries(
    Object.entries(product.variants).map(([key, values]) => [key, values[0]]),
  ),
};
const shipping = {
  name: 'Demo',
  email: 'demo@example.com',
  phone: '03001234567',
  address: 'Demo street',
  city: 'Karachi',
  postalCode: '75500',
  country: 'Pakistan',
};
const submit = (body) =>
  fetch('http://localhost/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [item],
      shipping,
      requestId: 'test-order',
      scenario: 'success',
      ...body,
    }),
  });
it('preserves inventory on failure, uses server prices, deduplicates successful orders', async () => {
  expect((await submit({ scenario: 'failure' })).status).toBe(402);
  const response = await submit({});
  expect(response.status).toBe(201);
  const order = await response.json();
  expect(order.total).toBe(product.price);
  expect((await (await submit({})).json()).id).toBe(order.id);
  expect(
    (await (await fetch(`http://localhost/api/products/${product.id}`)).json())
      .stock,
  ).toBe(product.stock - 1);
});
it('rejects overstock, zero quantities, invalid variants and invalid shipping', async () => {
  expect(
    (await submit({ items: [{ ...item, quantity: product.stock + 1 }] }))
      .status,
  ).toBe(409);
  expect((await submit({ items: [{ ...item, quantity: 0 }] })).status).toBe(
    400,
  );
  expect((await submit({ items: [{ ...item, variants: {} }] })).status).toBe(
    400,
  );
  expect((await submit({ shipping: {} })).status).toBe(400);
});
