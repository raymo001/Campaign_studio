import { platformOptions } from "@/lib/campaigns";

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
    copyDirection:
      "Single benefit line and direct commerce CTA.",
    notes: [
      "Reserve one clean text lane.",
      "Show frame detail and finish.",
      "Keep layout optimized for paid social feed placement.",
    ],
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
    copyDirection:
      "Search-friendly product caption and soft discovery CTA.",
    notes: [
      "Favor vertical crop.",
      "Use texture and material cues.",
      "Keep the pin legible when shrunk in grid views.",
    ],
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
    copyDirection:
      "Short reminder copy with a direct return CTA.",
    notes: [
      "Keep product detail crisp.",
      "Avoid cluttered sales badges.",
      "Use for shortlist and revisit moments.",
    ],
  },
] as const satisfies ReadonlyArray<{
  slug: string;
  name: string;
  objective: (typeof platformOptions)[number] | string;
  primaryPlatform: string;
  platformMix: string[];
  aspectRatio: string;
  imageSize: string;
  useCase: string;
  status: string;
  visualDirection: string;
  copyDirection: string;
  notes: string[];
}>;

export const exportPackStatusOptions = [
  "draft",
  "ready",
  "exported",
] as const;

export function buildExportPackName(args: {
  campaignName?: string;
  platform: string;
  locale: string;
}) {
  const stem = args.campaignName?.trim() || "Export Pack";
  return `${stem} / ${args.platform} / ${args.locale}`;
}

export function normalizeExportPackStatus(value?: string) {
  return exportPackStatusOptions.includes(value as (typeof exportPackStatusOptions)[number])
    ? (value as (typeof exportPackStatusOptions)[number])
    : "draft";
}
