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
    return ctx.db.insert("assets", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
