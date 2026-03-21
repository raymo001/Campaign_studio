import { z } from "zod";

const serverEnvSchema = z.object({
  VANPELLA_FEED_URL: z.string().url(),
  VANPELLA_FEED_OWNER_ID: z.string().min(1),
  VANPELLA_FEED_TOKEN: z.string().min(1),
  NEXT_PUBLIC_CONVEX_URL: z.string().url(),
});

export function getServerEnv() {
  return serverEnvSchema.parse({
    VANPELLA_FEED_URL: process.env.VANPELLA_FEED_URL,
    VANPELLA_FEED_OWNER_ID: process.env.VANPELLA_FEED_OWNER_ID,
    VANPELLA_FEED_TOKEN: process.env.VANPELLA_FEED_TOKEN,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  });
}
