# Nestro production flow

The setup order is Atlas → seed → Cloudinary and Brevo → Razorpay test mode → Render API → Vercel storefront → end-to-end tests → Razorpay live mode. Keep the database name `Nestro` in every connection string; Atlas database names are case-sensitive. Local MongoDB data is not migrated.

## Atlas and seed

1. Create an Atlas project and a cluster in a region near the Render service (the Blueprint uses Singapore).
2. Create a database user with `readWrite` access only to `Nestro`. Use a generated password.
3. Add your current IP to Atlas Network Access so the seed can run from your computer. Add Render's outbound IP ranges before deployment; use `0.0.0.0/0` only if your Render setup has no narrower workable range, and protect the database user with a strong password.
4. From Atlas **Connect → Drivers → Node.js**, copy the `mongodb+srv://` URL. URL-encode special characters in the password and set the path to `/Nestro` (for example, `mongodb+srv://USER:PASSWORD@HOST/Nestro?retryWrites=true&w=majority`). Keep it out of Git and chat.
5. In a PowerShell session from `backend`, set `MONGO_URI`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, and `SEED_DEMO_PASSWORD`. Passwords must be at least 12 characters. The admin email must be yours. The three demo users have `.example.test` addresses and are already verified; they are for testing, not real customer accounts.
6. Run `npm ci`, then `npm run seed:atlas` to validate without connecting. Run `npm run seed:atlas -- --check-images` to check every stock-photo URL. Run `npm run seed:atlas -- --apply` once the Atlas URL and credentials are ready; it also checks images before writing. It only inserts missing slugs/emails; reruns do not overwrite existing catalog or reset passwords. The script refuses a local MongoDB URL.

If image validation reports an HTTP 404, replace that URL in the seed data. If the image host is unreachable from your network, review the URLs manually; `npm run seed:atlas -- --apply --skip-image-check` is an explicit fallback and still rejects local MongoDB. Check all storefront images before accepting orders.

The seed inserts 6 categories, 5 rooms, 8 colors, 36 sample products, three demo users, and one admin. Images are illustrative Unsplash links, not exact SKU photographs. Review the images, specifications, prices, and stock before selling these products. Replace sample photos with your own Cloudinary assets through the admin UI.

## Cloudinary and Brevo

Create a Cloudinary account for admin-uploaded product, room, and category images. Save `CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_SECRET_KEY` for Render.

Create a Brevo account, verify a sender email, and authenticate its sending domain. Generate a transactional API key and save `BREVO_API_KEY` and `BREVO_SENDER_EMAIL` for Render. The backend sends registration OTPs via Brevo's HTTP API; SMTP and Nodemailer are not used.

## Razorpay test setup

Create a Razorpay account and use **Test Mode** first. Generate a test key pair for `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. Enable automatic payment capture. Create a webhook with event `payment.captured` and its own `RAZORPAY_WEBHOOK_SECRET`. After Render deployment the webhook URL is `https://YOUR-RENDER-HOST/api/order/razorpay/webhook`. The webhook secret is different from the key secret. The server validates both checkout signatures and payment status, and the webhook confirms a captured payment if the browser callback is missed.

## Render API

Push the prepared repository to GitHub, then create a Render Blueprint using root `render.yaml`. It uses the `backend` root directory, `npm ci`, `npm start`, and `/api/ready`. Set the following secret values in Render:

- `MONGO_URI` (same Atlas `Nestro` database)
- `CORS_ORIGIN` (exact Vercel production origin, such as `https://nestro.vercel.app`, no trailing slash)
- `CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY`
- `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`

The Blueprint generates `JWT_SECRET`, sets `NODE_ENV=production`, and uses `COOKIE_SAME_SITE=lax`. Record the HTTPS Render origin. It may be necessary to temporarily use the intended Vercel URL for `CORS_ORIGIN` before the first frontend deploy, then update it to the actual URL.

## Vercel storefront

Import the same repository into Vercel and set its Root Directory to `frontend`. Before deployment set `API_ORIGIN` to the Render HTTPS origin **without** `/api`, for example `https://nestro-api.onrender.com`. The Next.js rewrite sends browser `/api/*` calls to Render under the Vercel hostname so the HTTP-only login cookie works with checkout and the route guard. Razorpay's public key is returned by the API when checkout begins; it is not a frontend environment variable.

Deploy, record the exact Vercel production URL, and set that URL in Render `CORS_ORIGIN`. Redeploy Render if needed. Configure the Razorpay webhook using the Render origin.

## Production verification and live payments

Confirm Render `/api/health` and `/api/ready` both return HTTP 200. On Vercel, check catalog images, registration and Brevo OTP, login, cart, address, COD checkout, Razorpay test payment, and admin access. Check that login response sets `HttpOnly`, `Secure`, and `SameSite=Lax` cookie on the Vercel origin. Confirm a captured test payment becomes `PAID` even when the browser checkout callback is missed.

For real payments, finish Razorpay account activation, switch to Live Mode, generate live keys, and create a **live-mode** webhook and secret. Change only the Razorpay values in Render, test a small live transaction, and confirm order and dashboard amounts match. Keep secret keys out of Git and rotate any exposed credential.
