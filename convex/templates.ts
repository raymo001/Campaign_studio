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
