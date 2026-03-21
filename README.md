# Vanpella Campaign Studio

Next.js foundation for a clean campaign studio that generates product-grounded image and video creatives for Vanpella across Facebook, Instagram, Pinterest, and TikTok.

## Included

- route shell and wireframe pages for the core studio flows
- route map and product UX wireframes
- setup guide for Convex, Vercel, and Cloudflare R2
- local environment template
- R2 CORS helper script
- campaign creation, brief persistence, and R2-backed image generation flow

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

- `docs/backend-foundation.md`
- `docs/campaign-studio-plan.md`
- `docs/image-provider-integration.md`
- `docs/implementation-task-list.md`
- `docs/wireframes-and-route-map.md`
- `docs/platform-setup.md`

## Image Provider Routes

- `GET /api/image-providers`
- `POST /api/images/generate`
- `POST /api/images/edit`

## Campaign Workflow

- `/campaigns/new` creates a campaign and its first brief from live product data
- `/campaigns/[campaignId]` shows the brief, generation jobs, and stored assets
- generation uploads final images to Cloudflare R2 and stores the public URL in Convex

## Environment

Copy the template and fill the missing keys:

```bash
cp .env.example .env.local
```

The local `.env.local` in this repo already includes the Vanpella feed URL and placeholders for the remaining services.

## Verification

```bash
npm run lint
npm test
npm run typecheck
```
