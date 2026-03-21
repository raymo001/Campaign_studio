# Vanpella Campaign Studio Plan

Date: March 21, 2026

## Objective

Build a clean, fast campaign studio for Vanpella that lets a small ecommerce team generate image and video creatives for awareness, consideration, and sales campaigns across Facebook, Instagram, Pinterest, and TikTok.

The system should stay simple for operators:

- pick campaign goal
- pick platform
- pick one or more products
- let AI build the creative brief from the live product feed
- generate variants
- review, edit, resize, and export

## What The Current Inputs Already Give Us

The live Vanpella feed is strong enough to support grounded generation. The feed currently includes:

- 46 products
- pricing and currency
- long and short descriptions
- collections, tags, categories, fit notes, materials, and dimensions
- multiple product and portrait/reference images
- social captions
- brand story fields like `whyVanpella`
- localized content for multiple locales

This means prompts do not need to rely on manual product entry. The app should treat the feed as the source of truth for product context.

## Brand Direction

From the logo asset in this workspace:

- primary green: `#16473d`
- accent orange: `#fe6816`

The reference UI points toward a clean dark workspace. For Vanpella, keep that cleanliness but make it feel more premium and editorial:

- charcoal base instead of pure black
- restrained use of Vanpella green for navigation and focus states
- orange only for primary calls to action and status highlights
- large image cards
- minimal borders
- one dominant composition area instead of many competing panels

## Product Principles

1. Product-grounded, not prompt-only
   Every generation should be anchored to actual Vanpella products, imagery, price, materials, and brand narrative from the live feed.

2. Campaign-first, not tool-first
   Users should start from business intent like awareness, launch, retargeting, or sale, not from raw model settings.

3. Platform-aware by default
   Each flow should know the destination platform and generate the right aspect ratios, hooks, overlays, and CTA style.

4. Variants over one-offs
   The system should generate controlled creative sets, not single assets.

5. Human approval before publish
   AI should accelerate ideation and production, but the app should preserve approvals, lineage, and rollback.

## Best Features To Build First

### 1. Feed-synced product intelligence

Core capability:

- scheduled ingest of the live product feed into Convex
- normalized product records
- searchable attributes and image references
- embeddings for semantic retrieval across descriptions, tags, fit notes, and brand story

Why it matters:
This is the foundation that makes every campaign context-aware instead of generic.

### 2. AI campaign brief builder

Users choose:

- objective: awareness, traffic, retargeting, conversion, sale, new launch
- platform: Facebook, Instagram, Pinterest, TikTok
- product or collection
- locale
- audience angle

The assistant returns a structured brief:

- campaign angle
- message hierarchy
- visual direction
- copy hooks
- CTA options
- platform-specific recommendations
- required asset list

This should be schema-constrained, not plain text only.

### 3. Platform preset system

Each platform preset should define:

- aspect ratios
- safe zones for copy
- recommended creative style
- caption length ranges
- CTA defaults
- static vs motion preference

Example preset groups:

- Facebook feed
- Facebook story
- Instagram reel cover
- Instagram story
- Pinterest pin
- TikTok vertical video

### 4. Product-grounded image generation

Users should be able to generate:

- product hero images
- lifestyle scenes
- editorial campaign visuals
- sale/promo variations
- collection moodboards

Important controls:

- reference image lock strength
- background style
- model/persona selection
- composition type
- lighting style
- copy overlay toggle
- negative prompt/guardrail settings

### 5. Storyboard-to-video workflow

For video, do not start with freeform video prompting. Start with a structured storyboard:

- shot list
- motion description
- product appearance rules
- on-screen text
- end card
- duration target

Generate:

- 6s teaser
- 10-15s paid social clip
- 15-30s product story sequence

### 6. Variant grid and auto-resize

One click should create a pack:

- 1 concept
- 4-8 visual variants
- 4 platform crops
- copy variants
- optional localized caption variants

This is one of the biggest force multipliers for paid social teams.

### 7. Creative review and approval board

Every asset should keep:

- source campaign
- source products
- prompt/brief lineage
- model/version
- editor notes
- approval status
- exported formats

### 8. Brand guardrails

The app should enforce:

- approved logo use
- disallowed claims
- tone constraints
- safe promotional wording
- optional “luxury/minimal/editorial” brand style rules

### 9. Performance memory

After launch, store which angles and asset types perform best by:

- platform
- campaign objective
- product collection
- locale
- visual style

Then use that signal when generating the next brief. This is how the studio becomes compounding instead of just generative.

### 10. Export packages

Exports should include:

- final media files
- captions
- headlines
- CTA text
- campaign notes
- product links
- asset manifest JSON

## Recommended Tech Stack

## Frontend

- Next.js 16.x with App Router
- React 19
- TypeScript
- Tailwind CSS plus a small design token layer
- Vercel AI SDK for structured outputs, tool calling, and streaming UI

Recommendation:
Use stable Next.js 16 in production, not an older 15.x line. As of March 21, 2026, the current stable major line is Next.js 16, which introduced cache components, Turbopack as default, React 19.2 integration, and improved AI-oriented development tooling. Keep the project on the latest patched 16.x release because Vercel published security advisories affecting older 15.x and 16.x versions in December 2025.

## Backend

- Convex for application state, realtime queries, job state, collaboration, and scheduling
- Convex cron jobs for feed sync and maintenance
- Convex actions for long-running orchestration and vector search

Why Convex fits this:

- realtime job updates for generation status
- durable scheduling for feed syncs and retry flows
- built-in vector search for product retrieval
- simple full-stack TypeScript development

## Storage

- Cloudflare R2 for original and generated media
- Cloudflare custom domain for public delivery and cache acceleration
- presigned PUT/GET URLs for direct browser upload when needed

Important implementation detail:
R2 presigned URLs work on the S3 API endpoint, not on custom domains. Use presigned URLs for upload/download authorization, and use a public custom domain for production delivery/caching.

## Deployment

- Vercel for web deployment
- Vercel Functions for API routes and streaming responses
- Fluid Compute enabled for long AI and media workloads

## AI / Generation Layer

Recommended model roles, current as of March 21, 2026:

- reasoning + orchestration: `gpt-5.4`
- lower-cost classification / metadata jobs: `gpt-5-mini`
- image generation and editing: `gpt-image-1.5`
- video generation: `sora-2`

Implementation note:
Wrap model access behind a provider layer so the app can evolve without rewriting product logic.

## Suggested System Architecture

```text
Next.js App
  -> Vercel AI SDK orchestration layer
  -> Convex (campaigns, prompts, jobs, approvals, product index)
  -> Cloudflare R2 (all media assets and exports)
  -> Generation providers (image/video/copy)
  -> Vanpella live product feed (server-side sync only)
```

## Key Flows

### Flow 1: Feed sync

1. Convex cron runs every 15-30 minutes.
2. Server fetches the Vanpella feed using a secret stored only in server env.
3. Normalize product records.
4. Detect changed products by hash.
5. Refresh embeddings only for changed products.
6. Persist image references and product metadata in Convex.

### Flow 2: Campaign creation

1. User creates a campaign.
2. User selects objective, platform, product set, and locale.
3. App retrieves product context plus prior brand rules.
4. Model generates a structured brief.
5. User accepts or edits the brief.

### Flow 3: Asset generation

1. User chooses image or video.
2. App builds prompt packets from:
   - brief
   - product metadata
   - reference images
   - brand constraints
   - platform preset
3. Generation job runs.
4. Results land in R2.
5. Convex stores metadata, lineage, and review state.

### Flow 4: Review and export

1. User reviews assets in a board/grid.
2. User marks winners, requests edits, or resizes.
3. App exports approved bundles per platform.

## Convex Data Model

Suggested tables:

- `products`
- `productEmbeddings`
- `campaigns`
- `campaignProducts`
- `briefs`
- `platformPresets`
- `generationJobs`
- `assets`
- `assetVariants`
- `assetExports`
- `brandRules`
- `templates`
- `reviewComments`
- `approvals`
- `activityLog`

Important fields:

- `products`: feed hash, locale payloads, reference image urls, price, stock, merchandising metadata
- `campaigns`: objective, platform mix, locale, target angle, status
- `briefs`: structured brief JSON, model version, editable overrides
- `generationJobs`: type, provider, model, status, retries, duration
- `assets`: R2 key, preview URL, product links, origin brief, prompt packet hash

## Retrieval Strategy

Use two layers:

1. deterministic filters first
   Filter by category, collection, locale, price range, tags, stock, featured state

2. semantic retrieval second
   Use embeddings over:
   - `name`
   - `shortDescription`
   - `description`
   - `socialCaption`
   - `whyVanpella`
   - `tags`
   - `purchaseNote`

This is better than pure vector search because campaign generation often needs exact product control first.

## UX Structure

Keep the app visually simple with five primary areas:

- Campaigns
- Create
- Assets
- Templates
- Brand

Suggested primary screen:

- left rail for navigation
- top bar for workspace context and global actions
- center canvas for campaign content and asset boards
- right drawer for product context, brand rules, and generation settings
- bottom composer for natural-language edits and regenerate actions

Avoid:

- too many settings visible at once
- model terminology in primary UI
- separate apps for image and video in v1

## V1 Scope

Ship this first:

- authentication
- feed sync
- product browser
- campaign brief builder
- image generation
- basic video storyboard flow
- platform presets
- asset library
- approval states
- export bundles

Do not put these in V1:

- direct ad platform publishing
- complex team permissions matrix
- advanced analytics attribution
- fully custom drag-and-drop editor
- full DAM-style taxonomy system

## V2 Additions

- direct publishing to ad/social channels
- performance-informed brief recommendations
- A/B experiment tracking
- advanced collaboration and comments
- shot-level video editing
- bulk generation by collection or sale event
- automated landing page and email asset variants

## Security And Reliability Notes

- Never expose the Vanpella feed token to the client.
- Fetch and normalize the product feed server-side only.
- Store provider API keys in Vercel env vars.
- Keep R2 write access server-generated via presigned URLs.
- Use signed or controlled asset access for non-public media.
- Keep generation jobs idempotent using prompt packet hashes.
- Add moderation and brand-rule validation before approval.

## Recommended Build Sequence

### Phase 1: Foundation

- bootstrap Next.js app
- set up Convex schema and auth
- set up R2 bucket and custom delivery domain
- implement feed ingest job
- build product explorer

### Phase 2: Campaign core

- campaign model and UI
- structured brief generation
- preset system by platform and objective
- image generation pipeline

### Phase 3: Review system

- asset lineage
- approval states
- notes and regenerate loop
- export bundles

### Phase 4: Video and memory

- storyboard flow
- video generation
- performance memory
- smart recommendations

## Opinionated Decisions

- Use Convex as the operational backend, not as primary media storage.
- Use R2 as the media system of record.
- Use server-driven presets to keep the UI simple.
- Default every generation to a product-backed workflow.
- Prefer structured brief generation over freeform chat-first prompting.
- Treat TikTok and Reels as storyboard products, not just resized images.

## Sources Used For Current-Tech Recommendations

- Next.js blog: https://nextjs.org/blog
- Convex scheduling: https://docs.convex.dev/scheduling
- Convex cron jobs: https://docs.convex.dev/scheduling/cron-jobs
- Convex vector search: https://docs.convex.dev/search/vector-search
- Vercel AI SDK docs: https://vercel.com/docs/ai-sdk
- Vercel streaming functions: https://vercel.com/docs/functions/streaming-functions
- Vercel Fluid Compute: https://vercel.com/docs/fluid-compute/
- Cloudflare R2 public buckets: https://developers.cloudflare.com/r2/data-access/public-buckets/
- Cloudflare R2 presigned URLs: https://developers.cloudflare.com/r2/api/s3/presigned-urls/
- OpenAI models overview: https://developers.openai.com/api/docs/models
- GPT Image 1.5: https://developers.openai.com/api/docs/models/gpt-image-1.5
- Sora 2: https://developers.openai.com/api/docs/models/sora-2
