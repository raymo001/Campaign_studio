import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 24, 100);
    return ctx.db.query("products").order("desc").take(limit);
  },
});

export const listPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return ctx.db.query("products").order("desc").paginate(args.paginationOpts);
  },
});

export const getBySku = query({
  args: {
    sku: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("products")
      .withIndex("by_sku", (q) => q.eq("sku", args.sku))
      .unique();
  },
});
