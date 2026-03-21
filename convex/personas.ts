import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return ctx.db.query("personas").order("desc").take(Math.min(args.limit ?? 24, 50));
  },
});

export const getById = query({
  args: {
    personaId: v.id("personas"),
  },
  handler: async (ctx, args) => {
    return ctx.db.get(args.personaId);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    locale: v.string(),
    ageBand: v.optional(v.string()),
    genderPresentation: v.optional(v.string()),
    archetype: v.optional(v.string()),
    styleNotes: v.array(v.string()),
    physicalFeatures: v.array(v.string()),
    referenceImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const slug = args.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return ctx.db.insert("personas", {
      ...args,
      slug,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const attachReferenceImage = mutation({
  args: {
    personaId: v.id("personas"),
    referenceImageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.personaId, {
      referenceImageUrl: args.referenceImageUrl,
      updatedAt: Date.now(),
    });
  },
});
