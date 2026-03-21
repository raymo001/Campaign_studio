export const primaryNavigation = [
  {
    href: "/",
    label: "Overview",
    short: "Studio home and orchestration view",
    description:
      "Landing dashboard with current studio state, campaign flow, and quick access to the main modules.",
  },
  {
    href: "/campaigns",
    label: "Campaigns",
    short: "Goals, briefs, assets, approvals",
    description:
      "Campaign list, active states, and links to campaign detail and creation flows.",
  },
  {
    href: "/products",
    label: "Products",
    short: "Feed sync and retrieval context",
    description:
      "Live product browser for the Vanpella feed, localized copy, and generation references.",
  },
  {
    href: "/assets",
    label: "Assets",
    short: "Generated media and exports",
    description:
      "Asset library with variants, resize packs, approval status, and export bundles.",
  },
  {
    href: "/templates",
    label: "Templates",
    short: "Platform and objective presets",
    description:
      "Reusable prompt packets, campaign structures, and platform-aware preset bundles.",
  },
  {
    href: "/brand",
    label: "Brand",
    short: "Rules, colors, and guardrails",
    description:
      "Brand tokens, legal constraints, tone controls, and creative safety rules.",
  },
  {
    href: "/settings",
    label: "Settings",
    short: "Integrations and environment state",
    description:
      "Connections for Convex, Vercel, Cloudflare R2, and model-provider configuration.",
  },
] as const;
