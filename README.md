# Nestro

Nestro is a furniture shopping application with a Next.js storefront and admin interface, an Express API, and MongoDB storage. Customers can browse furniture, save a cart and delivery addresses, place Cash on Delivery (COD) or Razorpay orders, track orders, and write reviews. Admins manage the catalog, reviews, and orders.

## What the project includes

| Area | How it works |
| --- | --- |
| Storefront | Home page, product catalog, search and filters, product details, cart, checkout, profile, contact and about pages. |
| Accounts | Registration sends an email OTP through Brevo. The API verifies the OTP, signs users in with an HTTP-only cookie, and protects private routes. |
| Catalog | Products are organized by categories, room types and colors. Admins can create and update these and upload images through Cloudinary. |
| Cart | Guests can build a local cart. After sign-in, the app merges it with the account cart stored by the API. |
| Addresses | Customers add, edit, delete and choose a default delivery address in Profile or Checkout. The shared form supports manual entry and current-location lookup. |
| Checkout | The API calculates the checkout summary, records the selected delivery address, and creates COD or Razorpay orders. Online payments are verified by the API; a Razorpay webhook also handles captured payments. |
| Orders | Customers can view and cancel eligible orders. Admins can view orders and update their status. |
| Reviews | Customers submit reviews; admins moderate them before public display. |

## Technology and project structure

- `frontend/`: Next.js 16 App Router, React 19, Tailwind CSS 4, Redux Toolkit, Axios.
- `backend/src/`: Express 5 API, Mongoose models, routes, controllers, authentication and middleware.
- `backend/test/` and `backend/integration/`: API tests.
- `docs/DEPLOYMENT.md`: production setup and checks.
- `render.yaml`: Render API service configuration.

The frontend sends browser requests to its own `/api/*` path. The Next.js rewrite forwards them to the Express API configured by `API_ORIGIN`. This keeps the login cookie on the storefront origin. Express routes are under `/api`; MongoDB stores users, carts, catalog data, orders and reviews. Product and taxonomy images use Cloudinary.

## Run locally

**Requirements:** Node.js 20.9 or newer, npm, and MongoDB (local or Atlas). External services are needed for the corresponding features: Brevo for registration emails, Cloudinary for uploads, Razorpay for online payments, and Geoapify for location-based address fill.

1. Copy `backend/.env.example` to `backend/.env`. Set `MONGO_URI` and a long random `JWT_SECRET`. Fill in the other service credentials you intend to use.
2. Copy `frontend/.env.example` to `frontend/.env.local`. Keep `API_ORIGIN=http://localhost:5000` for a local API. Do not append `/api`.
3. In separate terminals, install dependencies and start both apps:

```bash
cd backend
npm ci
npm run dev
```

```bash
cd frontend
npm ci
npm run dev
```

Open `http://localhost:3000`. The API runs on `http://localhost:5000`; check `/api/health` for the server and `/api/ready` for database readiness.

### Environment variables

The example files list the full configuration. Important values:

| File | Variable | Purpose |
| --- | --- | --- |
| `backend/.env` | `MONGO_URI`, `JWT_SECRET` | Database and signed login sessions; required for the API. |
| `backend/.env` | `CORS_ORIGIN`, `COOKIE_SAME_SITE` | Allowed storefront origin and cookie behavior. |
| `backend/.env` | `BREVO_API_KEY`, `BREVO_SENDER_EMAIL` | Registration OTP email. |
| `backend/.env` | `CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY` | Admin image uploads. |
| `backend/.env` | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Online checkout and webhook validation. |
| `backend/.env` | `GEOAPIFY_API_KEY` | Optional reverse geocoding for the current-location address button. |
| `frontend/.env.local` | `API_ORIGIN` | Backend origin for the frontend API rewrite. |

Never commit real keys. In production, the backend validates the required service variables at startup; see `backend/src/config/env.js`. Add `GEOAPIFY_API_KEY` to the Render service to enable location lookup there.

## How to use Nestro

1. Browse the catalog and open a product to review details. Add items to the cart.
2. Register, verify the email OTP, and sign in. Guest cart items are merged into the account cart.
3. Open **Profile → Addresses** or proceed to **Checkout → Delivery Address**. Add an address manually or press **Use my current location**. Allow browser location access, then review and complete the fields before saving. The first saved address becomes the default; later addresses can be marked as default.
4. Select the delivery address and choose COD or online payment. Place the order and use Profile to check its status.
5. Admin users can open the admin area to maintain products, categories, room types, colors, orders and review moderation.

### Current-location address fill

The shared address form runs in a browser on HTTPS or `localhost`. On button press, the browser asks for location permission and returns coordinates. The authenticated API route `GET /api/user/addresses/reverse-geocode?lat=...&lon=...` sends those coordinates to Geoapify using the backend-only key and returns an Indian street/area, city, state and six-digit PIN when available. The browser fills the form; **it does not save automatically**. GPS and geocoding can be approximate or omit a building number, so the customer must check and edit the address before saving. If permission is denied, lookup fails, or the key is missing, manual entry remains available. Coordinates are used for lookup and are not stored with the address.

The existing API and database field is spelled `adressLine` (one “d” after the initial “a”). The form retains that field name for compatibility with saved addresses and checkout.

## Main API routes

| Path | Purpose |
| --- | --- |
| `/api/user` | Register, verify OTP, sign in/out, profile, saved addresses, current-location lookup. |
| `/api/product`, `/api/category`, `/api/room-type`, `/api/color` | Catalog reads and admin management. |
| `/api/cart` | Account cart and guest-cart merge. |
| `/api/order` | Checkout summary, COD and online orders, payment verification, customer/admin orders. |
| `/api/review` | Public reviews, customer submissions and admin moderation. |
| `/api/health`, `/api/ready` | API liveness and MongoDB readiness. |

Protected routes require a signed-in user; admin mutations require an admin role.

## Checks and deployment

```bash
# From backend/
npm test

# From frontend/
npm run lint
npm run build
```

For production, deploy `backend/` to Render using `render.yaml` and `frontend/` to Vercel with `API_ORIGIN` set to the Render HTTPS origin. Configure Atlas, Cloudinary, Brevo and Razorpay credentials in Render, and optionally Geoapify. Follow [the deployment guide](docs/DEPLOYMENT.md) for seed data, webhooks, cookie checks, and a complete production smoke test.
