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

export async function createCampaignWithBriefInConvex(args: {
  name: string;
  objective: string;
  primaryPlatform: string;
  platformMix: string[];
  locale: string;
  audienceAngle?: string;
  productSkus: string[];
  briefJson: unknown;
  briefModel?: string;
}) {
  const client = getConvexServerClient();
  return client.mutation(api.campaigns.createCampaignWithBrief, args);
}

export async function getCampaignDetailFromConvex(campaignId: string) {
  const client = getConvexServerClient();
  return client.query(api.campaigns.getDetail, {
    campaignId: campaignId as never,
  });
}

export async function createGenerationJobInConvex(args: {
  campaignId?: string;
  briefId?: string;
  type: string;
  provider: string;
  model: string;
  prompt: string;
  sourceProductSkus: string[];
}) {
  const client = getConvexServerClient();
  return client.mutation(api.campaigns.createGenerationJob, {
    ...args,
    campaignId: args.campaignId as never,
    briefId: args.briefId as never,
  });
}

export async function markGenerationJobRunningInConvex(jobId: string) {
  const client = getConvexServerClient();
  return client.mutation(api.campaigns.markGenerationJobRunning, {
    jobId: jobId as never,
  });
}

export async function markGenerationJobCompletedInConvex(jobId: string) {
  const client = getConvexServerClient();
  return client.mutation(api.campaigns.markGenerationJobCompleted, {
    jobId: jobId as never,
  });
}

export async function markGenerationJobFailedInConvex(args: {
  jobId: string;
  errorMessage: string;
}) {
  const client = getConvexServerClient();
  return client.mutation(api.campaigns.markGenerationJobFailed, {
    jobId: args.jobId as never,
    errorMessage: args.errorMessage,
  });
}

export async function createAssetInConvex(args: {
  campaignId?: string;
  generationJobId?: string;
  kind: string;
  provider: string;
  model: string;
  status: string;
  sourceProductSkus: string[];
  r2Key?: string;
  publicUrl?: string;
  aspectRatio?: string;
  mimeType?: string;
  width?: number;
  height?: number;
}) {
  const client = getConvexServerClient();
  return client.mutation(api.campaigns.createAsset, {
    ...args,
    campaignId: args.campaignId as never,
    generationJobId: args.generationJobId as never,
  });
}
