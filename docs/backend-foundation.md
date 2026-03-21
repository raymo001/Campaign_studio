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
- reading sync summary
- triggering manual sync

### API route

- [src/app/api/feed/sync/route.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/app/api/feed/sync/route.ts)

Methods:

- `GET` returns the latest sync summary and current product count
- `POST` triggers a manual product sync

## UI Integration

Pages now read real Convex data:

- [src/app/products/page.tsx](/Users/biatyraymond/Documents/Campaign_Studio/src/app/products/page.tsx)
- [src/app/campaigns/page.tsx](/Users/biatyraymond/Documents/Campaign_Studio/src/app/campaigns/page.tsx)

## Tests

Test coverage currently focuses on:

- feed normalization
- Gemini capability matrix
- Seedream size matrix

Files:

- [tests/feed.test.ts](/Users/biatyraymond/Documents/Campaign_Studio/tests/feed.test.ts)
- [tests/image-providers.test.ts](/Users/biatyraymond/Documents/Campaign_Studio/tests/image-providers.test.ts)

Run with:

```bash
npm test
```
