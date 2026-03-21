import test from "node:test";
import assert from "node:assert/strict";
import {
  geminiSupportedAspectRatios,
  geminiSupportedImageSizes,
  getGeminiImageModels,
  openAiSupportedImageSizes,
  seedreamSupportedPixelSizes,
} from "@/lib/image-providers";

test("Gemini image model catalog includes Nano Banana 2 and Nano Banana Pro by default", () => {
  const models = getGeminiImageModels();
  assert.ok(models.includes("gemini-3.1-flash-image-preview"));
  assert.ok(models.includes("gemini-3-pro-image-preview"));
});

test("Gemini supported aspect ratios include documented widescreen and portrait values", () => {
  assert.ok(geminiSupportedAspectRatios.includes("5:4"));
  assert.ok(geminiSupportedAspectRatios.includes("9:16"));
  assert.ok(geminiSupportedAspectRatios.includes("21:9"));
});

test("Gemini supported image sizes include all documented tiers", () => {
  assert.deepEqual(geminiSupportedImageSizes, ["512", "1K", "2K", "4K"]);
});

test("OpenAI supported sizes include the documented portrait and landscape sizes", () => {
  assert.ok(openAiSupportedImageSizes.includes("1024x1024"));
  assert.ok(openAiSupportedImageSizes.includes("1536x1024"));
  assert.ok(openAiSupportedImageSizes.includes("1024x1536"));
});

test("Seedream supported sizes include 2K and 4K matrix entries", () => {
  assert.ok(seedreamSupportedPixelSizes.includes("2048x2048"));
  assert.ok(seedreamSupportedPixelSizes.includes("5504x3040"));
  assert.ok(seedreamSupportedPixelSizes.includes("6240x2656"));
});
