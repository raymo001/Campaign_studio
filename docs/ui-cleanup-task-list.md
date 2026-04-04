# UI Cleanup Task List

Date: April 4, 2026

Goal: Bring every primary screen closer to the visual cleanliness of the reference by removing internal commentary, reducing panel density, simplifying hierarchy, and keeping the interface image-first and action-first.

Status: Initial cleanup pass completed. A second pass tightened responsive behavior, added mobile navigation, and introduced a dedicated try-on workspace.

## Screen Inventory

- [x] `/`
- [x] `/campaigns`
- [x] `/campaigns/new`
- [x] `/campaigns/[campaignId]`
- [x] `/campaigns/[campaignId]/try-on`
- [x] `/products`
- [x] `/assets`
- [x] `/templates`
- [x] `/brand`
- [x] `/settings`
- [x] `/tutorials`

## Review Rules

- Remove planning-language, developer commentary, and route-shell phrasing from the visible UI.
- Keep page headers short and product-facing.
- Reduce the number of equally weighted panels per screen.
- Prefer gallery, list, and action surfaces over explanatory boxes.
- Document what changed and why in `docs/ui-cleanup-audit.md`.
- Remove temporary review artifacts once the audit is captured in docs.

## Current Execution Order

1. `/`
2. `/campaigns`
3. `/campaigns/new`
4. `/campaigns/[campaignId]`
5. `/campaigns/[campaignId]/try-on`
6. `/products`
7. `/assets`
8. `/templates`
9. `/brand`
10. `/settings`
11. `/tutorials`

## Next UI Pass

1. Reduce card framing on overview and list routes.
2. Push more routes toward image-led layouts.
3. Expand the floating composer pattern beyond campaign detail.
4. Replace placeholder surfaces with real data where available.
5. Keep fixed panels and bottom composers fully reachable at narrower widths.
