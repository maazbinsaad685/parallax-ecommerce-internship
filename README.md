# Forma

## Overview

Forma is a Week 1 internship storefront built with React and Vite. It pairs a
quiet green-and-neutral design with a working product catalog. All prices,
ratings, inventory, and variants are demonstration data. No orders or payments
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

Later weeks will add cart state and optimistic updates with rollback, XState
checkout, WebSocket inventory, a lazy-loaded 3D viewer, offline/PWA behavior,
and deeper accessibility/performance work. This version does not claim WCAG
certification or a Lighthouse score of 100.
