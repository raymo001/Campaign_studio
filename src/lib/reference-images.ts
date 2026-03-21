type UploadedReferenceImage = {
  fileName: string;
  mimeType: string;
  bytes: Buffer;
  dataUrl: string;
};

type ReferenceImageAnalysis = {
  overallSummary: string;
  images: Array<{
    summary: string;
    tags: string[];
  }>;
};

export async function readImageFilesFromFormData(
  formData: FormData,
  fieldName: string,
  maxFiles = 3,
) {
  const entries = formData.getAll(fieldName).slice(0, maxFiles);
  const files = entries.filter((entry): entry is File => entry instanceof File && entry.size > 0);

  return Promise.all(
    files.map(async (file) => {
      const mimeType = file.type || "application/octet-stream";
      if (!mimeType.startsWith("image/")) {
        throw new Error(`Unsupported file type for ${file.name}. Only images are allowed.`);
      }

      const bytes = Buffer.from(await file.arrayBuffer());
      return {
        fileName: file.name,
        mimeType,
        bytes,
        dataUrl: `data:${mimeType};base64,${bytes.toString("base64")}`,
      } satisfies UploadedReferenceImage;
    }),
  );
}

export async function analyzeReferenceImages(images: UploadedReferenceImage[]) {
  if (images.length === 0) {
    return null;
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const model = process.env.REFERENCE_TAGGER_MODEL?.trim() || "gpt-4.1-mini";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Analyze these reference images for use in an internal image-generation system. Return compact JSON only with shape {\"overallSummary\": string, \"images\": [{\"summary\": string, \"tags\": string[]}]} . Focus on subject, styling, mood, materials, colors, composition, setting, and wearable/product cues. Keep tags short and reusable.",
            },
            ...images.map((image) => ({
              type: "image_url",
              image_url: { url: image.dataUrl },
            })),
          ],
        },
      ],
      temperature: 0.2,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    return null;
  }

  try {
    return JSON.parse(content) as ReferenceImageAnalysis;
  } catch {
    return null;
  }
}

export function buildReferenceCueStrings(analysis: ReferenceImageAnalysis | null) {
  if (!analysis) {
    return [];
  }

  const cues = [
    analysis.overallSummary,
    ...analysis.images.flatMap((image) => [image.summary, ...image.tags]),
  ];

  return [...new Set(cues.map((cue) => cue.trim()).filter(Boolean))].slice(0, 12);
}

export type { UploadedReferenceImage, ReferenceImageAnalysis };
