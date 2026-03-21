export const primaryNavigation = [
  {
    href: "/",
    label: "Overview",
    icon: "grid",
    short: "Home",
    description:
      "Home screen with quick access to campaigns, products, assets, and templates.",
  },
  {
    href: "/campaigns",
    label: "Campaigns",
    icon: "spark",
    short: "Campaign list",
    description:
      "Campaign list with access to campaign detail and creation.",
  },
  {
    href: "/products",
    label: "Products",
    icon: "cube",
    short: "Product catalog",
    description:
      "Synced product catalog for campaign selection.",
  },
  {
    href: "/assets",
    label: "Assets",
    icon: "image",
    short: "Asset library",
    description:
      "Generated media and exports.",
  },
  {
    href: "/templates",
    label: "Templates",
    icon: "stack",
    short: "Templates",
    description:
      "Reusable campaign templates and presets.",
  },
  {
    href: "/brand",
    label: "Brand",
    icon: "droplet",
    short: "Brand rules",
    description:
      "Brand palette and creative rules.",
  },
  {
    href: "/personas",
    label: "Personas",
    icon: "user",
    short: "Personas",
    description:
      "Reusable persona profiles for model-led and try-on generation.",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: "sliders",
    short: "Settings",
    description:
      "Connections and model configuration.",
  },
  {
    href: "/tutorials",
    label: "Tutorials",
    icon: "book",
    short: "Help",
    description:
      "Guides for campaign setup, generation, review, and export.",
  },
] as const;
