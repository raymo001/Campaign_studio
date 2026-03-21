import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";
import { getServerEnv } from "@/lib/env";

export function getConvexServerClient() {
  const env = getServerEnv();
  return new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);
}

export async function listProductsFromConvex(limit = 24) {
  const client = getConvexServerClient();
  return client.query(api.products.list, { limit });
}

export async function getProductSyncSummary() {
  const client = getConvexServerClient();
  return client.query(api.feedStore.getLatestSyncSummary, {});
}

export async function triggerProductSync() {
  const client = getConvexServerClient();
  return client.action(api.feed.syncProducts, {});
}

export async function listCampaignsFromConvex(limit = 20) {
  const client = getConvexServerClient();
  return client.query(api.campaigns.list, { limit });
}
