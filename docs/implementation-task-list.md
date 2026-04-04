# Implementation Task List

Date: April 4, 2026

## Current Slice

- [x] Define Convex tables for products, sync runs, campaigns, briefs, generation jobs, and assets.
- [x] Implement live Vanpella feed normalization and hashing.
- [x] Implement Convex product feed sync action and 30-minute cron.
- [x] Expose sync status and manual trigger via `GET/POST /api/feed/sync`.
- [x] Connect the products and campaigns pages to live Convex data.
- [x] Encode current Gemini and Seedream capability constraints in the provider layer.
- [x] Add unit tests for feed normalization and provider capability matrices.
- [x] Document the new backend foundation.
- [x] Clean the main UI routes and remove internal commentary from visible product copy.
- [x] Add a dedicated `/tutorials` help route and keep guidance out of the main workflow surfaces.
- [x] Add a provider-aware internal prompt system with support for product highlight, try-on, and persona-led generation.
- [x] Add persona records and a first persona management screen for future try-on workflows.
- [x] Allow persona reference images and prompt reference images to be uploaded from the computer.

## Next Build Slice

### Product Intelligence

- [ ] Add embeddings / retrieval records for product copy and merchandising context.
- [ ] Add semantic search query functions in Convex.
- [ ] Add product detail route with localized content and image galleries.

### Campaign Core

- [x] Wire `/campaigns/new` to `campaigns.create`.
- [x] Add structured brief schema and persistence.
- [x] Create platform preset records and selection logic.
- [x] Add prompt use-case selection to generation controls.
- [ ] Add prompt use-case selection to campaign creation.
- [x] Add a dedicated try-on route with product, persona, and reference-image controls.

### Generation Pipeline

- [x] Persist generation jobs from the campaign generation workflow.
- [x] Write generated image metadata to `assets`.
- [x] Upload generated results to R2 and persist public URLs.
- [x] Persist prompt metadata with generation jobs for audit and replay.

### Review System

- [x] Add approval and export states for assets.
- [x] Add campaign detail read model for brief + jobs + assets.
- [x] Add review board UI backed by Convex queries.
- [x] Expose prompt metadata, persona linkage, and uploaded reference cues in campaign job history.
- [x] Add a live asset library with review/export controls.
- [x] Add dedicated export-pack records and workflow.
- [x] Make template presets editable in-app.
- [x] Add export-pack delivery bundle and filename-template editing.
- [x] Add downloadable export package generation with manifest + master assets.

### UI Polish

- [x] Replace placeholder overview metrics with live Convex-backed metrics.
- [x] Replace placeholder asset library cards with live asset data.
- [x] Replace placeholder template previews with live data.
- [ ] Reduce card framing further on overview and index routes.
- [ ] Carry the floating composer pattern into more creation flows.
- [x] Tighten spacing and hierarchy on mobile views.
- [x] Add explicit mobile navigation instead of hiding the shell below `lg`.

### Testing

- [ ] Add integration tests for the feed sync route.
- [ ] Add smoke-test scripts for Gemini, OpenAI, and Seedream image generation.
- [x] Add workflow-level tests for brief generation and R2 asset URL construction.
- [x] Add workflow-state tests for asset approval and export transitions.
- [x] Add tests for delivery bundles, filename templating, and export manifests.
