"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buildCampaignBrief } from "@/lib/campaigns";
import {
  createPersonaInConvex,
  createCampaignWithBriefInConvex,
  getCampaignDetailFromConvex,
  listProductsFromConvex,
} from "@/lib/convex-server";
import { runCampaignImageGeneration } from "@/lib/generation-workflow";
import { geminiSupportedImageSizes } from "@/lib/image-providers";
import { promptUseCaseOptions } from "@/lib/prompt-system";

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
  const personaId = String(formData.get("personaId") || "").trim();
  const useCase = String(formData.get("useCase") || "product-highlight").trim();

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

export async function createPersonaAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const locale = String(formData.get("locale") || "en-US").trim();
  const ageBand = String(formData.get("ageBand") || "").trim();
  const genderPresentation = String(formData.get("genderPresentation") || "").trim();
  const archetype = String(formData.get("archetype") || "").trim();
  const referenceImageUrl = String(formData.get("referenceImageUrl") || "").trim();
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

  await createPersonaInConvex({
    name,
    locale,
    ageBand: ageBand || undefined,
    genderPresentation: genderPresentation || undefined,
    archetype: archetype || undefined,
    styleNotes,
    physicalFeatures,
    referenceImageUrl: referenceImageUrl || undefined,
  });

  revalidatePath("/personas");
  redirect("/personas");
}
