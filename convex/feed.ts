"use node";

import { action, internalAction, type ActionCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { normalizeFeedSnapshot, normalizeProducts } from "../src/lib/feed";

type SyncResult = {
  source: string;
  runId: Id<"syncRuns">;
  exportedAt?: string;
  warningCount: number;
  productCount: number;
  changedCount: number;
  deletedCount: number;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function buildFeedUrl() {
  const baseUrl = new URL(getRequiredEnv("VANPELLA_FEED_URL"));
  if (!baseUrl.searchParams.has("ownerId")) {
    baseUrl.searchParams.set("ownerId", getRequiredEnv("VANPELLA_FEED_OWNER_ID"));
  }
  if (!baseUrl.searchParams.has("token")) {
    baseUrl.searchParams.set("token", getRequiredEnv("VANPELLA_FEED_TOKEN"));
  }
  if (!baseUrl.searchParams.has("format")) {
    baseUrl.searchParams.set("format", "json");
  }
  return baseUrl.toString();
}

async function runSync(ctx: ActionCtx): Promise<SyncResult> {
  const source = "vanpella-product-feed";
  const startedAt = Date.now();
  const runId: Id<"syncRuns"> = await ctx.runMutation(
    internal.feedStore.startSyncRun,
    {
      source,
      startedAt,
    },
  );

  try {
    const response = await fetch(buildFeedUrl(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Feed request failed with status ${response.status}`);
    }

    const payload = await response.json();
    const snapshot = normalizeFeedSnapshot(payload);
    const products = normalizeProducts(snapshot.products).filter((product) => product.sku);
    const result = await ctx.runMutation(internal.feedStore.applySyncResult, {
      runId,
      products,
      warningCount: snapshot.warnings.length,
      feedExportedAt: snapshot.exportedAt,
      finishedAt: Date.now(),
    });

    return {
      source,
      runId,
      exportedAt: snapshot.exportedAt,
      warningCount: snapshot.warnings.length,
      ...result,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await ctx.runMutation(internal.feedStore.failSyncRun, {
      runId,
      errorMessage: message,
      finishedAt: Date.now(),
    });
    throw error;
  }
}

export const syncProducts = action({
  args: {},
  handler: async (ctx): Promise<SyncResult> => runSync(ctx),
});

export const internalSyncProducts = internalAction({
  args: {},
  handler: async (ctx): Promise<SyncResult> => runSync(ctx),
});
