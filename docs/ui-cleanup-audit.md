# UI Cleanup Audit

Date: March 21, 2026

Reference goal: approach the visual cleanliness of the provided reference by reducing internal commentary, flattening hierarchy, and making each screen feel more like a focused tool than a documentation surface.

## Audit Scope

This pass covered the main product routes and removed internal design-review language from visible UI copy. Temporary screenshots were used during review and then removed from the repository after the audit was recorded.

## Route Review

### `/`

Issues found:

- Homepage still carried explanatory copy and secondary utility cards that read like onboarding.
- Visual hierarchy was cleaner than before, but still too descriptive for a landing surface.

Changes made:

- Kept only headline, quick actions, metrics, recent campaigns, and quick access.
- Removed planning-language and commentary-heavy sections.
- Moved workflow guidance to a dedicated tutorials route.

### `/campaigns`

Issues found:

- Previous version still used route-shell language and placeholder filter explanations.
- The layout read like an internal wireframe instead of a production campaign index.

Changes made:

- Rebuilt as a direct campaign list with compact chips and one clear primary action.
- Removed sidebar commentary and instructional panel text.

### `/campaigns/new`

Issues found:

- The page explained what creation does instead of behaving like a clean creation form.
- Too much right-rail explanatory content competed with the form itself.

Changes made:

- Reduced the screen to campaign essentials plus product selection.
- Removed “what this creates” and other helper commentary from the visible UI.

### `/campaigns/[campaignId]`

Issues found:

- The detail page still carried too many equal-weight sections and explanatory scaffolding.
- The interface needed to behave more like an image workspace and less like a dashboard.

Changes made:

- Reduced the page to title, product chips, gallery, brief direction, and a floating composer.
- Kept the gallery as the primary visual surface and compressed metadata into quieter support blocks.

### `/products`

Issues found:

- The page still described backend sync behavior directly in the UI.
- The indexed-fields panel was useful internally but not visually clean.

Changes made:

- Simplified into a clean catalog browser with sync summary and product cards.
- Removed implementation-language about API routes and embeddings from the visible screen.

### `/assets`

Issues found:

- The page was split between placeholder gallery and commentary about export payloads.
- The layout did not feel visual-first enough.

Changes made:

- Converted the page to a simple gallery-first surface with light filter chips.
- Removed the explanatory export-pack sidebar from the main UI.

### `/templates`

Issues found:

- Too much text around each preset card.
- The page felt more descriptive than useful.

Changes made:

- Reduced the screen to a clean preset grid with minimal labels and preview surfaces.

### `/brand`

Issues found:

- The original version read like internal notes on future structured records.
- Too much explanatory text reduced clarity.

Changes made:

- Simplified into two clean sections: palette and guardrails.
- Turned the palette into swatches and the rules into short policy tiles.

### `/settings`

Issues found:

- The screen was overloaded with implementation details, CLI references, and env-key commentary.
- It felt like setup notes rather than a clean settings interface.

Changes made:

- Reduced it to connection status cards and provider readiness cards.
- Removed visible setup instructions and low-level environment prose.

### `/tutorials`

Issues found:

- This screen already had the right role, but the intro still over-explained why it existed.

Changes made:

- Tightened the introduction and kept it as the single place for workflow guidance.
- Removed internal phrasing so the page reads like product help instead of a design note.

## Result

The application now separates two concerns more clearly:

- product UI surfaces remain shorter and quieter
- instructional material lives on `/tutorials` instead of leaking into the main workflow
- visible copy now stays product-facing and avoids internal commentary

Residual gap versus the reference:

- several screens still use more explicit card framing than the reference
- the homepage and list pages can still be reduced further
- the overall system would get closer with a stronger image-led overview and a more dominant floating composer pattern across additional routes
