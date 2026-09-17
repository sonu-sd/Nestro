# Nestro frontend

This is the Next.js storefront and admin UI.

## Local development

```bash
npm ci
npm run dev
```

Create `.env.local` from `.env.example` first. `NEXT_PUBLIC_API_BASE_URL` must include the `/api` suffix.

## Production deployment

Deploy this directory as a Vercel project with `frontend` selected as its Root Directory. Complete environment-variable setup, cross-site cookie configuration and post-deploy smoke tests are documented in [../docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md).
