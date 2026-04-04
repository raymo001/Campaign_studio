import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return ctx.db.query("campaigns").order("desc").take(Math.min(args.limit ?? 20, 50));
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    objective: v.string(),
    primaryPlatform: v.string(),
    platformMix: v.array(v.string()),
    locale: v.string(),
    audienceAngle: v.optional(v.string()),
    productSkus: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert("campaigns", {
      ...args,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const createCampaignWithBrief = mutation({
  args: {
    name: v.string(),
    objective: v.string(),
    primaryPlatform: v.string(),
    platformMix: v.array(v.string()),
    locale: v.string(),
    audienceAngle: v.optional(v.string()),
    productSkus: v.array(v.string()),
    briefJson: v.any(),
    briefModel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const campaignId = await ctx.db.insert("campaigns", {
      name: args.name,
      objective: args.objective,
      primaryPlatform: args.primaryPlatform,
      platformMix: args.platformMix,
      locale: args.locale,
      audienceAngle: args.audienceAngle,
      productSkus: args.productSkus,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });

    const briefId = await ctx.db.insert("briefs", {
      campaignId,
      status: "draft",
      model: args.briefModel,
      briefJson: args.briefJson,
      createdAt: now,
      updatedAt: now,
    });

    return { campaignId, briefId };
  },
});

export const getDetail = query({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      return null;
    }

    const briefs = await ctx.db
      .query("briefs")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .order("desc")
      .take(20);

    const generationJobs = await ctx.db
      .query("generationJobs")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .order("desc")
      .take(50);

    const assets = await ctx.db
      .query("assets")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .order("desc")
      .take(100);

    const products = (
      await Promise.all(
        campaign.productSkus.map((sku) =>
          ctx.db
            .query("products")
            .withIndex("by_sku", (q) => q.eq("sku", sku))
            .unique(),
        ),
      )
    ).filter((product) => product !== null);

    const personas = await ctx.db.query("personas").order("desc").take(24);

    return {
      campaign,
      briefs,
      generationJobs,
      assets,
      products,
      personas,
    };
  },
});

export const getOverview = query({
  args: {},
  handler: async (ctx) => {
    const [recentCampaigns, allCampaigns, allProducts, allAssets] = await Promise.all([
      ctx.db.query("campaigns").order("desc").take(12),
      ctx.db.query("campaigns").collect(),
      ctx.db.query("products").collect(),
      ctx.db.query("assets").collect(),
    ]);

    const exportedCount = allAssets.filter((asset) => asset.exportStatus === "exported").length;

    return {
      counts: {
        campaigns: allCampaigns.length,
        products: allProducts.length,
        assets: allAssets.length,
        exports: exportedCount,
      },
      recentCampaigns: recentCampaigns.slice(0, 4),
      recentAssets: allAssets
        .sort((left, right) => right.createdAt - left.createdAt)
        .slice(0, 8),
    };
  },
});

export const listAssets = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const assets = await ctx.db.query("assets").order("desc").take(Math.min(args.limit ?? 60, 120));

    return Promise.all(
      assets.map(async (asset) => {
        const campaign = asset.campaignId ? await ctx.db.get(asset.campaignId) : null;
        const job = asset.generationJobId ? await ctx.db.get(asset.generationJobId) : null;
        const persona = asset.personaId ? await ctx.db.get(asset.personaId) : null;

        return {
          ...asset,
          campaignName: campaign?.name,
          useCase: job?.useCase,
          personaName: persona?.name,
        };
      }),
    );
  },
});

export const createBriefDraft = mutation({
  args: {
    campaignId: v.id("campaigns"),
    briefJson: v.any(),
    model: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert("briefs", {
      campaignId: args.campaignId,
      status: "draft",
      model: args.model,
      briefJson: args.briefJson,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const createGenerationJob = mutation({
  args: {
    campaignId: v.optional(v.id("campaigns")),
    briefId: v.optional(v.id("briefs")),
    personaId: v.optional(v.id("personas")),
    type: v.string(),
    useCase: v.optional(v.string()),
    provider: v.string(),
    model: v.string(),
    prompt: v.string(),
    promptSpec: v.optional(v.any()),
    sourceProductSkus: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert("generationJobs", {
      ...args,
      status: "queued",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const markGenerationJobRunning = mutation({
  args: {
    jobId: v.id("generationJobs"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: "running",
      updatedAt: Date.now(),
    });
  },
});

export const markGenerationJobCompleted = mutation({
  args: {
    jobId: v.id("generationJobs"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: "completed",
      updatedAt: Date.now(),
    });
  },
});

export const markGenerationJobFailed = mutation({
  args: {
    jobId: v.id("generationJobs"),
    errorMessage: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: "failed",
      errorMessage: args.errorMessage,
      updatedAt: Date.now(),
    });
  },
});

export const createAsset = mutation({
  args: {
    campaignId: v.optional(v.id("campaigns")),
    generationJobId: v.optional(v.id("generationJobs")),
    personaId: v.optional(v.id("personas")),
    kind: v.string(),
    provider: v.string(),
    model: v.string(),
    status: v.string(),
    sourceProductSkus: v.array(v.string()),
    r2Key: v.optional(v.string()),
    publicUrl: v.optional(v.string()),
    aspectRatio: v.optional(v.string()),
    mimeType: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert("assets", {
      ...args,
      reviewStatus: "draft",
      exportStatus: "not-exported",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateAssetWorkflowState = mutation({
  args: {
    assetId: v.id("assets"),
    reviewStatus: v.optional(v.string()),
    exportStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const asset = await ctx.db.get(args.assetId);
    if (!asset) {
      throw new Error("Asset not found.");
    }

    const reviewStatus = args.reviewStatus ?? asset.reviewStatus ?? "draft";
    const exportStatus = args.exportStatus ?? asset.exportStatus ?? "not-exported";
    const patch: Record<string, unknown> = {
      reviewStatus,
      exportStatus,
      updatedAt: Date.now(),
    };

    if (exportStatus === "exported") {
      patch.exportedAt = Date.now();
    } else if (exportStatus === "not-exported") {
      patch.exportedAt = undefined;
    }

    await ctx.db.patch(args.assetId, patch);
    return {
      assetId: args.assetId,
      reviewStatus,
      exportStatus,
    };
  },
});
