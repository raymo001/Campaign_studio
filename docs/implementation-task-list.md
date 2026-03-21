# Implementation Task List

Date: March 21, 2026

## Current Slice

- [x] Define Convex tables for products, sync runs, campaigns, briefs, generation jobs, and assets.
- [x] Implement live Vanpella feed normalization and hashing.
- [x] Implement Convex product feed sync action and 30-minute cron.
- [x] Expose sync status and manual trigger via `GET/POST /api/feed/sync`.
- [x] Connect the products and campaigns pages to live Convex data.
- [x] Encode current Gemini and Seedream capability constraints in the provider layer.
- [x] Add unit tests for feed normalization and provider capability matrices.
- [x] Document the new backend foundation.

## Next Build Slice

### Product Intelligence

- [ ] Add embeddings / retrieval records for product copy and merchandising context.
- [ ] Add semantic search query functions in Convex.
- [ ] Add product detail route with localized content and image galleries.

### Campaign Core

- [ ] Wire `/campaigns/new` to `campaigns.create`.
- [ ] Add structured brief schema and persistence.
- [ ] Create platform preset records and selection logic.

### Generation Pipeline

- [ ] Persist generation jobs from `/api/images/generate`.
- [ ] Write generated image metadata to `assets`.
- [ ] Upload generated results to R2 and persist public URLs.

### Review System

- [ ] Add approval and export states for assets.
- [ ] Add campaign detail read model for brief + jobs + assets.
- [ ] Add review board UI backed by Convex queries.

### Testing

- [ ] Add integration tests for the feed sync route.
- [ ] Add smoke-test scripts for Gemini, OpenAI, and Seedream image generation.
- [ ] Add schema-level tests for campaign and job creation mutations.
