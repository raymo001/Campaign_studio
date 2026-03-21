import { z } from "zod";

export const imageProviderSchema = z.enum(["gemini", "openai", "seedream"]);

export type ImageProviderId = z.infer<typeof imageProviderSchema>;

const sizeSchema = z.string().regex(/^\d+x\d+$/).optional();
const aspectRatioSchema = z.string().regex(/^\d+:\d+$/).optional();
const dataUrlSchema = z.string().startsWith("data:image/");

export const generateImageSchema = z.object({
  provider: imageProviderSchema,
  prompt: z.string().min(1).max(4000),
  size: sizeSchema,
  aspectRatio: aspectRatioSchema,
  imageSize: z.enum(["0.5K", "1K", "2K", "4K"]).optional(),
  quality: z.string().optional(),
  background: z.string().optional(),
  count: z.number().int().min(1).max(4).optional(),
  referenceImages: z.array(dataUrlSchema).max(4).optional(),
});

export const editImageSchema = z.object({
  prompt: z.string().min(1).max(4000),
  image: dataUrlSchema,
  mask: dataUrlSchema.optional(),
  size: sizeSchema,
  quality: z.string().optional(),
  background: z.string().optional(),
});

export type GenerateImageInput = z.infer<typeof generateImageSchema>;
export type EditImageInput = z.infer<typeof editImageSchema>;

export type ImageProviderStatus = {
  id: ImageProviderId;
  label: string;
  model: string;
  ready: boolean;
  capabilities: Array<"generate" | "edit">;
  missingEnv: string[];
  notes?: string;
};

export type ImageResult = {
  provider: ImageProviderId;
  model: string;
  mimeType: string;
  imageBase64?: string;
  imageUrl?: string;
  text?: string;
};

function readEnv(key: string) {
  const value = process.env[key];
  return typeof value === "string" ? value.trim() : "";
}

function assertEnv(key: string) {
  const value = readEnv(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function dataUrlToBlob(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Image must be a valid image data URL.");
  }

  const [, mimeType, base64] = match;
  return {
    mimeType,
    base64,
    bytes: Buffer.from(base64, "base64"),
  };
}

async function readError(response: Response) {
  const text = await response.text();
  try {
    return JSON.stringify(JSON.parse(text));
  } catch {
    return text;
  }
}

async function generateWithOpenAI(input: GenerateImageInput): Promise<ImageResult> {
  const apiKey = assertEnv("OPENAI_API_KEY");
  const model = readEnv("OPENAI_IMAGE_MODEL") || "gpt-image-1.5";

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      prompt: input.prompt,
      size: input.size,
      quality: input.quality,
      background: input.background,
      n: input.count ?? 1,
      output_format: "png",
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI image generation failed: ${await readError(response)}`);
  }

  const payload = (await response.json()) as {
    data?: Array<{ b64_json?: string; revised_prompt?: string }>;
  };
  const image = payload.data?.[0]?.b64_json;

  if (!image) {
    throw new Error("OpenAI image generation returned no image.");
  }

  return {
    provider: "openai",
    model,
    mimeType: "image/png",
    imageBase64: image,
  };
}

async function editWithOpenAI(input: EditImageInput): Promise<ImageResult> {
  const apiKey = assertEnv("OPENAI_API_KEY");
  const model = readEnv("OPENAI_IMAGE_MODEL") || "gpt-image-1.5";
  const image = dataUrlToBlob(input.image);
  const mask = input.mask ? dataUrlToBlob(input.mask) : null;
  const form = new FormData();

  form.append("model", model);
  form.append("prompt", input.prompt);
  form.append(
    "image",
    new File([image.bytes], "source.png", { type: image.mimeType }),
  );

  if (mask) {
    form.append("mask", new File([mask.bytes], "mask.png", { type: mask.mimeType }));
  }

  if (input.size) {
    form.append("size", input.size);
  }
  if (input.quality) {
    form.append("quality", input.quality);
  }
  if (input.background) {
    form.append("background", input.background);
  }
  form.append("output_format", "png");

  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  if (!response.ok) {
    throw new Error(`OpenAI image edit failed: ${await readError(response)}`);
  }

  const payload = (await response.json()) as {
    data?: Array<{ b64_json?: string }>;
  };
  const result = payload.data?.[0]?.b64_json;

  if (!result) {
    throw new Error("OpenAI image edit returned no image.");
  }

  return {
    provider: "openai",
    model,
    mimeType: "image/png",
    imageBase64: result,
  };
}

type GeminiPart = {
  text?: string;
  inline_data?: { mime_type: string; data: string };
  inlineData?: { mimeType: string; data: string };
};

async function generateWithGemini(input: GenerateImageInput): Promise<ImageResult> {
  const apiKey = assertEnv("GEMINI_API_KEY");
  const model =
    readEnv("GEMINI_IMAGE_MODEL") || "gemini-3.1-flash-image-preview";
  const parts: GeminiPart[] = [{ text: input.prompt }];

  for (const image of input.referenceImages ?? []) {
    const blob = dataUrlToBlob(image);
    parts.push({
      inline_data: {
        mime_type: blob.mimeType,
        data: blob.base64,
      },
    });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: {
          responseModalities: ["IMAGE"],
          imageConfig: {
            aspectRatio: input.aspectRatio,
            imageSize: input.imageSize,
          },
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini image generation failed: ${await readError(response)}`);
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: GeminiPart[];
      };
    }>;
  };

  const partsFromResponse =
    payload.candidates?.flatMap((candidate) => candidate.content?.parts ?? []) ?? [];
  const imagePart = partsFromResponse.find(
    (part) => part.inline_data?.data || part.inlineData?.data,
  );

  if (!imagePart) {
    throw new Error("Gemini image generation returned no image.");
  }

  return {
    provider: "gemini",
    model,
    mimeType:
      imagePart.inline_data?.mime_type ??
      imagePart.inlineData?.mimeType ??
      "image/png",
    imageBase64:
      imagePart.inline_data?.data ?? imagePart.inlineData?.data ?? undefined,
    text: partsFromResponse.find((part) => part.text)?.text,
  };
}

async function postSeedream(
  url: string,
  payload: Record<string, unknown>,
  apiKey: string,
) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return (await response.json()) as {
    data?: Array<{ b64_json?: string; url?: string }>;
    model?: string;
  };
}

async function generateWithSeedream(
  input: GenerateImageInput,
): Promise<ImageResult> {
  const apiKey = assertEnv("ARK_API_KEY");
  const model = readEnv("SEEDREAM_IMAGE_MODEL") || "seedream-4-5-251128";
  const configuredBase =
    readEnv("SEEDREAM_API_BASE_URL") ||
    "https://operator.las.cn-beijing.volces.com/api/v1";
  const candidateUrls = [
    `${configuredBase.replace(/\/$/, "")}/images/generations`,
    `${configuredBase.replace(/\/$/, "")}/online/images/generations`,
  ];

  const payload: Record<string, unknown> = {
    model,
    prompt: input.prompt,
    size: input.size ?? "2048x2048",
    response_format: "b64_json",
  };

  if (input.referenceImages?.length === 1) {
    payload.image = input.referenceImages[0];
  } else if ((input.referenceImages?.length ?? 0) > 1) {
    payload.image = input.referenceImages;
  }

  let lastError = "";
  for (const url of candidateUrls) {
    try {
      const response = await postSeedream(url, payload, apiKey);
      const image = response.data?.[0];

      if (!image) {
        throw new Error("Seedream returned no image.");
      }

      return {
        provider: "seedream",
        model: response.model ?? model,
        mimeType: "image/jpeg",
        imageBase64: image.b64_json,
        imageUrl: image.url,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }

  throw new Error(`Seedream image generation failed: ${lastError}`);
}

export function getImageProviderStatuses(): ImageProviderStatus[] {
  const statuses: ImageProviderStatus[] = [
    {
      id: "gemini",
      label: "Google Gemini",
      model:
        readEnv("GEMINI_IMAGE_MODEL") || "gemini-3.1-flash-image-preview",
      ready: Boolean(readEnv("GEMINI_API_KEY")),
      capabilities: ["generate"],
      missingEnv: readEnv("GEMINI_API_KEY") ? [] : ["GEMINI_API_KEY"],
    },
    {
      id: "openai",
      label: "OpenAI",
      model: readEnv("OPENAI_IMAGE_MODEL") || "gpt-image-1.5",
      ready: Boolean(readEnv("OPENAI_API_KEY")),
      capabilities: ["generate", "edit"],
      missingEnv: readEnv("OPENAI_API_KEY") ? [] : ["OPENAI_API_KEY"],
    },
    {
      id: "seedream",
      label: "Seedream via Volcengine LAS / ARK key",
      model: readEnv("SEEDREAM_IMAGE_MODEL") || "seedream-4-5-251128",
      ready: Boolean(readEnv("ARK_API_KEY")),
      capabilities: ["generate"],
      missingEnv: readEnv("ARK_API_KEY") ? [] : ["ARK_API_KEY"],
      notes:
        "Volcengine's docs currently show the documented model id with a doubao- prefix. This integration uses your env model string as configured.",
    },
  ];

  return statuses;
}

export async function generateImage(
  input: GenerateImageInput,
): Promise<ImageResult> {
  switch (input.provider) {
    case "gemini":
      return generateWithGemini(input);
    case "openai":
      return generateWithOpenAI(input);
    case "seedream":
      return generateWithSeedream(input);
  }
}

export async function editImage(input: EditImageInput): Promise<ImageResult> {
  return editWithOpenAI(input);
}
