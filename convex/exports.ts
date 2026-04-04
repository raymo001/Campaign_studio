import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listPacks = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const packs = await ctx.db
      .query("exportPacks")
      .order("desc")
      .take(Math.min(args.limit ?? 30, 60));

    return Promise.all(
      packs.map(async (pack) => {
        const campaign = pack.campaignId ? await ctx.db.get(pack.campaignId) : null;
        const templatePreset = pack.templatePresetId
          ? await ctx.db.get(pack.templatePresetId)
          : null;
        const assets = await Promise.all(pack.assetIds.map((id) => ctx.db.get(id)));

        return {
          ...pack,
          campaignName: campaign?.name,
          templatePresetName: templatePreset?.name,
          assetCount: assets.filter(Boolean).length,
          assets: assets.filter((asset) => asset !== null),
        };
      }),
    );
  },
});

export const getPack = query({
  args: {
    exportPackId: v.id("exportPacks"),
  },
  handler: async (ctx, args) => {
    const pack = await ctx.db.get(args.exportPackId);
    if (!pack) {
      return null;
    }

    const campaign = pack.campaignId ? await ctx.db.get(pack.campaignId) : null;
    const templatePreset = pack.templatePresetId
      ? await ctx.db.get(pack.templatePresetId)
      : null;
    const assets = await Promise.all(pack.assetIds.map((id) => ctx.db.get(id)));

    return {
      ...pack,
      campaignName: campaign?.name,
      templatePresetName: templatePreset?.name,
      assetCount: assets.filter(Boolean).length,
      assets: assets.filter((asset) => asset !== null),
    };
  },
});

export const getOverview = query({
  args: {},
  handler: async (ctx) => {
    const [packs, assets] = await Promise.all([
      ctx.db.query("exportPacks").collect(),
      ctx.db
        .query("assets")
        .withIndex("by_review_status", (q) => q.eq("reviewStatus", "approved"))
        .collect(),
    ]);

    const approvedAssets = await Promise.all(
      assets.map(async (asset) => {
        const campaign = asset.campaignId ? await ctx.db.get(asset.campaignId) : null;
        return {
          ...asset,
          campaignName: campaign?.name,
          objective: campaign?.objective,
          locale: campaign?.locale,
        };
      }),
    );

    return {
      packCount: packs.length,
      readyCount: packs.filter((pack) => pack.status === "ready").length,
      exportedCount: packs.filter((pack) => pack.status === "exported").length,
      approvedAssets,
    };
  },
});

export const createPack = mutation({
  args: {
    name: v.string(),
    campaignId: v.optional(v.id("campaigns")),
    templatePresetId: v.optional(v.id("templatePresets")),
    platform: v.string(),
    locale: v.string(),
    objective: v.optional(v.string()),
    assetIds: v.array(v.id("assets")),
    notes: v.optional(v.string()),
    deliveryBundleKey: v.optional(v.string()),
    fileNameTemplate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    for (const assetId of args.assetIds) {
      const asset = await ctx.db.get(assetId);
      if (!asset) {
        throw new Error("Asset not found.");
      }
      if (asset.reviewStatus !== "approved") {
        throw new Error("Only approved assets can be added to an export pack.");
      }
    }

    const packId = await ctx.db.insert("exportPacks", {
      ...args,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });

    await Promise.all(
      args.assetIds.map((assetId) =>
        ctx.db.patch(assetId, {
          exportStatus: "queued",
          updatedAt: now,
        }),
      ),
    );

    return packId;
  },
});

export const updatePackDelivery = mutation({
  args: {
    exportPackId: v.id("exportPacks"),
    templatePresetId: v.optional(v.id("templatePresets")),
    notes: v.optional(v.string()),
    deliveryBundleKey: v.optional(v.string()),
    fileNameTemplate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const pack = await ctx.db.get(args.exportPackId);
    if (!pack) {
      throw new Error("Export pack not found.");
    }

    await ctx.db.patch(args.exportPackId, {
      templatePresetId: args.templatePresetId,
      notes: args.notes,
      deliveryBundleKey: args.deliveryBundleKey,
      fileNameTemplate: args.fileNameTemplate,
      updatedAt: Date.now(),
    });

    return { exportPackId: args.exportPackId };
  },
});

export const updatePackStatus = mutation({
  args: {
    exportPackId: v.id("exportPacks"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const pack = await ctx.db.get(args.exportPackId);
    if (!pack) {
      throw new Error("Export pack not found.");
    }

    const now = Date.now();
    const patch: Record<string, unknown> = {
      status: args.status,
      updatedAt: now,
    };

    if (args.status === "exported") {
      patch.exportedAt = now;
    }

    await ctx.db.patch(args.exportPackId, patch);

    const exportStatus = args.status === "exported" ? "exported" : args.status === "ready" ? "queued" : "not-exported";
    await Promise.all(
      pack.assetIds.map((assetId) => {
        const assetPatch: Record<string, unknown> = {
          exportStatus,
          updatedAt: now,
        };

        if (args.status === "exported") {
          assetPatch.exportedAt = now;
        }

        return ctx.db.patch(assetId, assetPatch);
      }),
    );

    return {
      exportPackId: args.exportPackId,
      status: args.status,
    };
  },
});
