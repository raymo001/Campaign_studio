import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { z } from "zod";

const r2EnvSchema = z.object({
  CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
  CLOUDFLARE_R2_BUCKET: z.string().min(1),
  CLOUDFLARE_R2_PUBLIC_BASE_URL: z.string().url(),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
});

export function getR2Env() {
  return r2EnvSchema.parse({
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_R2_BUCKET: process.env.CLOUDFLARE_R2_BUCKET,
    CLOUDFLARE_R2_PUBLIC_BASE_URL: process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  });
}

export function buildR2PublicUrl(publicBaseUrl: string, key: string) {
  return `${publicBaseUrl.replace(/\/$/, "")}/${key.replace(/^\/+/, "")}`;
}

export function inferFileExtension(mimeType: string) {
  switch (mimeType) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/jpeg":
      return "jpg";
    default:
      return "bin";
  }
}

export function buildGeneratedAssetKey(args: {
  campaignId: string;
  generationJobId: string;
  extension: string;
}) {
  const date = new Date().toISOString().slice(0, 10);
  return [
    "campaigns",
    args.campaignId,
    "generated",
    date,
    `${args.generationJobId}.${args.extension}`,
  ].join("/");
}

export function buildPersonaReferenceKey(args: {
  personaId: string;
  fileName: string;
  extension: string;
}) {
  const date = new Date().toISOString().slice(0, 10);
  const safeName = args.fileName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return ["personas", args.personaId, "references", date, `${safeName || "reference"}.${args.extension}`].join("/");
}

export function buildCampaignReferenceKey(args: {
  campaignId: string;
  fileName: string;
  extension: string;
}) {
  const date = new Date().toISOString().slice(0, 10);
  const safeName = args.fileName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return ["campaigns", args.campaignId, "references", date, `${safeName || "reference"}.${args.extension}`].join("/");
}

export async function uploadAssetToR2(args: {
  key: string;
  body: Buffer;
  contentType: string;
}) {
  const env = getR2Env();
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });

  await client.send(
    new PutObjectCommand({
      Bucket: env.CLOUDFLARE_R2_BUCKET,
      Key: args.key,
      Body: args.body,
      ContentType: args.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    key: args.key,
    publicUrl: buildR2PublicUrl(env.CLOUDFLARE_R2_PUBLIC_BASE_URL, args.key),
  };
}
