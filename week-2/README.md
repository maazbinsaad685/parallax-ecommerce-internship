# Forma

## Overview

Forma is a Weeks 1–2 internship storefront built with React and Vite. It pairs a
quiet green-and-neutral design with a working product catalog. All prices,
ratings, inventory, and variants are demonstration data. Week 2 supports mock orders and demo payments only; no real payments
are accepted.

## Week 1 Progress

- React + Vite with JavaScript and the `@/` source alias.
- Tailwind CSS v4 configured with its Vite plugin; reusable design tokens and
  component styles live in `src/styles.css`.
- Responsive catalog with 60 products across seven categories.
- MSW endpoints, skeleton loading, error handling, and retry.
- Case-insensitive title search, category filtering, and combined filters.
- Grid/list layouts, sorting, and clear-filter empty states.
- Persistent light/dark mode, semantic controls, skip link, focus styles,
  product image text alternatives, and reduced-motion support.
- Product details fetched through the API. Cart and checkout preview routes.
- Storybook with documented Button, Input, and ProductCard states.
- Four low-fidelity SVG wireframes.
- Prettier formatting at an 80-character target and VS Code word wrap enabled.

## Tech Stack

React 19, Vite 8, JavaScript, Tailwind CSS 4, React Router 7, MSW 3,
Storybook 10, Lucide React, Vitest, and Prettier. Exact resolved versions are
recorded in `package-lock.json`.

## Installation

Use Node.js 22.12 or newer (Node 24 was used for validation).

For the downloaded ZIP, extract it and open the `forma-week-1` folder in VS Code.
Open its integrated terminal and run:

```bash
npm install
npm run dev
```

Open the localhost URL printed by Vite. On Windows PowerShell, use `npm.cmd`
in place of `npm` if script execution policy blocks `npm.ps1`.

If you later put the project in your existing Git repository, clone your actual
repository URL. Replace `YOUR_REPOSITORY_URL` below; it is a placeholder because
no repository URL was provided for this project.

```bash
git clone YOUR_REPOSITORY_URL forma
cd forma
npm install
npm run dev
```

Do not open `index.html` directly. Vite compiles JSX and Tailwind, and MSW needs
localhost or HTTPS. No environment variables or separate API server are needed.

## Storybook

Run in a second terminal:

```bash
npm run storybook
```

Open `http://localhost:6006`. Stories include primary/secondary/disabled buttons,
labelled/default/placeholder/disabled inputs, and normal/low-stock/out-of-stock
product cards. The toolbar switches light and dark themes.

```bash
npm run build-storybook
```

The static component documentation is generated in `storybook-static/`.

## Mock API

The app starts MSW before rendering and calls `fetch` through `useProducts`.
Catalog components never import the dataset directly.

| Request                     | Result                              |
| --------------------------- | ----------------------------------- |
| `GET /api/products`         | 60 products after a simulated delay |
| `GET /api/products/:id`     | Product details or a 404 response   |
| `GET /api/products?error=1` | Deliberate 503 response for testing |

Open `/?apiError=1` to inspect the catalog error state. Retry keeps failing while
that flag is present; remove it to restore the successful response. There are no
random failures. Search and categories are stored in URL query parameters.

MSW uses a service worker only to intercept mock API requests. No offline cache,
PWA installation, or future-week service worker features are implemented.
The mock API intentionally runs in both development and production previews.
Replace it with a real API before using the storefront commercially.

## Project Structure

| Folder               | Purpose                                                 |
| -------------------- | ------------------------------------------------------- |
| `src/components/`    | Header, filters, search, view toggle, and product cards |
| `src/components/ui/` | Reusable Button, Input, and Skeleton primitives         |
| `src/pages/`         | Catalog, ProductDetails, Cart, and Checkout             |
| `src/layouts/`       | Shared navigation, page shell, and footer               |
| `src/hooks/`         | Fetch lifecycle and persistent theme                    |
| `src/data/`          | Local product JSON                                      |
| `src/mocks/`         | MSW worker setup and HTTP handlers                      |
| `src/utils/`         | Filtering, currency formatting, and automated tests     |
| `public/images/`     | Locally bundled product images                          |
| `.storybook/`        | Component documentation configuration                   |
| `.vscode/`           | Word wrap and editor formatting settings                |
| `docs/wireframes/`   | Four browser-viewable SVG wireframes                    |

## Wireframes

Open the SVG files directly in a browser:

- `docs/wireframes/catalog-wireframe.svg`
- `docs/wireframes/product-details-wireframe.svg`
- `docs/wireframes/cart-wireframe.svg`
- `docs/wireframes/checkout-wireframe.svg`

## Validation

```bash
npm test
npm run build
npm run format:check
```

See `docs/verification.md` for the checks performed and environment limitations.
The production build is written to `dist/`. Run `npm run preview` to inspect it.
When deploying elsewhere, configure your static host to serve `index.html` for
unknown routes so direct links to `/products/14` work.

## Data and Images

Product names, descriptions, sample prices, and images were adapted from
[DummyJSON](https://dummyjson.com/). The selected dataset is stored locally and
the 60 thumbnails are bundled; there is no runtime dependency on that service.
Variants and stock edge cases were adjusted for this exercise. Product claims
and stock are fictional demonstrations, not verified commercial information.
Brand names belong to their respective owners.

## Continuing in Week 2

Keep working in the same project and Git repository. If you want weekly backup
folders, keep those outside the repository. No Git repository was initialized,
no history was changed, and nothing was pushed to GitHub during creation.

## Future Work

Later weeks will add optimistic updates with rollback, WebSocket inventory,
a lazy-loaded 3D viewer, offline/PWA behavior,
and deeper accessibility/performance work. This version does not claim WCAG
certification or a Lighthouse score of 100.

# Week 2 Progress

The Week 1 catalog, filtering, sorting, grid/list views, themes, local imagery,
Storybook stories, and wireframes are retained. The Week 1 progress list above
records the original milestone; the cart and checkout previews are now functional.

## Implemented features

- Product Details fetches the selected ID from MSW through TanStack React Query.
  Existing product images, title, price, brand, category, rating, description,
  and stock remain visible. Variant selectors use each product's actual mock
  options (including clothing sizes and colors), with quantity controls, add to
  cart, unavailable-product errors, retry, skeletons, and out-of-stock handling.
- The shopping bag merges identical product/variant combinations and separates
  different variants. Quantities must be positive integers and cannot exceed
  aggregate product stock across variants. Remove items, view unit prices and
  line totals, continue shopping, or proceed to checkout. The header badge counts
  units. Cart data persists in `localStorage` under `forma-cart-v1`; malformed
  entries are discarded, and unavailable browser storage displays a warning.
- Server data is owned by React Query; client cart state is separate React context.
  Queries are cached for 60 seconds, do not automatically refetch on window focus,
  and use explicit retry after errors. Successful orders invalidate product
  queries because the mock inventory has changed. Orders are also added to the
  query cache. Monetary totals are calculated in cents.
- A real XState v5 machine controls `cart → shipping → payment → submitting →
confirmation`. Guards reject empty bags, invalid shipping and unknown payment
  choices. Submission is an invoked promise actor; repeated submit/back events
  are ignored while it is pending. Failed orders return to payment with the
  original bag and shipping information, and can be retried. Back navigation
  preserves shipping within the mounted checkout.
- Shipping includes accessible labels, autocomplete, required-field checks,
  email and 7–15-digit phone validation, inline errors and focus on the first
  invalid field. Use fictional customer details for this exercise.
- Demo payment offers explicit success/failure scenarios. It collects no card
  data, uses no gateway, and makes no real charges. `POST /api/orders` validates
  products, variants, aggregate stock and shipping, uses authoritative mock
  prices, and deduplicates successful requests by request ID.
- Confirmation shows the generated order ID, shipping destination, purchased
  variants, quantities and total. The cart clears only after a successful order.
  Shipping is free in this demo; no separate taxes or fees are added.
- New UI uses the existing theme variables, buttons, inputs, spacing and responsive
  breakpoints. No WebSockets, 3D viewer or PWA functionality was added.

## New dependencies

Runtime: `@tanstack/react-query` 5.105.3, `xstate` 5.33.3,
`@xstate/react` 6.1.0. Development: `eslint`, `@eslint/js`,
`eslint-plugin-react-hooks`, and `@playwright/test`.
The lockfile records exact versions. Use Node 22.13+ or Node 24 LTS for the
new ESLint tooling.

## Updated structure and file changes

| Location                                                                                  | Changes                                                  |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `src/api/client.js`                                                                       | Query client, JSON request and order submission helpers  |
| `src/state/CartContext.jsx`                                                               | Cart provider and localStorage persistence               |
| `src/state/checkoutMachine.js`                                                            | Checkout guards, transitions and async order actor       |
| `src/utils/cart.js`, `src/utils/shipping.js`                                              | Pure cart rules, currency totals and shipping validation |
| `src/components/ProductPurchase.jsx`, `QuantitySelector.jsx`                              | Variant selection and purchase controls                  |
| `src/components/CartItems.jsx`, `OrderSummary.jsx`                                        | Shared bag/order display                                 |
| `src/components/ShippingForm.jsx`, `PaymentStep.jsx`                                      | Shipping and demo payment UI                             |
| `src/pages/ProductDetails.jsx`, `Cart.jsx`, `Checkout.jsx`                                | Upgraded existing routes                                 |
| `src/main.jsx`, `src/components/Header.jsx`                                               | Providers and live bag badge                             |
| `src/hooks/useProducts.js`, `src/mocks/handlers.js`                                       | React Query integration and mock ordering API            |
| `src/styles.css`                                                                          | Theme-aware Week 2 styles and mobile layouts             |
| `src/utils/cart.test.js`, `src/state/checkoutMachine.test.js`, `src/mocks/orders.test.js` | Unit, state machine and API tests                        |
| `e2e/store.spec.js`, `playwright.config.js`                                               | Desktop/mobile browser journeys                          |
| `eslint.config.js`, `vite.config.js`, `package.json`, `package-lock.json`, `.gitignore`   | Tooling, dependency and test configuration               |
| `README.md`, `docs/week-2-verification.md`                                                | Week 2 documentation and actual validation results       |

## Run in your existing repository

This is an update of the uploaded `forma-week-1` folder, not a new scaffold.
The ZIP contains no `.git` directory. Copy its contents into your existing
project folder, replacing matching files while keeping your existing `.git`
directory. No repository was initialized and nothing was pushed to GitHub.

```bash
npm install
npm run dev
```

Keep that terminal running and open the localhost link it prints. On Windows
PowerShell, if `npm.ps1` is blocked, use:

```powershell
npm.cmd install
npm.cmd run dev
```

Storybook runs separately:

```bash
npm run storybook
```

## Testing instructions

```bash
npm test
npm run lint
npm run build
npm run build-storybook
npm run format:check
npx playwright install chromium
npm run test:e2e
```

Vitest covers the original catalog, cart merging, variant separation, stock,
quantity validation, persisted data, shipping errors, guarded machine transitions,
payment retry, duplicate submissions and mock order validation. Playwright covers
browser journeys at desktop and mobile sizes. See `docs/week-2-verification.md`
for the checks actually executed and any environment workarounds.

To inspect error states, visit `/?apiError=1` or `/products/11?apiError=1`.
Remove the query parameter to restore success. Select the failed demo payment
option to test retry; select successful payment to finish the order.

## Demo limitations

Mock orders and inventory changes live in memory and reset on a full reload.
Cart data persists, but checkout progress and confirmation are not saved across
reloads. Refreshing checkout starts at bag review; refreshing after a successful
order shows an empty bag. Product photos and variant choices are limited to the
existing Week 1 dataset; selecting a variant does not invent new photographs.
The API validates stock and prices again at submission. This is a mock storefront,
not a production payment, inventory or order-management system.

## Week 2 corrections

The cart now uses `src/state/cartMachine.js` as its single source of truth.
ADD_ITEM, REMOVE_ITEM, INCREASE_QUANTITY, DECREASE_QUANTITY, SET_QUANTITY
and CLEAR_CART events reuse stock and variant validation. CartContext preserves
localStorage persistence and the existing checkout interface. Checkout remains
controlled by its original XState machine.

ProductGallery supports thumbnail selection, arrow keys, Home/End, visible focus,
selected buttons and broken-image fallbacks. The Annibale Colombo Bed includes
a second locally bundled product photograph from DummyJSON. Other products
honestly show one image when no additional photograph is provided.

Toasts provides automatic dismissal, success/error colors, a polite live region
and a dismiss button. Cart actions and HTTP API errors report feedback; successful
mock orders report success. Inline validation remains. No dependencies were added.

New files: src/state/cartMachine.js, src/state/cartMachine.test.js,
src/components/ProductGallery.jsx, src/components/Toasts.jsx,
src/utils/notifications.js, public/images/11-view-2.webp.
Modified: src/state/CartContext.jsx, src/pages/ProductDetails.jsx, src/main.jsx,
src/api/client.js, src/styles.css, src/data/products.json, .prettierrc, README.md.

Verification: 29 unit/API/machine tests passed; production build and lint passed.
Storybook build was attempted but blocked by this host's network-interface error.
Browser verification is not claimed. Original Week 1 documentation above is retained.
Modified JavaScript and JSX use Prettier with printWidth 90.

Extract the archive, then open the inner forma-week-1 folder containing package.json:

```powershell
cd forma-week-1
npm.cmd install
npm.cmd run dev
```

Checks: npm.cmd test, npm.cmd run lint, npm.cmd run build,
npm.cmd run test:e2e, npm.cmd run build-storybook.
Run npm.cmd run storybook in a separate terminal for component previews.
