import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    feedId: v.string(),
    syncHash: v.string(),
    sku: v.string(),
    slug: v.string(),
    name: v.string(),
    brand: v.string(),
    collection: v.optional(v.string()),
    currency: v.optional(v.string()),
    retailPrice: v.optional(v.number()),
    stockQuantity: v.optional(v.number()),
    availabilityStatus: v.optional(v.string()),
    isFeatured: v.boolean(),
    defaultLocale: v.optional(v.string()),
    supportedLocales: v.array(v.string()),
    categories: v.array(v.string()),
    tags: v.array(v.string()),
    referenceImages: v.array(v.string()),
    portraitImages: v.array(v.string()),
    productImages: v.array(v.string()),
    tryOnImages: v.array(v.string()),
    descriptions: v.object({
      short: v.optional(v.string()),
      long: v.optional(v.string()),
      socialCaption: v.optional(v.string()),
      whyVanpella: v.optional(v.string()),
      purchaseNote: v.optional(v.string()),
    }),
    promptContext: v.object({
      productType: v.optional(v.string()),
      productTypeCategory: v.optional(v.string()),
      color: v.optional(v.string()),
      frameColor: v.optional(v.string()),
      frameShape: v.optional(v.string()),
      frameMaterial: v.optional(v.string()),
      lensColor: v.optional(v.string()),
      lensMaterial: v.optional(v.string()),
      polarized: v.optional(v.boolean()),
      uvProtection: v.optional(v.string()),
      gender: v.optional(v.string()),
      ageGroup: v.optional(v.string()),
    }),
    localized: v.record(v.string(), v.any()),
    raw: v.any(),
    lastSyncedAt: v.number(),
  })
    .index("by_sku", ["sku"])
    .index("by_slug", ["slug"])
    .index("by_collection", ["collection"])
    .index("by_sync_hash", ["syncHash"]),

  syncRuns: defineTable({
    source: v.string(),
    status: v.union(
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
    ),
    startedAt: v.number(),
    finishedAt: v.optional(v.number()),
    productCount: v.optional(v.number()),
    changedCount: v.optional(v.number()),
    deletedCount: v.optional(v.number()),
    warningCount: v.optional(v.number()),
    feedExportedAt: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  }).index("by_started_at", ["startedAt"]),

  campaigns: defineTable({
    name: v.string(),
    objective: v.string(),
    status: v.string(),
    primaryPlatform: v.string(),
    platformMix: v.array(v.string()),
    locale: v.string(),
    audienceAngle: v.optional(v.string()),
    productSkus: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_updated_at", ["updatedAt"]),

  briefs: defineTable({
    campaignId: v.id("campaigns"),
    status: v.string(),
    model: v.optional(v.string()),
    briefJson: v.any(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_campaign", ["campaignId"]),

  generationJobs: defineTable({
    campaignId: v.optional(v.id("campaigns")),
    briefId: v.optional(v.id("briefs")),
    personaId: v.optional(v.id("personas")),
    type: v.string(),
    useCase: v.optional(v.string()),
    provider: v.string(),
    model: v.string(),
    status: v.string(),
    prompt: v.string(),
    promptSpec: v.optional(v.any()),
    sourceProductSkus: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    errorMessage: v.optional(v.string()),
  })
    .index("by_campaign", ["campaignId"])
    .index("by_status", ["status"])
    .index("by_updated_at", ["updatedAt"]),

  assets: defineTable({
    campaignId: v.optional(v.id("campaigns")),
    generationJobId: v.optional(v.id("generationJobs")),
    personaId: v.optional(v.id("personas")),
    kind: v.string(),
    provider: v.string(),
    model: v.string(),
    status: v.string(),
    reviewStatus: v.optional(v.string()),
    exportStatus: v.optional(v.string()),
    sourceProductSkus: v.array(v.string()),
    r2Key: v.optional(v.string()),
    publicUrl: v.optional(v.string()),
    aspectRatio: v.optional(v.string()),
    mimeType: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    exportedAt: v.optional(v.number()),
  })
    .index("by_campaign", ["campaignId"])
    .index("by_generation_job", ["generationJobId"])
    .index("by_review_status", ["reviewStatus"])
    .index("by_export_status", ["exportStatus"]),

  personas: defineTable({
    name: v.string(),
    slug: v.string(),
    status: v.string(),
    locale: v.string(),
    ageBand: v.optional(v.string()),
    genderPresentation: v.optional(v.string()),
    archetype: v.optional(v.string()),
    styleNotes: v.array(v.string()),
    physicalFeatures: v.array(v.string()),
    referenceImageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_updated_at", ["updatedAt"]),
});
