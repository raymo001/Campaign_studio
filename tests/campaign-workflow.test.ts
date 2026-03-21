import test from "node:test";
import assert from "node:assert/strict";
import {
  buildCampaignBrief,
  buildImagePrompt,
} from "@/lib/campaigns";
import { buildInternalPromptSpec } from "@/lib/prompt-system";
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
    provider: "gemini",
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
    imageSize: "2K",
    aspectRatio: "2:3",
  });

  assert.match(prompt, /Vanpella/i);
  assert.match(prompt, /Pinterest/);
  assert.match(prompt, /The Architect Ink/);
  assert.match(prompt, /Constraints:/);
  assert.match(prompt, /Aspect ratio: 2:3/);
});

test("internal prompt spec supports try-on and preserves fit constraints", () => {
  const brief = buildCampaignBrief(
    {
      name: "Try-on fit test",
      objective: "Consideration",
      primaryPlatform: "Instagram",
      platformMix: ["Instagram"],
      locale: "en-US",
      productSkus: [sampleProduct.sku],
    },
    [sampleProduct],
  );

  const spec = buildInternalPromptSpec({
    campaign: {
      objective: "Consideration",
      primaryPlatform: "Instagram",
      locale: "en-US",
    },
    brief,
    products: [sampleProduct],
    useCase: "try-on",
    aspectRatio: "4:5",
  });

  assert.equal(spec.useCase, "try-on");
  assert.match(spec.subject, /model wearing/i);
  assert.ok(
    spec.constraints.some((constraint) => /physically plausible/i.test(constraint)),
  );
  assert.ok(
    spec.negativeAvoidance.some((value) => /identity drift/i.test(value)),
  );
});

test("openai prompt renderer uses labeled sections for controlled generation", () => {
  const brief = buildCampaignBrief(
    {
      name: "Persona launch",
      objective: "Launch",
      primaryPlatform: "Instagram",
      platformMix: ["Instagram"],
      locale: "en-US",
      productSkus: [sampleProduct.sku],
    },
    [sampleProduct],
  );

  const prompt = buildImagePrompt({
    provider: "openai",
    campaign: {
      name: "Persona launch",
      objective: "Launch",
      primaryPlatform: "Instagram",
      platformMix: ["Instagram"],
      locale: "en-US",
      productSkus: [sampleProduct.sku],
    },
    brief,
    products: [sampleProduct],
    useCase: "persona-editorial",
    aspectRatio: "4:5",
  });

  assert.match(prompt, /^Task:/);
  assert.match(prompt, /Scene:/);
  assert.match(prompt, /Constraints:/);
  assert.match(prompt, /Do not:/);
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
