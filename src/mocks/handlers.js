import { http, HttpResponse, delay } from 'msw';
import products from '../data/products.json';

export const handlers = [
  http.get('*/api/products', async ({ request }) => {
    await delay(650);
    const url = new URL(request.url);
    if (url.searchParams.get('error') === '1') {
      return HttpResponse.json(
        { message: 'Unable to load products.' },
        { status: 503 },
      );
    }
    return HttpResponse.json(products);
  }),
  http.get('*/api/products/:id', async ({ params }) => {
    await delay(350);
    const product = products.find((item) => String(item.id) === params.id);
    return product
      ? HttpResponse.json(product)
      : HttpResponse.json({ message: 'Product not found.' }, { status: 404 });
  }),
];
