# Week 1 verification

Validated on 3 November 2026 with Node 24.22.1.

| Check                                     | Result                                                                                                               |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Dependency installation                   | Passed; lockfile included                                                                                            |
| Vite development startup                  | Passed                                                                                                               |
| Production build                          | Passed                                                                                                               |
| Automated tests                           | 8 passed: dataset, search, combined filters, empty results, sorting, API success, detail/404, deliberate API failure |
| Local product images                      | 60 of 60 downloaded successfully                                                                                     |
| Catalog loads through MSW in browser      | Passed; 60 products rendered                                                                                         |
| Combined title search and category        | Passed; uppercase APPLE in Electronics returns 5 products                                                            |
| Grid/list controls                        | Passed; layout changes visibly                                                                                       |
| Empty results and clear filters           | Passed                                                                                                               |
| Loading skeleton and retry                | Passed                                                                                                               |
| API failure UI                            | Passed using `?apiError=1`                                                                                           |
| Product detail, cart, checkout navigation | Passed                                                                                                               |
| Light/dark theme                          | Passed; saved preference applied across page loads                                                                   |
| Responsive grid and list                  | No horizontal overflow in 320, 375, 768, 1024, and 1440px iframe viewports                                           |
| Storybook browser stories                 | Passed; primary/disabled Button, editable Input, low-stock ProductCard                                               |
| Storybook static build                    | Passed with environment compatibility preload described below                                                        |

The responsive test used same-origin browser iframes with the requested outer
widths. Scrollbars occupied 15px, so content was also tested at slightly narrower
widths. Desktop and small-screen layouts were visually inspected.

## Remaining warnings and limits

- This hosted execution environment blocks Node's network-interface enumeration.
  Storybook's build was checked with a temporary preload that catches that OS
  error. This environment-only helper is not part of the delivered application.
  Standard Storybook commands are retained for a normal local Node installation.
- Storybook's generated documentation has chunks above Vite's 500kB advisory.
  The storefront's build did not have this warning. No warning threshold was
  increased to hide it.
- npm reports an environment-provided `http-proxy` configuration warning here.
  No proxy configuration is included in the project.
- The browser host emitted extension metadata errors unrelated to the storefront.
- These checks are not a complete assistive-technology or WCAG audit, nor a
  Lighthouse certification. Future-week functionality is intentionally absent.
