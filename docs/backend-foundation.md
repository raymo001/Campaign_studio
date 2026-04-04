# Backend Foundation

Date: April 4, 2026

## What Is Implemented

### Convex tables

- `products`
- `syncRuns`
- `campaigns`
- `briefs`
- `generationJobs`
- `assets`
- `templatePresets`
- `exportPacks`
- `personas`

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
- querying overview metrics
- querying the asset library
- querying template presets
- querying export packs
- querying personas
- creating campaigns with their initial brief
- creating persona records
- reading campaign detail with briefs, jobs, assets, and linked products
- reading sync summary
- triggering manual sync

### Campaign workflow

Files:

- [src/lib/campaigns.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/lib/campaigns.ts)
- [src/lib/prompt-system.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/lib/prompt-system.ts)
- [src/lib/generation-workflow.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/lib/generation-workflow.ts)
- [src/lib/r2.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/lib/r2.ts)
- [src/app/campaigns/actions.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/app/campaigns/actions.ts)
- [convex/campaigns.ts](/Users/biatyraymond/Documents/Campaign_Studio/convex/campaigns.ts)

Behavior:

- `/campaigns/new` now creates a campaign plus its first structured brief
- the brief is generated from synced product data and campaign inputs
- generation now builds an internal prompt spec before rendering a provider-specific prompt
- the prompt system supports product highlight, try-on, and persona-editorial use cases
- personas can now be created and reused during generation
- generation jobs can now store `useCase`, `personaId`, and prompt metadata
- generation can now be narrowed to a selected product SKU for dedicated try-on flows
- persona-editorial generations can automatically update the persona reference image for later try-on use
- uploaded reference images can be added from the computer, uploaded to R2, and analyzed into prompt cues
- the campaign detail screen now exposes job-level prompt influence, including persona linkage, uploaded references, and extracted cue tags
- `/campaigns/[campaignId]` reads the full campaign detail model from Convex
- `/campaigns/[campaignId]/try-on` now provides a dedicated try-on workspace for product, persona, and uploaded face-reference generation
- generation creates a job record, runs the chosen provider, uploads the image to R2, then stores the asset record in Convex
- failed generations are written back to `generationJobs.errorMessage`
- assets now support `reviewStatus` and `exportStatus` workflow state in addition to the underlying generation `status`
- template presets are now stored as real Convex records and seeded into the workspace
- template presets can now be edited in-app, including delivery bundle defaults and filename templates
- export packs are now stored as first-class records with platform, locale, selected assets, delivery bundle settings, and export status
- export pack creation now moves approved assets into queued export state
- export pack status updates propagate back to linked asset export state
- export packs can now produce downloadable zip packages with a delivery manifest and master asset files

### API route

- [src/app/api/feed/sync/route.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/app/api/feed/sync/route.ts)

Methods:

- `GET` returns the latest sync summary and current product count
- `POST` triggers a manual product sync

## UI Integration

Pages now read real Convex data:

- [src/app/page.tsx](/Users/biatyraymond/Documents/Campaign_Studio/src/app/page.tsx)
- [src/app/assets/page.tsx](/Users/biatyraymond/Documents/Campaign_Studio/src/app/assets/page.tsx)
- [src/app/exports/page.tsx](/Users/biatyraymond/Documents/Campaign_Studio/src/app/exports/page.tsx)
- [src/app/exports/[exportPackId]/download/route.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/app/exports/[exportPackId]/download/route.ts)
- [src/app/products/page.tsx](/Users/biatyraymond/Documents/Campaign_Studio/src/app/products/page.tsx)
- [src/app/campaigns/page.tsx](/Users/biatyraymond/Documents/Campaign_Studio/src/app/campaigns/page.tsx)
- [src/app/campaigns/new/page.tsx](/Users/biatyraymond/Documents/Campaign_Studio/src/app/campaigns/new/page.tsx)
- [src/app/campaigns/[campaignId]/page.tsx](/Users/biatyraymond/Documents/Campaign_Studio/src/app/campaigns/[campaignId]/page.tsx)
- [src/app/campaigns/[campaignId]/try-on/page.tsx](/Users/biatyraymond/Documents/Campaign_Studio/src/app/campaigns/[campaignId]/try-on/page.tsx)

Supporting product routes are also in place:

- [src/app/templates/page.tsx](/Users/biatyraymond/Documents/Campaign_Studio/src/app/templates/page.tsx)
- [src/app/brand/page.tsx](/Users/biatyraymond/Documents/Campaign_Studio/src/app/brand/page.tsx)
- [src/app/personas/page.tsx](/Users/biatyraymond/Documents/Campaign_Studio/src/app/personas/page.tsx)
- [src/app/settings/page.tsx](/Users/biatyraymond/Documents/Campaign_Studio/src/app/settings/page.tsx)
- [src/app/tutorials/page.tsx](/Users/biatyraymond/Documents/Campaign_Studio/src/app/tutorials/page.tsx)

The current UI baseline keeps product surfaces short and operational, with instructional content isolated to the tutorials route instead of mixed into the workflow screens.

## Tests

Test coverage currently focuses on:

- feed normalization
- Gemini capability matrix
- Seedream size matrix
- brief generation and prompt construction
- R2 key and public URL construction
- asset review/export workflow transitions
- template preset coverage and export-pack helper behavior
- export bundle filename templating and manifest generation

Files:

- [tests/feed.test.ts](/Users/biatyraymond/Documents/Campaign_Studio/tests/feed.test.ts)
- [tests/image-providers.test.ts](/Users/biatyraymond/Documents/Campaign_Studio/tests/image-providers.test.ts)
- [tests/campaign-workflow.test.ts](/Users/biatyraymond/Documents/Campaign_Studio/tests/campaign-workflow.test.ts)
- [tests/prompt-system.test.ts](/Users/biatyraymond/Documents/Campaign_Studio/tests/prompt-system.test.ts)
- [tests/reference-images.test.ts](/Users/biatyraymond/Documents/Campaign_Studio/tests/reference-images.test.ts)
- [tests/asset-workflow.test.ts](/Users/biatyraymond/Documents/Campaign_Studio/tests/asset-workflow.test.ts)
- [tests/template-presets.test.ts](/Users/biatyraymond/Documents/Campaign_Studio/tests/template-presets.test.ts)

Run with:

```bash
npm test
```
