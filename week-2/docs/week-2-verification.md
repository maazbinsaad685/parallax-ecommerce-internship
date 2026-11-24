# Week 2 verification

Validated on 5 November 2026 (Asia/Karachi), using Node 24.22.1.

| Check                          | Actual result                                                       |
| ------------------------------ | ------------------------------------------------------------------- |
| `npm test`                     | Passed: 18 tests in 4 files, including all 8 original catalog tests |
| `npm run lint`                 | Passed with no warnings or errors                                   |
| `npm run build`                | Passed                                                              |
| `npm run format:check`         | Passed after formatting                                             |
| `npm run build-storybook`      | Passed using the environment-only workaround below                  |
| Storybook browser smoke        | All 10 original stories rendered without page errors                |
| Playwright desktop (1440×1000) | All 3 scenarios passed                                              |
| Playwright mobile (390×844)    | All 3 scenarios passed                                              |
| Playwright tablet (768×1024)   | All 3 scenarios passed                                              |

## Browser coverage

The nine scenario executions cover catalog search and categories, empty search,
list layout, product routes, product errors/404s, out-of-stock controls, stock
limits across variants, quantity updates, item removal, merged versus separate
variants, cart persistence, badge counts, empty checkout protection, required
shipping and email errors, payment decline/retry, preserved shipping, order
confirmation, correct item totals, successful-cart clearing, and query reuse
when navigating back to a cached product. The full checkout journeys check
horizontal overflow at the product, cart, shipping, payment and confirmation
steps. Desktop/mobile checkout use dark mode; tablet checkout uses light mode.
Mobile dark and tablet light confirmation screenshots were visually inspected.
These are automated Chromium checks, not claims of exhaustive cross-browser or
screen-reader certification.

## Test corrections and environment details

The first unit run exposed a missing brace in the machine definition, which was
fixed before the final passing runs. The first cache test counted Strict Mode's
initial aborted development request; it was corrected to compare request counts
before and after returning to the cached product. Stock/cache checks then passed
on all three viewports. The three scenario types were executed in batches, with
all nine ultimately passing.

This execution environment denies Node's network-interface enumeration. The
unmodified Storybook command initially failed with `uv_interface_addresses`.
For validation only, a temporary Node preload supplied a loopback interface;
Storybook then built successfully. This shim is not included in the project
and is not needed for normal Windows development. Storybook emitted its usual
large-bundle warning, but no build errors.

The standard Playwright Chromium download returned a corrupt archive here.
Browser checks instead used Chromium 153 from a temporary `@sparticuz/chromium`
installation outside the project and an external Playwright config override.
That temporary package/config is not a project dependency or deliverable.
On your computer, install the standard browser with
`npx playwright install chromium`, then run `npm run test:e2e`.
Playwright's local server explicitly binds to 127.0.0.1.

MSW emitted navigation-request warnings during full page reloads in development;
all API and navigation assertions passed, and the full checkout journeys had no
uncaught browser page errors.

## Known demo boundaries

- Cart persistence is local to the browser; no cross-tab sync is implemented.
- Mock orders and inventory reset on reload; checkout progress/confirmation are
  not persisted. No real order history, payment or shipping integration exists.
- Server-side mock validation rejects stale stock and manipulated prices. Bag
  display uses its stored snapshot until the user edits/re-adds items; final
  validation occurs when submitting an order.
- Original Week 1 dataset and photographs are retained. Some variant selectors
  have a single option because that is what the dataset provides.
- WebSockets, Three.js and offline/PWA features are deliberately deferred.
- No Git repository was present in the uploaded ZIP. No repository was created,
  no Git history was modified and nothing was pushed. Copy the updated files
  into the existing checkout while keeping its `.git` directory.
