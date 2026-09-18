# Nestro frontend

This is the Next.js storefront and admin UI.

## Local development

```bash
npm ci
npm run dev
```

Create `.env.local` from `.env.example` first. `API_ORIGIN` is the backend origin without `/api`.

## Production deployment

Deploy this directory as a Vercel project with `frontend` selected as its Root Directory. Set `API_ORIGIN` to the Render HTTPS origin. Production setup and smoke tests are documented in [../docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md).
