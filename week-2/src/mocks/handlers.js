import { http, HttpResponse, delay } from 'msw';
import products from '../data/products.json';
import { validVariants, cartKey, totalCents } from '../utils/cart';
import { validateShipping } from '../utils/shipping';
let inventory = structuredClone(products);
const orders = new Map();
export function resetMockStore() {
  inventory = structuredClone(products);
  orders.clear();
}
const failure = (message, status = 400) =>
  HttpResponse.json({ message }, { status });
export const handlers = [
  http.get('*/api/products', async ({ request }) => {
    await delay(650);
    if (new URL(request.url).searchParams.get('error') === '1')
      return failure('Unable to load products. Please try again.', 503);
    return HttpResponse.json(inventory);
  }),
  http.get('*/api/products/:id', async ({ params, request }) => {
    await delay(350);
    if (new URL(request.url).searchParams.get('error') === '1')
      return failure('Unable to load this product. Please try again.', 503);
    const product = inventory.find((item) => String(item.id) === params.id);
    return product
      ? HttpResponse.json(product)
      : failure('Product not found.', 404);
  }),
  http.post('*/api/orders', async ({ request }) => {
    await delay(800);
    let body;
    try {
      body = await request.json();
    } catch {
      return failure('Invalid order.');
    }
    if (!body || typeof body.requestId !== 'string' || !body.requestId.trim())
      return failure('An order reference is required.');
    if (orders.has(body.requestId))
      return HttpResponse.json(orders.get(body.requestId));
    if (
      !Array.isArray(body.items) ||
      !body.items.length ||
      Object.keys(validateShipping(body.shipping)).length
    )
      return failure('Check your bag and shipping information.');
    const totals = new Map();
    const keys = new Set();
    const items = [];
    for (const item of body.items) {
      const product = inventory.find((product) => product.id === item?.id);
      if (
        !product ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        !validVariants(product, item.variants)
      )
        return failure(
          'An item or variant is invalid. Please review your bag.',
        );
      const key = cartKey(product.id, item.variants);
      if (keys.has(key))
        return failure('Duplicate item. Please review your bag.');
      keys.add(key);
      totals.set(product.id, (totals.get(product.id) || 0) + item.quantity);
      if (totals.get(product.id) > product.stock)
        return failure(
          `Not enough stock for ${product.title}. Please return to your bag and reduce its quantity.`,
          409,
        );
      items.push({
        key,
        id: product.id,
        title: product.title,
        image: product.image,
        variants: item.variants,
        quantity: item.quantity,
        price: product.price,
        stock: product.stock,
      });
    }
    if (body.scenario === 'failure')
      return failure(
        'Demo payment declined. Your bag is safe. Choose successful payment to retry.',
        402,
      );
    if (body.scenario !== 'success')
      return failure('Choose a demo payment option.');
    const order = {
      id: `FORMA-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      items,
      shipping: Object.fromEntries(
        Object.entries(body.shipping)
          .filter(([, value]) => typeof value === 'string')
          .map(([key, value]) => [key, value.trim()]),
      ),
      total: totalCents(items) / 100,
      createdAt: new Date().toISOString(),
    };
    inventory = inventory.map((product) => ({
      ...product,
      stock: product.stock - (totals.get(product.id) || 0),
    }));
    orders.set(body.requestId, order);
    return HttpResponse.json(order, { status: 201 });
  }),
];
