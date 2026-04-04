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

export async function getOverviewFromConvex() {
  const client = getConvexServerClient();
  return client.query(api.campaigns.getOverview, {});
}

export async function listAssetsFromConvex(limit = 60) {
  const client = getConvexServerClient();
  return client.query(api.campaigns.listAssets, { limit });
}

export async function listTemplatePresetsFromConvex(limit = 24) {
  const client = getConvexServerClient();
  return client.query(api.templates.list, { limit });
}

export async function seedTemplatePresetsInConvex(presets: Array<{
  slug: string;
  name: string;
  objective: string;
  primaryPlatform: string;
  platformMix: string[];
  aspectRatio: string;
  imageSize: string;
  useCase: string;
  status: string;
  visualDirection: string;
  copyDirection: string;
  notes: string[];
}>) {
  const client = getConvexServerClient();
  return client.mutation(api.templates.seedDefaults, { presets });
}

export async function listExportPacksFromConvex(limit = 30) {
  const client = getConvexServerClient();
  return client.query(api.exports.listPacks, { limit });
}

export async function getExportOverviewFromConvex() {
  const client = getConvexServerClient();
  return client.query(api.exports.getOverview, {});
}

export async function listPersonasFromConvex(limit = 24) {
  const client = getConvexServerClient();
  return client.query(api.personas.list, { limit });
}

export async function getPersonaFromConvex(personaId: string) {
  const client = getConvexServerClient();
  return client.query(api.personas.getById, {
    personaId: personaId as never,
  });
}

export async function createPersonaInConvex(args: {
  name: string;
  locale: string;
  ageBand?: string;
  genderPresentation?: string;
  archetype?: string;
  styleNotes: string[];
  physicalFeatures: string[];
  referenceImageUrl?: string;
}) {
  const client = getConvexServerClient();
  return client.mutation(api.personas.create, args);
}

export async function attachPersonaReferenceImageInConvex(args: {
  personaId: string;
  referenceImageUrl: string;
}) {
  const client = getConvexServerClient();
  return client.mutation(api.personas.attachReferenceImage, {
    personaId: args.personaId as never,
    referenceImageUrl: args.referenceImageUrl,
  });
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
  personaId?: string;
  type: string;
  useCase?: string;
  provider: string;
  model: string;
  prompt: string;
  promptSpec?: unknown;
  sourceProductSkus: string[];
}) {
  const client = getConvexServerClient();
  return client.mutation(api.campaigns.createGenerationJob, {
    ...args,
    campaignId: args.campaignId as never,
    briefId: args.briefId as never,
    personaId: args.personaId as never,
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
  personaId?: string;
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
    personaId: args.personaId as never,
  });
}

export async function updateAssetWorkflowStateInConvex(args: {
  assetId: string;
  reviewStatus?: string;
  exportStatus?: string;
}) {
  const client = getConvexServerClient();
  return client.mutation(api.campaigns.updateAssetWorkflowState, {
    assetId: args.assetId as never,
    reviewStatus: args.reviewStatus,
    exportStatus: args.exportStatus,
  });
}

export async function createExportPackInConvex(args: {
  name: string;
  campaignId?: string;
  templatePresetId?: string;
  platform: string;
  locale: string;
  objective?: string;
  assetIds: string[];
  notes?: string;
}) {
  const client = getConvexServerClient();
  return client.mutation(api.exports.createPack, {
    ...args,
    campaignId: args.campaignId as never,
    templatePresetId: args.templatePresetId as never,
    assetIds: args.assetIds as never,
  });
}

export async function updateExportPackStatusInConvex(args: {
  exportPackId: string;
  status: string;
}) {
  const client = getConvexServerClient();
  return client.mutation(api.exports.updatePackStatus, {
    exportPackId: args.exportPackId as never,
    status: args.status,
  });
}
