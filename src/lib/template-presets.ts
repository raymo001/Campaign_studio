export type DeliveryFormatTarget = {
  key: string;
  label: string;
  aspectRatio: string;
  width: number;
  height: number;
  extension: "jpg" | "png" | "webp";
};

export type DeliveryBundle = {
  key: string;
  name: string;
  description: string;
  targets: DeliveryFormatTarget[];
};

export type TemplatePresetRecord = {
  _id: string;
  slug: string;
  name: string;
  objective: string;
  primaryPlatform: string;
  platformMix: string[];
  aspectRatio: string;
  imageSize: string;
  useCase: string;
  status: string;
  visualDirection: string;
  copyDirection: string;
  notes: string[];
  deliveryBundleKey: string;
  fileNameTemplate: string;
};

export const defaultFileNameTemplate =
  "{campaign}_{platform}_{locale}_{variant}_{assetIndex}";

export const deliveryBundles = [
  {
    key: "social-core",
    name: "Social Core",
    description: "Feed, square, and story outputs for paid social handoff.",
    targets: [
      {
        key: "feed-4x5",
        label: "Feed 4:5",
        aspectRatio: "4:5",
        width: 1080,
        height: 1350,
        extension: "jpg",
      },
      {
        key: "square-1x1",
        label: "Square 1:1",
        aspectRatio: "1:1",
        width: 1080,
        height: 1080,
        extension: "jpg",
      },
      {
        key: "story-9x16",
        label: "Story 9:16",
        aspectRatio: "9:16",
        width: 1080,
        height: 1920,
        extension: "jpg",
      },
    ],
  },
  {
    key: "feed-core",
    name: "Feed Core",
    description: "Static feed exports for Instagram and Facebook placements.",
    targets: [
      {
        key: "feed-4x5",
        label: "Feed 4:5",
        aspectRatio: "4:5",
        width: 1080,
        height: 1350,
        extension: "jpg",
      },
      {
        key: "square-1x1",
        label: "Square 1:1",
        aspectRatio: "1:1",
        width: 1080,
        height: 1080,
        extension: "jpg",
      },
    ],
  },
  {
    key: "story-core",
    name: "Story Vertical",
    description: "Vertical short-form outputs for try-on and motion-first channels.",
    targets: [
      {
        key: "story-9x16",
        label: "Story 9:16",
        aspectRatio: "9:16",
        width: 1080,
        height: 1920,
        extension: "jpg",
      },
    ],
  },
  {
    key: "pinterest-core",
    name: "Pinterest Vertical",
    description: "Tall discovery outputs for Pins and tall visual placements.",
    targets: [
      {
        key: "pin-2x3",
        label: "Pin 2:3",
        aspectRatio: "2:3",
        width: 1000,
        height: 1500,
        extension: "jpg",
      },
      {
        key: "story-9x16",
        label: "Story 9:16",
        aspectRatio: "9:16",
        width: 1080,
        height: 1920,
        extension: "jpg",
      },
    ],
  },
] as const satisfies ReadonlyArray<DeliveryBundle>;

export const templatePresetStatusOptions = [
  "active",
  "draft",
  "archived",
] as const;

export const exportPackStatusOptions = [
  "draft",
  "ready",
  "exported",
] as const;

export const defaultTemplatePresets = [
  {
    slug: "instagram-awareness-editorial-still",
    name: "Editorial Still",
    objective: "Awareness",
    primaryPlatform: "Instagram",
    platformMix: ["Instagram", "Pinterest"],
    aspectRatio: "4:5",
    imageSize: "2K",
    useCase: "product-highlight",
    status: "active",
    visualDirection:
      "Premium still-life composition with warm neutrals, restrained reflections, and clean typography space.",
    copyDirection:
      "Discovery-led headline with restrained CTA and minimal overlay text.",
    notes: [
      "Lead with a single hero frame.",
      "Keep the product dominant.",
      "Works for awareness and quiet-luxury launches.",
    ],
    deliveryBundleKey: "social-core",
    fileNameTemplate: defaultFileNameTemplate,
  },
  {
    slug: "facebook-sales-conversion-static",
    name: "Conversion Static",
    objective: "Sales",
    primaryPlatform: "Facebook",
    platformMix: ["Facebook", "Instagram"],
    aspectRatio: "4:5",
    imageSize: "2K",
    useCase: "product-highlight",
    status: "active",
    visualDirection:
      "Product-forward static with a clean premium environment and space for one clear value message.",
    copyDirection: "Single benefit line and direct commerce CTA.",
    notes: [
      "Reserve one clean text lane.",
      "Show frame detail and finish.",
      "Keep layout optimized for paid social feed placement.",
    ],
    deliveryBundleKey: "feed-core",
    fileNameTemplate: defaultFileNameTemplate,
  },
  {
    slug: "pinterest-discovery-product-pin",
    name: "Product Discovery Pin",
    objective: "Consideration",
    primaryPlatform: "Pinterest",
    platformMix: ["Pinterest"],
    aspectRatio: "2:3",
    imageSize: "2K",
    useCase: "product-highlight",
    status: "active",
    visualDirection:
      "Tall product composition with editorial still-life structure and clear material storytelling.",
    copyDirection: "Search-friendly product caption and soft discovery CTA.",
    notes: [
      "Favor vertical crop.",
      "Use texture and material cues.",
      "Keep the pin legible when shrunk in grid views.",
    ],
    deliveryBundleKey: "pinterest-core",
    fileNameTemplate: defaultFileNameTemplate,
  },
  {
    slug: "tiktok-try-on-vertical",
    name: "Try-On Vertical",
    objective: "Consideration",
    primaryPlatform: "TikTok",
    platformMix: ["TikTok", "Instagram"],
    aspectRatio: "9:16",
    imageSize: "2K",
    useCase: "try-on",
    status: "active",
    visualDirection:
      "Portrait-led try-on composition with realistic fit, premium styling, and clean negative space.",
    copyDirection:
      "Fit-first framing with minimal overlay and no aggressive promo treatment.",
    notes: [
      "Prioritize believable fit around brow and temples.",
      "Keep identity stable.",
      "Designed for short-form vertical placements.",
    ],
    deliveryBundleKey: "story-core",
    fileNameTemplate: defaultFileNameTemplate,
  },
  {
    slug: "instagram-persona-editorial",
    name: "Persona Editorial",
    objective: "Launch",
    primaryPlatform: "Instagram",
    platformMix: ["Instagram", "Facebook"],
    aspectRatio: "4:5",
    imageSize: "2K",
    useCase: "persona-editorial",
    status: "active",
    visualDirection:
      "Model-led editorial story with premium wardrobe, elevated lighting, and product-legible framing.",
    copyDirection:
      "Brand-led launch message with minimal text and strong visual storytelling.",
    notes: [
      "Balance persona presence with product clarity.",
      "Use for launches and collection storytelling.",
      "Supports later try-on continuation.",
    ],
    deliveryBundleKey: "social-core",
    fileNameTemplate: defaultFileNameTemplate,
  },
  {
    slug: "retargeting-offer-refresh",
    name: "Offer Refresh",
    objective: "Retargeting",
    primaryPlatform: "Instagram",
    platformMix: ["Instagram", "Facebook"],
    aspectRatio: "4:5",
    imageSize: "2K",
    useCase: "product-highlight",
    status: "active",
    visualDirection:
      "Clean commercial static with one offer lane and refined product close-up.",
    copyDirection: "Short reminder copy with a direct return CTA.",
    notes: [
      "Keep product detail crisp.",
      "Avoid cluttered sales badges.",
      "Use for shortlist and revisit moments.",
    ],
    deliveryBundleKey: "feed-core",
    fileNameTemplate: defaultFileNameTemplate,
  },
] as const;

export function getDeliveryBundle(bundleKey?: string): DeliveryBundle {
  return (
    deliveryBundles.find((bundle) => bundle.key === bundleKey) ??
    deliveryBundles[0]
  );
}

export function inferDeliveryBundleKey(primaryPlatform?: string) {
  switch ((primaryPlatform || "").toLowerCase()) {
    case "facebook":
      return "feed-core";
    case "pinterest":
      return "pinterest-core";
    case "tiktok":
      return "story-core";
    case "instagram":
    default:
      return "social-core";
  }
}

export function normalizeTemplatePresetStatus(value?: string) {
  return templatePresetStatusOptions.includes(
    value as (typeof templatePresetStatusOptions)[number],
  )
    ? (value as (typeof templatePresetStatusOptions)[number])
    : "draft";
}

export function normalizeExportPackStatus(value?: string) {
  return exportPackStatusOptions.includes(value as (typeof exportPackStatusOptions)[number])
    ? (value as (typeof exportPackStatusOptions)[number])
    : "draft";
}

export function normalizeFileNameTemplate(value?: string) {
  const trimmed = value?.trim();
  return trimmed || defaultFileNameTemplate;
}

export function resolveTemplatePresetValues<
  T extends Record<string, unknown> & {
    primaryPlatform?: string;
    deliveryBundleKey?: string;
    fileNameTemplate?: string;
  },
>(preset: T): T & { deliveryBundleKey: string; fileNameTemplate: string } {
  return {
    ...preset,
    deliveryBundleKey:
      preset.deliveryBundleKey || inferDeliveryBundleKey(preset.primaryPlatform),
    fileNameTemplate: normalizeFileNameTemplate(preset.fileNameTemplate),
  };
}

export function normalizeTemplatePresetRecord(
  value: Record<string, unknown>,
): TemplatePresetRecord {
  const resolved = resolveTemplatePresetValues(value);
  return {
    _id: String(value._id ?? ""),
    slug: String(value.slug ?? ""),
    name: String(value.name ?? ""),
    objective: String(value.objective ?? ""),
    primaryPlatform: String(value.primaryPlatform ?? ""),
    platformMix: Array.isArray(value.platformMix)
      ? value.platformMix.map((item) => String(item))
      : [],
    aspectRatio: String(value.aspectRatio ?? ""),
    imageSize: String(value.imageSize ?? ""),
    useCase: String(value.useCase ?? ""),
    status: String(value.status ?? "draft"),
    visualDirection: String(value.visualDirection ?? ""),
    copyDirection: String(value.copyDirection ?? ""),
    notes: Array.isArray(value.notes) ? value.notes.map((item) => String(item)) : [],
    deliveryBundleKey: resolved.deliveryBundleKey,
    fileNameTemplate: resolved.fileNameTemplate,
  };
}

export function buildExportPackName(args: {
  campaignName?: string;
  platform: string;
  locale: string;
}) {
  const stem = args.campaignName?.trim() || "Export Pack";
  return `${stem} / ${args.platform} / ${args.locale}`;
}

export function buildDeliveryFileName(args: {
  template?: string;
  campaignName?: string;
  platform: string;
  locale: string;
  objective?: string;
  presetName?: string;
  variantKey: string;
  assetIndex: number;
  extension: string;
}) {
  const template = normalizeFileNameTemplate(args.template);
  const raw = template.replace(/\{(\w+)\}/g, (_match, token: string) => {
    switch (token) {
      case "campaign":
        return sanitizeFileNamePart(args.campaignName || "export-pack");
      case "platform":
        return sanitizeFileNamePart(args.platform);
      case "locale":
        return sanitizeFileNamePart(args.locale);
      case "objective":
        return sanitizeFileNamePart(args.objective || "delivery");
      case "preset":
        return sanitizeFileNamePart(args.presetName || "custom");
      case "variant":
        return sanitizeFileNamePart(args.variantKey);
      case "assetIndex":
        return String(args.assetIndex).padStart(2, "0");
      default:
        return "";
    }
  });

  const stem = raw
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .trim();

  return `${stem || "asset"}.${
    args.extension.replace(/^\./, "").toLowerCase() || "jpg"
  }`;
}

function sanitizeFileNamePart(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
