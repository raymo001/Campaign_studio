# Backend Foundation

Date: March 21, 2026

## What Is Implemented

### Convex tables

- `products`
- `syncRuns`
- `campaigns`
- `briefs`
- `generationJobs`
- `assets`

Defined in [convex/schema.ts](/Users/biatyraymond/Documents/Campaign_Studio/convex/schema.ts).

### Feed sync

The Vanpella product feed is normalized and hashed before being written into Convex.

Files:

- [src/lib/feed.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/lib/feed.ts)
- [convex/feed.ts](/Users/biatyraymond/Documents/Campaign_Studio/convex/feed.ts)
- [convex/crons.ts](/Users/biatyraymond/Documents/Campaign_Studio/convex/crons.ts)

Behavior:

- server fetches the live feed with server-only env vars
- products are normalized into a stable application shape
- a `syncHash` is computed per product
- Convex upserts changed products
- products removed from the upstream feed are deleted locally
- each sync run is tracked in `syncRuns`
- a cron schedules feed sync every 30 minutes

### Server access

Files:

- [src/lib/convex-server.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/lib/convex-server.ts)
- [src/lib/env.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/lib/env.ts)

These provide server-side helpers for:

- querying products
- querying campaigns
- creating campaigns with their initial brief
- reading campaign detail with briefs, jobs, assets, and linked products
- reading sync summary
- triggering manual sync

### Campaign workflow

Files:

- [src/lib/campaigns.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/lib/campaigns.ts)
- [src/lib/generation-workflow.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/lib/generation-workflow.ts)
- [src/lib/r2.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/lib/r2.ts)
- [src/app/campaigns/actions.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/app/campaigns/actions.ts)
- [convex/campaigns.ts](/Users/biatyraymond/Documents/Campaign_Studio/convex/campaigns.ts)

Behavior:

- `/campaigns/new` now creates a campaign plus its first structured brief
- the brief is generated from synced product data and campaign inputs
- `/campaigns/[campaignId]` reads the full campaign detail model from Convex
- generation creates a job record, runs the chosen provider, uploads the image to R2, then stores the asset record in Convex
- failed generations are written back to `generationJobs.errorMessage`

### API route

- [src/app/api/feed/sync/route.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/app/api/feed/sync/route.ts)

Methods:

- `GET` returns the latest sync summary and current product count
- `POST` triggers a manual product sync

## UI Integration

Pages now read real Convex data:

- [src/app/products/page.tsx](/Users/biatyraymond/Documents/Campaign_Studio/src/app/products/page.tsx)
- [src/app/campaigns/page.tsx](/Users/biatyraymond/Documents/Campaign_Studio/src/app/campaigns/page.tsx)
- [src/app/campaigns/new/page.tsx](/Users/biatyraymond/Documents/Campaign_Studio/src/app/campaigns/new/page.tsx)
- [src/app/campaigns/[campaignId]/page.tsx](/Users/biatyraymond/Documents/Campaign_Studio/src/app/campaigns/[campaignId]/page.tsx)

## Tests

Test coverage currently focuses on:

- feed normalization
- Gemini capability matrix
- Seedream size matrix
- brief generation and prompt construction
- R2 key and public URL construction

Files:

- [tests/feed.test.ts](/Users/biatyraymond/Documents/Campaign_Studio/tests/feed.test.ts)
- [tests/image-providers.test.ts](/Users/biatyraymond/Documents/Campaign_Studio/tests/image-providers.test.ts)
- [tests/campaign-workflow.test.ts](/Users/biatyraymond/Documents/Campaign_Studio/tests/campaign-workflow.test.ts)

Run with:

```bash
npm test
```
