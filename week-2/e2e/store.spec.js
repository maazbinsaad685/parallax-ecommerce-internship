import { test, expect } from '@playwright/test';
const shipping = {
  'Full name': 'Demo Customer',
  Email: 'demo@example.com',
  'Phone number': '+92 300 1234567',
  Address: '123 Demo Road',
  City: 'Karachi',
  'Postal code': '75500',
  Country: 'Pakistan',
};
async function noOverflow(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}
test('catalog, variants, persistence, shipping, failed payment and confirmation', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.product-card')).toHaveCount(60);
  if (test.info().project.name !== 'tablet')
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await page.getByLabel('Search products by title').fill('Blue & Black');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'List view', exact: true }).click();
  await expect(page.locator('.list-card')).toHaveCount(1);
  await page
    .getByRole('heading', { name: 'Blue & Black Check Shirt' })
    .getByRole('link')
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Blue & Black Check Shirt',
  );
  await expect(page.getByLabel('size', { exact: true })).toHaveValue('S');
  await page.getByRole('button', { name: 'Add to Cart', exact: true }).click();
  await page.getByRole('button', { name: 'Add to Cart', exact: true }).click();
  await page.getByLabel('size', { exact: true }).selectOption('M');
  await page.getByRole('button', { name: 'Add to Cart', exact: true }).click();
  await noOverflow(page);
  await page.getByRole('link', { name: 'Shopping bag, 3 items' }).click();
  await expect(page.locator('.cart-item')).toHaveCount(2);
  await page
    .getByRole('button', {
      name: 'Increase quantity for Blue & Black Check Shirt',
    })
    .first()
    .click();
  await expect(
    page.getByRole('link', { name: 'Shopping bag, 4 items' }),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator('.cart-item')).toHaveCount(2);
  await expect(page.locator('html')).toHaveAttribute(
    'data-theme',
    test.info().project.name === 'tablet' ? 'light' : 'dark',
  );
  await page
    .getByRole('button', {
      name: 'Decrease quantity for Blue & Black Check Shirt',
    })
    .first()
    .click();
  await noOverflow(page);
  await page.getByRole('link', { name: 'Proceed to checkout' }).click();
  await page.getByRole('button', { name: 'Continue to shipping' }).click();
  await page.getByRole('button', { name: 'Continue to payment' }).click();
  await expect(page.getByText('Full name is required.')).toBeVisible();
  for (const [label, value] of Object.entries(shipping))
    await page.getByLabel(label, { exact: true }).fill(value);
  await page.getByLabel('Email', { exact: true }).fill('broken');
  await page.getByRole('button', { name: 'Continue to payment' }).click();
  await expect(page.getByText('Enter a valid email address.')).toBeVisible();
  await page.getByLabel('Email', { exact: true }).fill(shipping.Email);
  await noOverflow(page);
  await page.getByRole('button', { name: 'Continue to payment' }).click();
  await page.getByLabel('Failed payment (test retry)', { exact: true }).check();
  await page
    .getByRole('button', { name: 'Place demo order', exact: true })
    .click();
  await expect(page.getByRole('alert')).toContainText('Demo payment declined');
  await expect(
    page.getByRole('link', { name: 'Shopping bag, 3 items' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Back to shipping' }).click();
  await expect(page.getByLabel('Full name', { exact: true })).toHaveValue(
    'Demo Customer',
  );
  await page.getByRole('button', { name: 'Continue to payment' }).click();
  await page.getByLabel('Successful payment', { exact: true }).check();
  await noOverflow(page);
  await page
    .getByRole('button', { name: 'Place demo order', exact: true })
    .click();
  await expect(
    page.getByText('DEMO ORDER CONFIRMED', { exact: true }),
  ).toBeVisible();
  await expect(page.locator('.cart-item')).toHaveCount(2);
  await expect(page.locator('.summary-total')).toContainText('$89.97');
  await expect(
    page.getByRole('link', { name: 'Shopping bag, 0 items' }),
  ).toBeVisible();
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem('forma-cart-v1')),
    ),
  ).toEqual([]);
  await noOverflow(page);
  await page.screenshot({
    path: `test-results/confirmation-${test.info().project.name}.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test('category, empty search, API errors, empty checkout and removal', async ({
  page,
}) => {
  await page.goto('/?category=Home');
  await expect(page.locator('.product-card').first()).toBeVisible();
  for (const meta of await page
    .locator('.product-meta > span:first-child')
    .allTextContents())
    expect(meta).toBe('Home');
  await page.getByLabel('Search products by title').fill('does-not-exist');
  await expect(page.getByText('No matches just yet')).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.product-card')).toHaveCount(60);
  await page.goto('/products/11?apiError=1');
  await expect(page.getByText('Product unavailable')).toBeVisible();
  await page.goto('/products/999999');
  await expect(page.getByText('Product not found.')).toBeVisible();
  await page.goto('/checkout');
  await expect(page.getByText('Your bag is empty.')).toBeVisible();
  await page.goto('/products/11');
  await page.getByRole('button', { name: 'Add to Cart', exact: true }).click();
  await page.getByRole('link', { name: 'Shopping bag, 1 items' }).click();
  await page
    .getByRole('button', { name: 'Remove Annibale Colombo Bed' })
    .click();
  await expect(page.getByText('A little space for good things.')).toBeVisible();
  await noOverflow(page);
});

test('stock limits across variants and cached product navigation', async ({
  page,
}) => {
  let detailRequests = 0;
  page.on('request', (request) => {
    if (request.url().includes('/api/products/86')) detailRequests++;
  });
  await page.goto('/products/45');
  await expect(
    page.getByRole('button', { name: 'Out of stock', exact: true }),
  ).toBeDisabled();
  await page.goto('/products/86');
  await page.getByRole('button', { name: 'Add to Cart', exact: true }).click();
  await page.getByLabel('size', { exact: true }).selectOption('M');
  await page.getByRole('button', { name: 'Add to Cart', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Stock limit reached' }),
  ).toBeDisabled();
  await page.getByRole('link', { name: 'Shopping bag, 2 items' }).click();
  await expect(
    page
      .getByRole('button', {
        name: 'Increase quantity for Man Short Sleeve Shirt',
      })
      .first(),
  ).toBeDisabled();
  await expect(
    page
      .getByRole('button', {
        name: 'Decrease quantity for Man Short Sleeve Shirt',
      })
      .first(),
  ).toBeDisabled();
  const initialDetailRequests = detailRequests;
  await page
    .getByRole('heading', { name: 'Man Short Sleeve Shirt' })
    .first()
    .getByRole('link')
    .click();
  await expect(
    page.getByRole('button', { name: 'Stock limit reached' }),
  ).toBeDisabled();
  expect(detailRequests).toBe(initialDetailRequests);
});
