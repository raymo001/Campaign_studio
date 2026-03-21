# Vanpella Campaign Studio

Next.js foundation for a clean campaign studio that generates product-grounded image and video creatives for Vanpella across Facebook, Instagram, Pinterest, and TikTok.

## Included

- route shell and wireframe pages for the core studio flows
- route map and product UX wireframes
- setup guide for Convex, Vercel, and Cloudflare R2
- local environment template
- R2 CORS helper script

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Primary Routes

- `/`
- `/campaigns`
- `/campaigns/new`
- `/campaigns/sample-campaign`
- `/products`
- `/assets`
- `/templates`
- `/brand`
- `/settings`

## Docs

- `docs/campaign-studio-plan.md`
- `docs/wireframes-and-route-map.md`
- `docs/platform-setup.md`

## Environment

Copy the template and fill the missing keys:

```bash
cp .env.example .env.local
```

The local `.env.local` in this repo already includes the Vanpella feed URL and placeholders for the remaining services.
