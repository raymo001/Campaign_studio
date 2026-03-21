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
    type: v.string(),
    provider: v.string(),
    model: v.string(),
    prompt: v.string(),
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
