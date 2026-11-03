export const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    price,
  );

export function filterProducts(products, search, category, sort = 'featured') {
  const query = search.trim().toLowerCase();
  const result = products.filter(
    (product) =>
      product.title.toLowerCase().includes(query) &&
      (category === 'All' || product.category === category),
  );
  if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
  if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
  return result;
}
