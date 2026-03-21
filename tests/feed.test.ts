import test from "node:test";
import assert from "node:assert/strict";
import {
  hashValue,
  normalizeFeedSnapshot,
  normalizeProduct,
  slugify,
} from "@/lib/feed";

test("slugify normalizes names and sku-like values", () => {
  assert.equal(slugify("The Architect Ink"), "the-architect-ink");
  assert.equal(slugify("VP-SUN-ARC-INK-53"), "vp-sun-arc-ink-53");
});

test("normalizeFeedSnapshot produces a stable feed snapshot", () => {
  const snapshot = normalizeFeedSnapshot({
    products: [{ sku: "A" }, { sku: "B" }],
    defaultLocale: "en-US",
    supportedLocales: ["en-US", "fr-FR"],
    exportedAt: "2026-03-21T00:00:00.000Z",
    count: 2,
    warnings: ["late price update"],
  });

  assert.equal(snapshot.products.length, 2);
  assert.equal(snapshot.defaultLocale, "en-US");
  assert.deepEqual(snapshot.supportedLocales, ["en-US", "fr-FR"]);
  assert.equal(snapshot.warnings[0], "late price update");
});

test("normalizeProduct maps feed fields into prompt-ready product records", () => {
  const product = normalizeProduct({
    _id: "abc123",
    sku: "VP-SUN-ARC-INK-53",
    name: "The Architect Ink",
    brand: "VANPELLA",
    collection: "The Minimalist",
    currency: "EUR",
    retailPrice: 68,
    stockQuantity: 3,
    availabilityStatus: "in-stock",
    isFeatured: true,
    defaultLocale: "en-US",
    supportedLocales: ["en-US", "fr-FR"],
    categories: ["Sunglasses"],
    tags: ["Acetate", "Polarized"],
    referenceImageUrls: ["https://img.example.com/ref-1.png"],
    portraitImageUrls: ["https://img.example.com/portrait-1.jpg"],
    productImages: ["https://img.example.com/product-1.png"],
    tryOnImage: "https://img.example.com/tryon-1.png",
    description: "Long description",
    shortDescription: "Short description",
    socialCaption: "Social caption",
    whyVanpella: "Brand story",
    purchaseNote: "Fit guide",
    productType: "SUN",
    productTypeCategory: "Sunglasses",
    frameColor: "Ink Black",
    frameShape: "square",
    frameMaterial: "Acetate",
    lensColor: "Dark Smoke",
    lensMaterial: "TAC",
    polarized: true,
    uvProtection: "UV400",
    gender: "unisex",
    ageGroup: "adult",
    localized: {
      "fr-FR": {
        shortDescription: "Description courte",
        description: "Description longue",
      },
    },
  });

  assert.equal(product.feedId, "abc123");
  assert.equal(product.slug, "vp-sun-arc-ink-53");
  assert.equal(product.name, "The Architect Ink");
  assert.equal(product.retailPrice, 68);
  assert.equal(product.referenceImages.length, 1);
  assert.equal(product.tryOnImages.length, 1);
  assert.equal(product.descriptions.short, "Short description");
  assert.equal(product.promptContext.frameMaterial, "Acetate");
  assert.equal(product.localized["fr-FR"]?.description, "Description longue");
  assert.ok(product.syncHash.length > 10);
});

test("hashValue is stable for equivalent objects", () => {
  const one = hashValue({ b: 2, a: 1 });
  const two = hashValue({ a: 1, b: 2 });
  assert.equal(one, two);
});
