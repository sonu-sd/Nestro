# Production deployment

Nestro uses Vercel for the Next.js frontend, Render for the Express API, and MongoDB Atlas for MongoDB. Deploy the backend first, then configure the frontend with its public API URL.

## 1. Prepare MongoDB Atlas

1. Create a production database user with the least privilege needed for the Nestro database (normally `readWrite`).
2. Add Render to the Atlas network access list. If a fixed provider IP range is unavailable, `0.0.0.0/0` is a temporary compatibility option; use a strong database password and narrow the rule whenever possible.
3. Copy the SRV connection string and URL-encode its password before using it as `MONGO_URI`.

## 2. Deploy the API on Render

1. In Render, create a Blueprint from this Git repository. Render reads the root-level `render.yaml`.
2. The service uses the `backend` directory, `npm ci`, `npm start`, and `/api/ready` as its readiness check.
3. During first setup, provide every value marked as a secret. Render generates `JWT_SECRET`; do not replace it unless you intentionally want to invalidate every session.
4. Set `CORS_ORIGIN` to the exact Vercel production URL, for example `https://nestro.vercel.app`. Do not add a trailing slash.
5. Copy the resulting HTTPS API URL, such as `https://nestro-api.onrender.com`.

Required Render secrets:

- `MONGO_URI`
- `CORS_ORIGIN`
- `CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY`
- `EMAIL_USER`, `EMAIL_PASS`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

The Blueprint sets `NODE_ENV=production` and `COOKIE_SAME_SITE=none`. This keeps the HTTP-only session cookie usable from the Vercel domain while requiring HTTPS.

## 3. Deploy the frontend on Vercel

1. Import the same Git repository as a new Vercel project.
2. In **Build and Deployment**, set Root Directory to `frontend`.
3. Add these production environment variables before deploying:

   - `NEXT_PUBLIC_API_BASE_URL=https://your-render-service.onrender.com/api`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_or_test_key_id`

4. Deploy and copy the Vercel production URL.
5. Return to Render, set `CORS_ORIGIN` to that exact URL, and redeploy the API.

For preview deployments, add the corresponding preview domain to `CORS_ORIGIN` as a comma-separated value only when you need authenticated preview testing.

## 4. Smoke test after every production deploy

1. Open `https://your-render-service.onrender.com/api/health`; it must return HTTP 200.
2. Open `https://your-render-service.onrender.com/api/ready`; it must return HTTP 200 after MongoDB connects.
3. Open the Vercel URL and verify catalog loading, registration/login, logout, cart, address flow, COD checkout, Razorpay test payment, and admin order updates.
4. Confirm the login response sets a cookie with `HttpOnly`, `Secure`, and `SameSite=None`.
5. Confirm browser requests originate only from the configured Vercel domain and no CORS errors appear.

## Rollback

If a deploy fails, use Render's or Vercel's dashboard to promote the last healthy deployment. Do not rotate `JWT_SECRET` during a rollback unless session invalidation is intentional.

## Secret handling

Never commit `.env`, `.env.local`, database URLs, Cloudinary credentials, email app passwords, JWT secrets, or Razorpay secret keys. Rotate any credential immediately if it is exposed.
