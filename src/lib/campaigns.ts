import type { NormalizedProduct } from "@/lib/feed";
import {
  buildInternalPromptSpec,
  renderPromptForProvider,
  type PromptUseCase,
} from "@/lib/prompt-system";
import type { ImageProviderId } from "@/lib/image-providers";

type CampaignSeed = {
  name: string;
  objective: string;
  primaryPlatform: string;
  platformMix: string[];
  locale: string;
  audienceAngle?: string;
  productSkus: string[];
};

type CampaignBriefProduct = Pick<
  NormalizedProduct,
  | "sku"
  | "name"
  | "brand"
  | "collection"
  | "currency"
  | "retailPrice"
  | "referenceImages"
  | "productImages"
  | "tryOnImages"
  | "descriptions"
  | "promptContext"
>;

export const campaignObjectiveOptions = [
  "Awareness",
  "Consideration",
  "Sales",
  "Launch",
  "Retargeting",
] as const;

export const platformOptions = [
  "Instagram",
  "Facebook",
  "Pinterest",
  "TikTok",
] as const;

export const localeOptions = ["en-US", "en-GB", "fr-FR", "de-DE"] as const;

export function buildCampaignBrief(
  campaign: CampaignSeed,
  products: CampaignBriefProduct[],
) {
  const leadProduct = products[0];
  const pricing = products
    .map((product) =>
      product.retailPrice && product.currency
        ? `${product.name}: ${product.retailPrice} ${product.currency}`
        : undefined,
    )
    .filter(Boolean);

  const materials = uniqueValues(
    products.map((product) => product.promptContext.frameMaterial),
  );
  const shapes = uniqueValues(
    products.map((product) => product.promptContext.frameShape),
  );
  const tones = uniqueValues(
    products.flatMap((product) => [
      product.promptContext.frameColor,
      product.promptContext.lensColor,
      product.promptContext.color,
    ]),
  );

  return {
    campaignName: campaign.name,
    objective: campaign.objective,
    primaryPlatform: campaign.primaryPlatform,
    platformMix: campaign.platformMix,
    locale: campaign.locale,
    audienceAngle:
      campaign.audienceAngle ||
      "Quiet-luxury customers looking for premium statement eyewear.",
    proposition: leadProduct
      ? `${leadProduct.brand} eyewear with premium materials, refined silhouettes, and editorial product storytelling.`
      : "Vanpella eyewear with premium materials and refined editorial product storytelling.",
    pricing,
    products: products.map((product) => ({
      sku: product.sku,
      name: product.name,
      collection: product.collection,
      price: product.retailPrice,
      currency: product.currency,
      shortDescription: product.descriptions.short,
      longDescription: product.descriptions.long,
      socialCaption: product.descriptions.socialCaption,
      heroImage:
        product.referenceImages[0] ?? product.productImages[0] ?? undefined,
      attributes: {
        frameMaterial: product.promptContext.frameMaterial,
        frameShape: product.promptContext.frameShape,
        frameColor: product.promptContext.frameColor,
        lensColor: product.promptContext.lensColor,
        productTypeCategory: product.promptContext.productTypeCategory,
      },
    })),
    creativeDirection: {
      visualStyle:
        "Minimal, premium, high-contrast ecommerce editorial with clean composition and product-legible framing.",
      compositionRules: [
        "Keep product shape readable and hero-led.",
        "Use close-up detail shots or simple premium environments.",
        "Avoid cluttered overlays and aggressive sales graphics.",
      ],
      lighting: "Soft natural light or controlled studio light with restrained reflections.",
      materials,
      shapes,
      tones,
    },
    copyDirection: {
      hook: buildHook(campaign.objective, leadProduct?.name),
      callToAction: buildCallToAction(campaign.objective),
      bodyCopy:
        leadProduct?.descriptions.long ??
        leadProduct?.descriptions.short ??
        "Premium eyewear designed for clean, confident everyday wear.",
    },
    generationDefaults: {
      variantCount: 1,
      aspectRatio:
        campaign.primaryPlatform === "Pinterest"
          ? "2:3"
          : campaign.primaryPlatform === "TikTok"
            ? "9:16"
            : "4:5",
      imageSize: "2K",
    },
  };
}

export function buildImagePrompt(args: {
  provider: ImageProviderId;
  campaign: CampaignSeed;
  brief: ReturnType<typeof buildCampaignBrief>;
  products: CampaignBriefProduct[];
  persona?: {
    name: string;
    archetype?: string;
    ageBand?: string;
    genderPresentation?: string;
    styleNotes: string[];
    physicalFeatures: string[];
    referenceImageUrl?: string;
  };
  useCase?: PromptUseCase;
  aspectRatio?: string;
  imageSize?: string;
  size?: string;
}) {
  const spec = buildInternalPromptSpec({
    campaign: {
      objective: args.campaign.objective,
      primaryPlatform: args.campaign.primaryPlatform,
      locale: args.campaign.locale,
      audienceAngle: args.brief.audienceAngle,
    },
    brief: args.brief,
    products: args.products,
    persona: args.persona,
    useCase: args.useCase,
    aspectRatio: args.aspectRatio,
    imageSize: args.imageSize,
    size: args.size,
  });

  return renderPromptForProvider(args.provider, spec);
}

function uniqueValues(values: Array<string | undefined>) {
  return [...new Set(values.filter(Boolean))];
}

function buildHook(objective: string, productName?: string) {
  switch (objective.toLowerCase()) {
    case "sales":
      return productName
        ? `Own the look with ${productName}.`
        : "Own the look with Vanpella.";
    case "launch":
      return productName
        ? `${productName} arrives with a cleaner, sharper silhouette.`
        : "A new Vanpella statement arrives.";
    case "retargeting":
      return "Return to the pair that already caught their eye.";
    default:
      return productName
        ? `See ${productName} through a premium editorial lens.`
        : "Discover Vanpella through a premium editorial lens.";
  }
}

function buildCallToAction(objective: string) {
  switch (objective.toLowerCase()) {
    case "awareness":
      return "Discover the collection.";
    case "consideration":
      return "Compare fits and finishes.";
    case "sales":
      return "Shop the frame now.";
    case "launch":
      return "Explore the new drop.";
    case "retargeting":
      return "Return to your shortlist.";
    default:
      return "Explore Vanpella.";
  }
}
