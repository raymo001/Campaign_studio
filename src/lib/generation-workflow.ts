import {
  buildCampaignBrief,
  buildImagePrompt,
} from "@/lib/campaigns";
import {
  attachPersonaReferenceImageInConvex,
  createAssetInConvex,
  createGenerationJobInConvex,
  getPersonaFromConvex,
  getCampaignDetailFromConvex,
  markGenerationJobCompletedInConvex,
  markGenerationJobFailedInConvex,
  markGenerationJobRunningInConvex,
} from "@/lib/convex-server";
import { generateImage, type GenerateImageInput } from "@/lib/image-providers";
import {
  buildGeneratedAssetKey,
  buildCampaignReferenceKey,
  inferFileExtension,
  uploadAssetToR2,
} from "@/lib/r2";
import type { PromptUseCase } from "@/lib/prompt-system";
import {
  analyzeReferenceImages,
  buildReferenceCueStrings,
  type UploadedReferenceImage,
} from "@/lib/reference-images";

type GenerationRequest = Pick<
  GenerateImageInput,
  "provider" | "model" | "size" | "aspectRatio" | "imageSize" | "quality" | "background"
> & {
  campaignId: string;
  personaId?: string;
  useCase?: PromptUseCase;
  direction?: string;
  uploadedReferences?: UploadedReferenceImage[];
};

export async function runCampaignImageGeneration(input: GenerationRequest) {
  const detail = await getCampaignDetailFromConvex(input.campaignId);
  if (!detail) {
    throw new Error("Campaign not found.");
  }

  const campaign = detail.campaign;
  const products = detail.products;
  const persona = input.personaId ? await getPersonaFromConvex(input.personaId) : null;
  if (products.length === 0) {
    throw new Error("Campaign has no synced products attached.");
  }

  const latestBrief =
    detail.briefs[0]?.briefJson ??
    buildCampaignBrief(
      {
        name: campaign.name,
        objective: campaign.objective,
        primaryPlatform: campaign.primaryPlatform,
        platformMix: campaign.platformMix,
        locale: campaign.locale,
        audienceAngle: campaign.audienceAngle,
        productSkus: campaign.productSkus,
      },
      products,
    );

  const referenceAnalysis = await analyzeReferenceImages(input.uploadedReferences ?? []);
  const uploadedReferenceRecords = await Promise.all(
    (input.uploadedReferences ?? []).map(async (image) => {
      const extension = inferFileExtension(image.mimeType);
      const key = buildCampaignReferenceKey({
        campaignId: campaign._id,
        fileName: image.fileName,
        extension,
      });
      const upload = await uploadAssetToR2({
        key,
        body: image.bytes,
        contentType: image.mimeType,
      });
      return {
        name: image.fileName,
        publicUrl: upload.publicUrl,
      };
    }),
  );

  const prompt = buildImagePrompt({
    provider: input.provider,
    campaign: {
      name: campaign.name,
      objective: campaign.objective,
      primaryPlatform: campaign.primaryPlatform,
      platformMix: campaign.platformMix,
      locale: campaign.locale,
      audienceAngle: campaign.audienceAngle,
      productSkus: campaign.productSkus,
    },
    brief: latestBrief,
    products,
    persona: persona
      ? {
          name: persona.name,
          archetype: persona.archetype,
          ageBand: persona.ageBand,
          genderPresentation: persona.genderPresentation,
          styleNotes: persona.styleNotes,
          physicalFeatures: persona.physicalFeatures,
          referenceImageUrl: persona.referenceImageUrl,
        }
      : undefined,
    referenceCues: buildReferenceCueStrings(referenceAnalysis),
    userDirection: input.direction,
    useCase: input.useCase,
    imageSize: input.imageSize,
    aspectRatio: input.aspectRatio,
    size: input.size,
  });

  const promptSpec = {
    useCase: input.useCase ?? "product-highlight",
    personaId: persona?._id,
    referenceCues: buildReferenceCueStrings(referenceAnalysis),
    direction: input.direction,
    uploadedReferences: uploadedReferenceRecords,
  };

  const requestedModel = input.model || defaultModelForProvider(input.provider);
  const jobId = await createGenerationJobInConvex({
    campaignId: campaign._id,
    briefId: detail.briefs[0]?._id,
    personaId: persona?._id,
    type: "image",
    useCase: input.useCase,
    provider: input.provider,
    model: requestedModel,
    prompt,
    promptSpec,
    sourceProductSkus: campaign.productSkus,
  });

  try {
    await markGenerationJobRunningInConvex(jobId);

    const result = await generateImage({
      provider: input.provider,
      model: input.model,
      prompt,
      size: input.size,
      aspectRatio: input.aspectRatio,
      imageSize: input.imageSize,
      quality: input.quality,
      background: input.background,
      referenceImages: await getReferenceImagesAsDataUrls(
        products,
        persona?.referenceImageUrl,
        input.uploadedReferences,
      ),
    });

    const resolved = await resolveImageBinary(result);
    const extension = inferFileExtension(resolved.mimeType);
    const key = buildGeneratedAssetKey({
      campaignId: campaign._id,
      generationJobId: jobId,
      extension,
    });
    const upload = await uploadAssetToR2({
      key,
      body: resolved.buffer,
      contentType: resolved.mimeType,
    });

    const assetId = await createAssetInConvex({
      campaignId: campaign._id,
      generationJobId: jobId,
      personaId: persona?._id,
      kind: "image",
      provider: result.provider,
      model: result.model,
      status: "ready",
      sourceProductSkus: campaign.productSkus,
      r2Key: upload.key,
      publicUrl: upload.publicUrl,
      aspectRatio: input.aspectRatio,
      mimeType: resolved.mimeType,
    });

    if (persona?._id && input.useCase === "persona-editorial") {
      await attachPersonaReferenceImageInConvex({
        personaId: persona._id,
        referenceImageUrl: upload.publicUrl,
      });
    }

    await markGenerationJobCompletedInConvex(jobId);

    return {
      campaignId: campaign._id,
      jobId,
      assetId,
      publicUrl: upload.publicUrl,
      prompt,
      model: result.model,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown generation error";
    await markGenerationJobFailedInConvex({
      jobId,
      errorMessage: message,
    });
    throw error;
  }
}

async function resolveImageBinary(result: Awaited<ReturnType<typeof generateImage>>) {
  if (result.imageBase64) {
    return {
      mimeType: result.mimeType,
      buffer: Buffer.from(result.imageBase64, "base64"),
    };
  }

  if (result.imageUrl) {
    const response = await fetch(result.imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch generated image URL: ${response.status}`);
    }

    return {
      mimeType: response.headers.get("content-type") || result.mimeType || "image/jpeg",
      buffer: Buffer.from(await response.arrayBuffer()),
    };
  }

  throw new Error("Image provider returned neither base64 nor image URL.");
}

async function getReferenceImagesAsDataUrls(
  products: Array<{
    referenceImages: string[];
    productImages: string[];
  }>,
  personaReferenceImageUrl?: string,
  uploadedReferences?: UploadedReferenceImage[],
) {
  const urls = products
    .flatMap((product) => [...product.referenceImages, ...product.productImages])
    .filter(Boolean);

  if (personaReferenceImageUrl) {
    urls.unshift(personaReferenceImageUrl);
  }

  const uploadedDataUrls = (uploadedReferences ?? []).map((image) => image.dataUrl);
  const trimmed = [...uploadedDataUrls, ...urls].slice(0, 4);

  const images = await Promise.all(
    trimmed.map(async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          return null;
        }
        const mimeType = response.headers.get("content-type");
        if (!mimeType?.startsWith("image/")) {
          return null;
        }
        const buffer = Buffer.from(await response.arrayBuffer());
        return `data:${mimeType};base64,${buffer.toString("base64")}`;
      } catch {
        return null;
      }
    }),
  );

  return images.filter((image) => image !== null);
}

function defaultModelForProvider(provider: GenerateImageInput["provider"]) {
  switch (provider) {
    case "gemini":
      return process.env.GEMINI_IMAGE_MODEL || "gemini-3.1-flash-image-preview";
    case "seedream":
      return process.env.SEEDREAM_IMAGE_MODEL || "seedream-4-5-251128";
    case "openai":
      return process.env.OPENAI_IMAGE_MODEL || "gpt-image-1.5";
  }
}
