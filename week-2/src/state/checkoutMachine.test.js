import { it, expect } from 'vitest';
import { createActor, fromPromise, waitFor } from 'xstate';
import { checkoutMachine } from './checkoutMachine';
import { validateShipping } from '../utils/shipping';
const shipping = {
  name: 'Demo Person',
  email: 'demo@example.com',
  phone: '+92 300 1234567',
  address: '123 Demo Road',
  city: 'Karachi',
  postalCode: '75500',
  country: 'Pakistan',
};
const items = [{ id: 11, quantity: 1 }];
it('guards empty bags, skipped steps and invalid shipping; supports back', () => {
  const actor = createActor(checkoutMachine).start();
  actor.send({ type: 'SUBMIT', scenario: 'success' });
  expect(actor.getSnapshot().value).toBe('cart');
  actor.send({ type: 'NEXT', items: [] });
  expect(actor.getSnapshot().value).toBe('cart');
  actor.send({ type: 'NEXT', items });
  actor.send({ type: 'NEXT', shipping: {} });
  expect(actor.getSnapshot().value).toBe('shipping');
  expect(Object.keys(actor.getSnapshot().context.errors)).toHaveLength(7);
  actor.send({ type: 'NEXT', shipping });
  expect(actor.getSnapshot().value).toBe('payment');
  actor.send({ type: 'BACK' });
  expect(actor.getSnapshot().value).toBe('shipping');
  expect(actor.getSnapshot().context.shipping).toEqual(shipping);
  actor.stop();
});
it('handles failure, retry and success without duplicate submissions', async () => {
  let attempts = 0;
  const machine = checkoutMachine.provide({
    actors: {
      submitOrder: fromPromise(async () => {
        attempts++;
        if (attempts === 1) throw new Error('Declined');
        return { id: 'ORDER-1' };
      }),
    },
  });
  const actor = createActor(machine).start();
  actor.send({ type: 'NEXT', items });
  actor.send({ type: 'NEXT', shipping });
  actor.send({ type: 'SUBMIT', scenario: 'failure' });
  actor.send({ type: 'SUBMIT', scenario: 'failure' });
  actor.send({ type: 'BACK' });
  await waitFor(actor, (s) => s.matches('payment') && !!s.context.error);
  expect(attempts).toBe(1);
  expect(actor.getSnapshot().context.items).toEqual(items);
  expect(actor.getSnapshot().context.shipping).toEqual(shipping);
  actor.send({ type: 'SUBMIT', scenario: 'success' });
  actor.send({ type: 'SUBMIT', scenario: 'success' });
  await waitFor(actor, (s) => s.matches('confirmation'));
  expect(attempts).toBe(2);
  expect(actor.getSnapshot().context.order.id).toBe('ORDER-1');
  actor.stop();
});
it('validates email, phone and whitespace required fields', () => {
  expect(validateShipping(shipping)).toEqual({});
  expect(
    validateShipping({ ...shipping, email: 'broken', phone: '123', city: ' ' }),
  ).toEqual({
    city: 'City is required.',
    email: 'Enter a valid email address.',
    phone: 'Enter a phone number with 7–15 digits.',
  });
});
