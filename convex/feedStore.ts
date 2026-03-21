import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const startSyncRun = internalMutation({
  args: {
    source: v.string(),
    startedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("syncRuns", {
      source: args.source,
      status: "running",
      startedAt: args.startedAt,
    });
  },
});

export const applySyncResult = internalMutation({
  args: {
    runId: v.id("syncRuns"),
    products: v.array(v.any()),
    warningCount: v.number(),
    feedExportedAt: v.optional(v.string()),
    finishedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existingProducts = await ctx.db.query("products").collect();
    const existingBySku = new Map(existingProducts.map((product) => [product.sku, product]));
    const incomingSkus = new Set<string>();
    let changedCount = 0;

    for (const product of args.products) {
      incomingSkus.add(product.sku);
      const existing = existingBySku.get(product.sku);
      if (!existing) {
        await ctx.db.insert("products", {
          ...product,
          lastSyncedAt: args.finishedAt,
        });
        changedCount += 1;
        continue;
      }

      if (existing.syncHash !== product.syncHash) {
        await ctx.db.patch(existing._id, {
          ...product,
          lastSyncedAt: args.finishedAt,
        });
        changedCount += 1;
      } else {
        await ctx.db.patch(existing._id, {
          lastSyncedAt: args.finishedAt,
        });
      }
    }

    let deletedCount = 0;
    for (const existing of existingProducts) {
      if (!incomingSkus.has(existing.sku)) {
        await ctx.db.delete(existing._id);
        deletedCount += 1;
      }
    }

    await ctx.db.patch(args.runId, {
      status: "completed",
      finishedAt: args.finishedAt,
      productCount: args.products.length,
      changedCount,
      deletedCount,
      warningCount: args.warningCount,
      feedExportedAt: args.feedExportedAt,
    });

    return {
      productCount: args.products.length,
      changedCount,
      deletedCount,
    };
  },
});

export const failSyncRun = internalMutation({
  args: {
    runId: v.id("syncRuns"),
    errorMessage: v.string(),
    finishedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.runId, {
      status: "failed",
      finishedAt: args.finishedAt,
      errorMessage: args.errorMessage,
    });
  },
});

export const getLatestSyncSummary = query({
  args: {},
  handler: async (ctx) => {
    const latest = await ctx.db
      .query("syncRuns")
      .withIndex("by_started_at")
      .order("desc")
      .first();
    const productCount = (await ctx.db.query("products").collect()).length;
    return {
      latest,
      productCount,
    };
  },
});
