import { createActor } from 'xstate';
import { describe, expect, it } from 'vitest';
import { cartMachine } from './cartMachine';
import { totalCents } from '../utils/cart';

const product = {
  id: 1,
  title: 'Shirt',
  image: '/shirt.webp',
  price: 10,
  stock: 3,
  variants: { size: ['S', 'M'] },
};
const add = (quantity = 1, size = 'S') => ({
  type: 'ADD_ITEM',
  product,
  variants: { size },
  quantity,
});
const start = () => createActor(cartMachine).start();
const items = (actor) => actor.getSnapshot().context.items;

describe('cart machine events', () => {
  it('adds an item and merges repeated additions', () => {
    const actor = start();
    actor.send(add());
    expect(items(actor)).toHaveLength(1);
    actor.send(add());
    expect(items(actor)[0].quantity).toBe(2);
    expect(totalCents(items(actor))).toBe(2000);
  });
  it('separates variants and respects shared stock', () => {
    const actor = start();
    actor.send(add(2));
    actor.send(add(1, 'M'));
    expect(items(actor)).toHaveLength(2);
    actor.send(add());
    expect(totalCents(items(actor))).toBe(3000);
  });
  it('increases, decreases and sets quantities', () => {
    const actor = start();
    actor.send(add());
    const key = items(actor)[0].key;
    actor.send({ type: 'INCREASE_QUANTITY', key });
    expect(items(actor)[0].quantity).toBe(2);
    actor.send({ type: 'DECREASE_QUANTITY', key });
    expect(items(actor)[0].quantity).toBe(1);
    actor.send({ type: 'SET_QUANTITY', key, quantity: 3 });
    expect(items(actor)[0].quantity).toBe(3);
  });
  it('removes and clears items', () => {
    const actor = start();
    actor.send(add());
    actor.send({ type: 'REMOVE_ITEM', key: items(actor)[0].key });
    expect(items(actor)).toEqual([]);
    actor.send(add());
    actor.send({ type: 'CLEAR_CART' });
    expect(items(actor)).toEqual([]);
  });
  it.each([0, -1, 1.5, NaN, 4])('rejects quantity %s', (quantity) => {
    const actor = start();
    actor.send(add(quantity));
    expect(items(actor)).toEqual([]);
    actor.send(add());
    actor.send({ type: 'SET_QUANTITY', key: items(actor)[0].key, quantity });
    expect(items(actor)[0].quantity).toBe(1);
  });
  it('rejects unavailable products', () => {
    const actor = start();
    actor.send({ ...add(), product: { ...product, stock: 0 } });
    expect(items(actor)).toEqual([]);
  });
  it('restores persisted items through machine input', () => {
    const actor = start();
    actor.send(add(2));
    const restored = createActor(cartMachine, {
      input: { saved: JSON.stringify(items(actor)) },
    }).start();
    expect(items(restored)).toEqual(items(actor));
  });
});
