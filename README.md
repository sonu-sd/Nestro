# Nestro

Nestro is an in-progress furniture storefront with a Next.js frontend and an Express/MongoDB backend. It is **not production-ready**. In particular, order endpoints are temporarily disabled until the order flow is implemented and tested.

## Requirements

- Node.js and npm compatible with the versions in `frontend/package.json` and `backend/package.json`
- A MongoDB instance or connection URI
- Cloudinary credentials for image uploads
- A Gmail account with an app password for registration OTP emails

## Local setup

1. Copy `backend/.env.example` to `backend/.env` and fill in real values. Do not commit `.env`.
2. Copy `frontend/.env.example` to `frontend/.env.local`. Its API URL must point to the backend, including `/api`.
3. In `backend`, run `npm ci`, then `npm run dev` (default port `5000`).
4. In `frontend`, run `npm ci`, then `npm run dev` (default port `3000`).
5. Open `http://localhost:3000`.

The backend currently allows browser requests from `http://localhost:3000` only. Keep both default ports for local development unless the backend CORS setting is changed in a later phase.

## Checks

Run `npm run lint` and `npm run build` inside `frontend`. The backend has no automated test script yet; its JavaScript files can be syntax-checked with `node --check`.

At the start of Phase 0, frontend lint had 13 errors and 19 warnings. The frontend production build compiled but failed while prerendering `/admin/category` without a running backend. These are existing baseline issues to address in the next phase; this documentation/setup phase does not claim a clean build.

## Current safety boundary

`/api/order` and `/api/order/create` return HTTP `503` while the order pipeline is unfinished. The checkout UI must not be treated as a working purchase flow. Do not accept real customer orders or payments yet.

## Project layout

- `frontend/`: Next.js App Router storefront, authentication screens, admin screens, Redux cart
- `backend/src/routers/`: Express API routes
- `backend/src/controllers/`: API handlers
- `backend/src/models/`: Mongoose models

Production hardening will proceed phase by phase: baseline/build quality, authentication/security, data validation, catalog/cart, COD checkout, admin, tests, deployment, then monitoring. Each phase should be tested before committing and pushing it.
