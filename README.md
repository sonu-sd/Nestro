# Nestro

Nestro is a furniture storefront with a Next.js frontend and an Express/MongoDB API. It supports verified user authentication, catalog management, cart and order workflows, COD and Razorpay payments, and admin order management.

## Local setup

1. Copy `backend/.env.example` to `backend/.env` and add local credentials.
2. Copy `frontend/.env.example` to `frontend/.env.local`.
3. Run `npm ci` in both `backend` and `frontend`.
4. Start the API with `npm run dev` from `backend` (port `5000`).
5. Start the storefront with `npm run dev` from `frontend` (port `3000`).

The frontend API URL must include `/api`, for example `http://localhost:5000/api`.

## Checks

- Backend: `npm test`
- Frontend: `npm run lint` and `npm run build`
- Dependency audits: `npm audit --omit=dev` in each app directory

## Deployment

The repository includes a Render Blueprint for the backend in `render.yaml`. Follow the complete Vercel, Render and MongoDB Atlas setup guide in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Project layout

- `frontend/`: Next.js App Router storefront and admin UI
- `backend/src/`: Express routes, controllers, models and middleware
- `render.yaml`: Render service definition for the API
- `docs/DEPLOYMENT.md`: production deployment and smoke-test guide
