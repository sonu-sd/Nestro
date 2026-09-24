# Admin colors and store filtering

## Admin workflow

1. Sign in with an admin account and open `/admin/colors`.
2. Add a color with a name and six-digit hex code. The slug is generated from the name and can be edited. A slug must be unique.
3. Open `/admin/products/add` or a product's Edit page and select up to 12 colors. Save the product.
4. To change a color's name or hex code, use Edit on the Colors page. To remove it from new selections and storefront filters, archive it. Archiving does not erase existing product references.

## Storefront flow

The store sidebar loads active colors from `GET /api/color`. Selecting swatches changes the `color` URL parameter (for example, `/store?color=walnut-brown,cream`). The store page passes those slugs to `GET /api/product`, which finds matching active color IDs and filters products. Multiple colors are combined as an OR choice; other active filters still apply. Pagination resets to page 1 when colors change.

## Existing products

The original free-text `product.color` field is retained. If a product has not yet been assigned catalog colors, the color filter can still match its legacy text when that text exactly matches an active color name, ignoring case. Once catalog colors are assigned, those references take precedence. No automatic database rewrite or deletion of old color text is performed.

## Loading and theme

Admin navigation has a route-level skeleton, and data-driven admin pages show skeletons while their initial API requests are pending. Store product results and the filter sidebar also have skeletons. The admin shell uses the storefront's cream, walnut, and warm-border palette; admin styling is scoped to `.admin-theme` so it does not change customer-facing pages.
