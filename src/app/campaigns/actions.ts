"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buildCampaignBrief } from "@/lib/campaigns";
import {
  attachPersonaReferenceImageInConvex,
  createExportPackInConvex,
  createPersonaInConvex,
  createCampaignWithBriefInConvex,
  getCampaignDetailFromConvex,
  seedTemplatePresetsInConvex,
  listProductsFromConvex,
  updateExportPackStatusInConvex,
  updateAssetWorkflowStateInConvex,
} from "@/lib/convex-server";
import { runCampaignImageGeneration } from "@/lib/generation-workflow";
import { geminiSupportedImageSizes } from "@/lib/image-providers";
import { promptUseCaseOptions } from "@/lib/prompt-system";
import { readImageFilesFromFormData } from "@/lib/reference-images";
import { resolveAssetWorkflowState } from "@/lib/asset-workflow";
import { buildExportPackName, defaultTemplatePresets, normalizeExportPackStatus } from "@/lib/template-presets";
import {
  buildPersonaReferenceKey,
  inferFileExtension,
  uploadAssetToR2,
} from "@/lib/r2";

export async function createCampaignAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const objective = String(formData.get("objective") || "").trim();
  const primaryPlatform = String(formData.get("primaryPlatform") || "").trim();
  const locale = String(formData.get("locale") || "en-US").trim();
  const audienceAngle = String(formData.get("audienceAngle") || "").trim();
  const platformMix = formData
    .getAll("platformMix")
    .map((value) => String(value).trim())
    .filter(Boolean);
  const productSkus = formData
    .getAll("productSkus")
    .map((value) => String(value).trim())
    .filter(Boolean);

  if (!name || !objective || !primaryPlatform || productSkus.length === 0) {
    throw new Error("Campaign name, objective, primary platform, and products are required.");
  }

  const products = await listProductsFromConvex(100);
  const selectedProducts = products.filter((product) => productSkus.includes(product.sku));
  if (selectedProducts.length === 0) {
    throw new Error("At least one synced product must be selected.");
  }

  const briefJson = buildCampaignBrief(
    {
      name,
      objective,
      primaryPlatform,
      platformMix: platformMix.length ? platformMix : [primaryPlatform],
      locale,
      audienceAngle: audienceAngle || undefined,
      productSkus,
    },
    selectedProducts,
  );

  const { campaignId } = await createCampaignWithBriefInConvex({
    name,
    objective,
    primaryPlatform,
    platformMix: platformMix.length ? platformMix : [primaryPlatform],
    locale,
    audienceAngle: audienceAngle || undefined,
    productSkus,
    briefJson,
    briefModel: "campaign-brief-v1",
  });

  revalidatePath("/campaigns");
  redirect(`/campaigns/${campaignId}`);
}

export async function generateCampaignImageAction(formData: FormData) {
  const campaignId = String(formData.get("campaignId") || "").trim();
  const provider = String(formData.get("provider") || "").trim();
  const model = String(formData.get("model") || "").trim();
  const aspectRatio = String(formData.get("aspectRatio") || "").trim();
  const imageSize = String(formData.get("imageSize") || "").trim();
  const size = String(formData.get("size") || "").trim();
  const direction = String(formData.get("direction") || "").trim();
  const personaId = String(formData.get("personaId") || "").trim();
  const useCase = String(formData.get("useCase") || "product-highlight").trim();
  const uploadedReferences = await readImageFilesFromFormData(formData, "referenceFiles", 3);

  if (!campaignId || !provider) {
    throw new Error("Campaign and provider are required.");
  }

  const detail = await getCampaignDetailFromConvex(campaignId);
  if (!detail) {
    throw new Error("Campaign not found.");
  }

  await runCampaignImageGeneration({
    campaignId,
    provider: provider as "gemini" | "openai" | "seedream",
    model: model || undefined,
    personaId: personaId || undefined,
    useCase: promptUseCaseOptions.includes(useCase as (typeof promptUseCaseOptions)[number])
      ? (useCase as (typeof promptUseCaseOptions)[number])
      : "product-highlight",
    direction: direction || undefined,
    uploadedReferences,
    aspectRatio: aspectRatio || undefined,
    imageSize: geminiSupportedImageSizes.includes(
      imageSize as (typeof geminiSupportedImageSizes)[number],
    )
      ? (imageSize as (typeof geminiSupportedImageSizes)[number])
      : undefined,
    size: size || undefined,
  });

  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath("/campaigns");
  redirect(`/campaigns/${campaignId}`);
}

export async function runTryOnGenerationAction(formData: FormData) {
  const campaignId = String(formData.get("campaignId") || "").trim();
  const provider = String(formData.get("provider") || "gemini").trim();
  const personaId = String(formData.get("personaId") || "").trim();
  const productSku = String(formData.get("productSku") || "").trim();
  const direction = String(formData.get("direction") || "").trim();
  const aspectRatio = String(formData.get("aspectRatio") || "4:5").trim();
  const imageSize = String(formData.get("imageSize") || "2K").trim();
  const size = String(formData.get("size") || "").trim();
  const uploadedReferences = await readImageFilesFromFormData(formData, "referenceFiles", 3);

  if (!campaignId || !productSku) {
    throw new Error("Campaign and product are required for try-on.");
  }

  await runCampaignImageGeneration({
    campaignId,
    provider: provider as "gemini" | "openai" | "seedream",
    personaId: personaId || undefined,
    productSkus: [productSku],
    useCase: "try-on",
    direction: direction || undefined,
    uploadedReferences,
    aspectRatio: aspectRatio || undefined,
    imageSize: geminiSupportedImageSizes.includes(
      imageSize as (typeof geminiSupportedImageSizes)[number],
    )
      ? (imageSize as (typeof geminiSupportedImageSizes)[number])
      : undefined,
    size: size || undefined,
  });

  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath(`/campaigns/${campaignId}/try-on`);
  revalidatePath("/assets");
  redirect(`/campaigns/${campaignId}/try-on`);
}

export async function updateAssetWorkflowAction(formData: FormData) {
  const assetId = String(formData.get("assetId") || "").trim();
  const redirectTo = String(formData.get("redirectTo") || "/assets").trim();
  const reviewStatus = String(formData.get("reviewStatus") || "").trim();
  const exportStatus = String(formData.get("exportStatus") || "").trim();

  if (!assetId) {
    throw new Error("Asset is required.");
  }

  const nextState = resolveAssetWorkflowState({
    nextReviewStatus: reviewStatus || undefined,
    nextExportStatus: exportStatus || undefined,
  });

  await updateAssetWorkflowStateInConvex({
    assetId,
    reviewStatus: nextState.reviewStatus,
    exportStatus: nextState.exportStatus,
  });

  revalidatePath("/assets");
  revalidatePath(redirectTo);
  redirect(redirectTo);
}

export async function seedTemplatePresetsAction() {
  await seedTemplatePresetsInConvex([...defaultTemplatePresets]);
  revalidatePath("/templates");
  redirect("/templates");
}

export async function createExportPackAction(formData: FormData) {
  const platform = String(formData.get("platform") || "").trim();
  const locale = String(formData.get("locale") || "en-US").trim();
  const objective = String(formData.get("objective") || "").trim();
  const campaignId = String(formData.get("campaignId") || "").trim();
  const templatePresetId = String(formData.get("templatePresetId") || "").trim();
  const campaignName = String(formData.get("campaignName") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const assetIds = formData
    .getAll("assetIds")
    .map((value) => String(value).trim())
    .filter(Boolean);

  if (!platform || assetIds.length === 0) {
    throw new Error("Platform and at least one approved asset are required.");
  }

  await createExportPackInConvex({
    name: buildExportPackName({ campaignName: campaignName || undefined, platform, locale }),
    campaignId: campaignId || undefined,
    templatePresetId: templatePresetId || undefined,
    platform,
    locale,
    objective: objective || undefined,
    assetIds,
    notes: notes || undefined,
  });

  revalidatePath("/exports");
  revalidatePath("/assets");
  redirect("/exports");
}

export async function updateExportPackStatusAction(formData: FormData) {
  const exportPackId = String(formData.get("exportPackId") || "").trim();
  const status = normalizeExportPackStatus(String(formData.get("status") || "").trim());

  if (!exportPackId) {
    throw new Error("Export pack is required.");
  }

  await updateExportPackStatusInConvex({
    exportPackId,
    status,
  });

  revalidatePath("/exports");
  redirect("/exports");
}

export async function createPersonaAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const locale = String(formData.get("locale") || "en-US").trim();
  const ageBand = String(formData.get("ageBand") || "").trim();
  const genderPresentation = String(formData.get("genderPresentation") || "").trim();
  const archetype = String(formData.get("archetype") || "").trim();
  const referenceImageUrl = String(formData.get("referenceImageUrl") || "").trim();
  const referenceFile = await readImageFilesFromFormData(formData, "referenceFile", 1);
  const styleNotes = String(formData.get("styleNotes") || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const physicalFeatures = String(formData.get("physicalFeatures") || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!name) {
    throw new Error("Persona name is required.");
  }

  const personaId = await createPersonaInConvex({
    name,
    locale,
    ageBand: ageBand || undefined,
    genderPresentation: genderPresentation || undefined,
    archetype: archetype || undefined,
    styleNotes,
    physicalFeatures,
    referenceImageUrl: referenceImageUrl || undefined,
  });

  if (referenceFile[0]) {
    const image = referenceFile[0];
    const extension = inferFileExtension(image.mimeType);
    const key = buildPersonaReferenceKey({
      personaId,
      fileName: image.fileName,
      extension,
    });
    const upload = await uploadAssetToR2({
      key,
      body: image.bytes,
      contentType: image.mimeType,
    });
    await attachPersonaReferenceImageInConvex({
      personaId,
      referenceImageUrl: upload.publicUrl,
    });
  }

  revalidatePath("/personas");
  redirect("/personas");
}
