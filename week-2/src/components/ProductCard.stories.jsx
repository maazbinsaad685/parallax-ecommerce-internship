import ProductCard from './ProductCard';
import products from '../data/products.json';
const product = products[0];
export default {
  title: 'Catalog/ProductCard',
  component: ProductCard,
  parameters: {
    docs: {
      description: {
        component:
          'Product title links to its detail route. Inventory badges identify low and unavailable stock. Prices use USD throughout the mock catalog.',
      },
    },
  },
  args: { product: { ...product, stock: 25 } },
};
export const Normal = {};
export const LowStock = { args: { product: { ...product, stock: 3 } } };
export const OutOfStock = { args: { product: { ...product, stock: 0 } } };
export const ListView = { args: { view: 'list' } };
