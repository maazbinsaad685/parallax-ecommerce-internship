import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from '../mocks/handlers';
import products from '../data/products.json';
import { filterProducts } from './catalog';

const server = setupServer(...handlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('catalog data and filtering', () => {
  it('contains 60 unique, complete products', () => {
    expect(products).toHaveLength(60);
    expect(new Set(products.map((item) => item.id)).size).toBe(60);
    products.forEach((item) => {
      [
        'id',
        'title',
        'description',
        'price',
        'category',
        'brand',
        'image',
        'rating',
        'stock',
        'variants',
      ].forEach((field) => expect(item).toHaveProperty(field));
      expect(item.price).toBeGreaterThan(0);
      expect(item.stock).toBeGreaterThanOrEqual(0);
    });
  });
  it('matches title case insensitively and trims whitespace', () => {
    const item = products[0];
    expect(
      filterProducts(products, `  ${item.title.toUpperCase()}  `, 'All'),
    ).toContain(item);
  });
  it('combines search and category without changing the source array', () => {
    const snapshot = products.map((item) => item.id);
    const item = products[0];
    expect(filterProducts(products, item.title, item.category)).toContain(item);
    expect(filterProducts(products, item.title, 'Electronics')).toHaveLength(0);
    filterProducts(products, '', 'All', 'price-low');
    expect(products.map((item) => item.id)).toEqual(snapshot);
  });
  it('returns an empty result for no match', () => {
    expect(filterProducts(products, 'no-such-product-xyz', 'All')).toEqual([]);
  });
  it('sorts prices ascending and descending', () => {
    const ascending = filterProducts(products, '', 'All', 'price-low');
    const descending = filterProducts(products, '', 'All', 'price-high');
    expect(ascending.map((item) => item.price)).toEqual(
      descending.map((item) => item.price).reverse(),
    );
  });
});

describe('mock API', () => {
  it('returns the catalog through HTTP', async () => {
    const response = await fetch('http://localhost/api/products');
    expect(response.status).toBe(200);
    expect(await response.json()).toHaveLength(60);
  });
  it('returns a product and a 404 for an unknown ID', async () => {
    const response = await fetch(
      `http://localhost/api/products/${products[0].id}`,
    );
    expect(await response.json()).toEqual(products[0]);
    expect((await fetch('http://localhost/api/products/99999')).status).toBe(
      404,
    );
  });
  it('supports a deliberate failure for the error UI', async () => {
    expect((await fetch('http://localhost/api/products?error=1')).status).toBe(
      503,
    );
  });
});
