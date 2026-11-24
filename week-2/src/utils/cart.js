export const cartKey = (id, variants) =>
  JSON.stringify([
    id,
    Object.entries(variants).sort(([a], [b]) => a.localeCompare(b)),
  ]);
export const totalCents = (items) =>
  items.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
    0,
  );
export const productQuantity = (items, id) =>
  items
    .filter((item) => item.id === id)
    .reduce((sum, item) => sum + item.quantity, 0);
export function validVariants(product, variants) {
  return (
    variants &&
    Object.keys(variants).length === Object.keys(product.variants).length &&
    Object.entries(product.variants).every(([name, values]) =>
      values.includes(variants[name]),
    )
  );
}
export function addItem(items, product, variants, quantity) {
  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    !validVariants(product, variants) ||
    productQuantity(items, product.id) + quantity > product.stock
  )
    return items;
  const key = cartKey(product.id, variants);
  const existing = items.find((item) => item.key === key);
  return existing
    ? items.map((item) =>
        item.key === key
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      )
    : [
        ...items,
        {
          key,
          id: product.id,
          title: product.title,
          image: product.image,
          price: product.price,
          stock: product.stock,
          variants,
          quantity,
        },
      ];
}
export function changeQuantity(items, key, quantity) {
  const item = items.find((entry) => entry.key === key);
  if (
    !item ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    productQuantity(items, item.id) - item.quantity + quantity > item.stock
  )
    return items;
  return items.map((entry) =>
    entry.key === key ? { ...entry, quantity } : entry,
  );
}
export function restoreCart(raw) {
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.reduce((items, item) => {
      if (
        !item ||
        !Number.isInteger(item.id) ||
        typeof item.title !== 'string' ||
        typeof item.image !== 'string' ||
        !Number.isFinite(item.price) ||
        item.price <= 0 ||
        !Number.isInteger(item.stock) ||
        item.stock < 0 ||
        !item.variants ||
        typeof item.variants !== 'object' ||
        Object.values(item.variants).some((value) => typeof value !== 'string')
      )
        return items;
      return addItem(
        items,
        {
          ...item,
          variants: Object.fromEntries(
            Object.entries(item.variants).map(([k, v]) => [k, [v]]),
          ),
        },
        item.variants,
        item.quantity,
      );
    }, []);
  } catch {
    return [];
  }
}
