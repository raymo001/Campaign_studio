import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("templatePresets")
      .order("desc")
      .take(Math.min(args.limit ?? 24, 60));
  },
});

export const seedDefaults = mutation({
  args: {
    presets: v.array(
      v.object({
        slug: v.string(),
        name: v.string(),
        objective: v.string(),
        primaryPlatform: v.string(),
        platformMix: v.array(v.string()),
        aspectRatio: v.string(),
        imageSize: v.string(),
        useCase: v.string(),
        status: v.string(),
        visualDirection: v.string(),
        copyDirection: v.string(),
        notes: v.array(v.string()),
        deliveryBundleKey: v.optional(v.string()),
        fileNameTemplate: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const results = [];

    for (const preset of args.presets) {
      const existing = await ctx.db
        .query("templatePresets")
        .withIndex("by_slug", (q) => q.eq("slug", preset.slug))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, {
          ...preset,
          updatedAt: now,
        });
        results.push(existing._id);
        continue;
      }

      const id = await ctx.db.insert("templatePresets", {
        ...preset,
        createdAt: now,
        updatedAt: now,
      });
      results.push(id);
    }

    return { count: results.length, ids: results };
  },
});

export const upsert = mutation({
  args: {
    presetId: v.optional(v.id("templatePresets")),
    slug: v.string(),
    name: v.string(),
    objective: v.string(),
    primaryPlatform: v.string(),
    platformMix: v.array(v.string()),
    aspectRatio: v.string(),
    imageSize: v.string(),
    useCase: v.string(),
    status: v.string(),
    visualDirection: v.string(),
    copyDirection: v.string(),
    notes: v.array(v.string()),
    deliveryBundleKey: v.optional(v.string()),
    fileNameTemplate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existingBySlug = await ctx.db
      .query("templatePresets")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existingBySlug && existingBySlug._id !== args.presetId) {
      throw new Error("A template preset with this slug already exists.");
    }

    if (args.presetId) {
      const existing = await ctx.db.get(args.presetId);
      if (!existing) {
        throw new Error("Template preset not found.");
      }

      await ctx.db.patch(args.presetId, {
        ...args,
        updatedAt: now,
      });
      return args.presetId;
    }

    return ctx.db.insert("templatePresets", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const remove = mutation({
  args: {
    presetId: v.id("templatePresets"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.presetId);
    if (!existing) {
      throw new Error("Template preset not found.");
    }

    const linkedPack = await ctx.db
      .query("exportPacks")
      .withIndex("by_template_preset", (q) => q.eq("templatePresetId", args.presetId))
      .first();

    if (linkedPack) {
      throw new Error("Template preset is already used by an export pack.");
    }

    await ctx.db.delete(args.presetId);
    return { presetId: args.presetId };
  },
});
