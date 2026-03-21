import process from "node:process";
import { PutBucketCorsCommand, S3Client } from "@aws-sdk/client-s3";

// Load local env files when the script is run outside Next.js runtime.
for (const envFile of [".env.local", ".env"]) {
  try {
    process.loadEnvFile?.(envFile);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      continue;
    }
    throw error;
  }
}

const required = [
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_R2_BUCKET",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing env vars: ${missing.join(", ")}`);
  process.exit(1);
}

const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

await client.send(
  new PutBucketCorsCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedOrigins: [allowedOrigin],
          AllowedMethods: ["GET", "PUT", "HEAD"],
          AllowedHeaders: ["*"],
          ExposeHeaders: ["ETag"],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  }),
);

console.log(
  `Configured CORS for ${process.env.CLOUDFLARE_R2_BUCKET} allowing ${allowedOrigin}`,
);
