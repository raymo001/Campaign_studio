import test from "node:test";
import assert from "node:assert/strict";
import {
  buildCampaignBrief,
  buildImagePrompt,
} from "@/lib/campaigns";
import {
  buildGeneratedAssetKey,
  buildR2PublicUrl,
  inferFileExtension,
} from "@/lib/r2";
import type { NormalizedProduct } from "@/lib/feed";

const sampleProduct: NormalizedProduct = {
  feedId: "feed-1",
  syncHash: "hash-1",
  sku: "VP-SUN-ARC-INK-53",
  slug: "vp-sun-arc-ink-53",
  name: "The Architect Ink",
  brand: "VANPELLA",
  collection: "The Minimalist",
  currency: "EUR",
  retailPrice: 68,
  stockQuantity: 12,
  availabilityStatus: "in-stock",
  isFeatured: true,
  defaultLocale: "en-US",
  supportedLocales: ["en-US"],
  categories: ["Sunglasses"],
  tags: ["Acetate"],
  referenceImages: ["https://example.com/reference.png"],
  portraitImages: [],
  productImages: ["https://example.com/product.png"],
  tryOnImages: [],
  descriptions: {
    short: "Sharp acetate lines.",
    long: "Premium acetate eyewear with a refined, square silhouette.",
    socialCaption: "Clean lines, confident fit.",
    whyVanpella: "Made for quiet luxury wardrobes.",
    purchaseNote: "Ships in 48 hours.",
  },
  promptContext: {
    productType: "SUN",
    productTypeCategory: "Sunglasses",
    color: "Ink Black",
    frameColor: "Ink Black",
    frameShape: "Square",
    frameMaterial: "Acetate",
    lensColor: "Smoke",
    lensMaterial: "TAC",
    polarized: true,
    uvProtection: "UV400",
    gender: "unisex",
    ageGroup: "adult",
  },
  localized: {},
  raw: {},
};

test("buildCampaignBrief derives proposition and defaults from campaign context", () => {
  const brief = buildCampaignBrief(
    {
      name: "Spring awareness push",
      objective: "Awareness",
      primaryPlatform: "Instagram",
      platformMix: ["Instagram", "Pinterest"],
      locale: "en-US",
      audienceAngle: "Premium eyewear shoppers.",
      productSkus: [sampleProduct.sku],
    },
    [sampleProduct],
  );

  assert.equal(brief.campaignName, "Spring awareness push");
  assert.equal(brief.copyDirection.callToAction, "Discover the collection.");
  assert.equal(brief.generationDefaults.aspectRatio, "4:5");
  assert.equal(brief.products[0]?.heroImage, "https://example.com/reference.png");
});

test("buildImagePrompt includes platform, product, and quality guardrails", () => {
  const brief = buildCampaignBrief(
    {
      name: "Launch drop",
      objective: "Launch",
      primaryPlatform: "Pinterest",
      platformMix: ["Pinterest"],
      locale: "en-US",
      productSkus: [sampleProduct.sku],
    },
    [sampleProduct],
  );

  const prompt = buildImagePrompt({
    campaign: {
      name: "Launch drop",
      objective: "Launch",
      primaryPlatform: "Pinterest",
      platformMix: ["Pinterest"],
      locale: "en-US",
      productSkus: [sampleProduct.sku],
    },
    brief,
    products: [sampleProduct],
    aspectRatio: "2:3",
  });

  assert.match(prompt, /Vanpella/i);
  assert.match(prompt, /Pinterest/);
  assert.match(prompt, /The Architect Ink/);
  assert.match(prompt, /Avoid distorted eyewear geometry/);
  assert.match(prompt, /Aspect ratio target: 2:3/);
});

test("R2 helpers build stable keys, URLs, and file extensions", () => {
  const key = buildGeneratedAssetKey({
    campaignId: "abc123",
    generationJobId: "job456",
    extension: "png",
  });

  assert.match(key, /^campaigns\/abc123\/generated\/\d{4}-\d{2}-\d{2}\/job456\.png$/);
  assert.equal(
    buildR2PublicUrl("https://assets.studio.vanpella.com/", key),
    `https://assets.studio.vanpella.com/${key}`,
  );
  assert.equal(inferFileExtension("image/png"), "png");
  assert.equal(inferFileExtension("image/jpeg"), "jpg");
});
