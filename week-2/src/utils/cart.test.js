import { describe, it, expect } from 'vitest';
import {
  addItem,
  cartKey,
  changeQuantity,
  restoreCart,
  totalCents,
} from './cart';
const product = {
  id: 1,
  title: 'Shirt',
  image: '/shirt.webp',
  price: 19.99,
  stock: 3,
  variants: { size: ['S', 'M'], color: ['Blue'] },
};
const small = { size: 'S', color: 'Blue' };
const medium = { size: 'M', color: 'Blue' };
describe('cart rules', () => {
  it('merges identical variants regardless of property order', () => {
    const items = addItem(
      addItem([], product, small, 1),
      product,
      { color: 'Blue', size: 'S' },
      1,
    );
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });
  it('separates variants and enforces shared product stock', () => {
    const items = addItem(addItem([], product, small, 2), product, medium, 1);
    expect(items).toHaveLength(2);
    expect(addItem(items, product, medium, 1)).toBe(items);
    expect(changeQuantity(items, items[1].key, 2)).toBe(items);
  });
  it('rejects invalid quantities, variants and out-of-stock items', () => {
    for (const quantity of [0, -1, 1.5, NaN, 4])
      expect(addItem([], product, small, quantity)).toEqual([]);
    expect(addItem([], product, { size: 'XL', color: 'Blue' }, 1)).toEqual([]);
    expect(addItem([], { ...product, stock: 0 }, small, 1)).toEqual([]);
  });
  it('updates quantities, rejects zero and calculates money in cents', () => {
    const items = addItem([], product, small, 1);
    expect(changeQuantity(items, cartKey(1, small), 3)[0].quantity).toBe(3);
    expect(changeQuantity(items, items[0].key, 0)).toBe(items);
    expect(totalCents(changeQuantity(items, items[0].key, 3))).toBe(5997);
  });
  it('round-trips persisted data and discards corrupt entries', () => {
    const items = addItem([], product, small, 2);
    expect(restoreCart(JSON.stringify(items))).toEqual(items);
    expect(restoreCart('bad json')).toEqual([]);
    expect(restoreCart('{}')).toEqual([]);
    expect(restoreCart('[null,{"quantity":-2}]')).toEqual([]);
  });
});
