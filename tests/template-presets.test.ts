import test from "node:test";
import assert from "node:assert/strict";
import {
  buildDeliveryFileName,
  buildExportPackName,
  defaultTemplatePresets,
  getDeliveryBundle,
  inferDeliveryBundleKey,
  normalizeExportPackStatus,
} from "@/lib/template-presets";
import { buildExportManifest } from "@/lib/export-packaging";

test("default template presets cover the main campaign channels", () => {
  const platforms = new Set(defaultTemplatePresets.map((preset) => preset.primaryPlatform));

  assert.ok(platforms.has("Instagram"));
  assert.ok(platforms.has("Facebook"));
  assert.ok(platforms.has("Pinterest"));
  assert.ok(platforms.has("TikTok"));
});

test("default template presets include try-on and persona-led use cases", () => {
  const useCases = new Set(defaultTemplatePresets.map((preset) => preset.useCase));

  assert.ok(useCases.has("product-highlight"));
  assert.ok(useCases.has("try-on"));
  assert.ok(useCases.has("persona-editorial"));
});

test("export pack names are built from campaign, platform, and locale", () => {
  assert.equal(
    buildExportPackName({
      campaignName: "Quiet Luxury",
      platform: "Instagram",
      locale: "en-US",
    }),
    "Quiet Luxury / Instagram / en-US",
  );
});

test("export pack status normalizes invalid values", () => {
  assert.equal(normalizeExportPackStatus("ready"), "ready");
  assert.equal(normalizeExportPackStatus("bad-status"), "draft");
});

test("delivery bundles resolve to platform defaults", () => {
  assert.equal(inferDeliveryBundleKey("Instagram"), "social-core");
  assert.equal(inferDeliveryBundleKey("Pinterest"), "pinterest-core");
  assert.equal(getDeliveryBundle("story-core").targets[0]?.aspectRatio, "9:16");
});

test("delivery filenames render from template placeholders", () => {
  assert.equal(
    buildDeliveryFileName({
      template: "{campaign}_{platform}_{locale}_{variant}_{assetIndex}",
      campaignName: "Quiet Luxury",
      platform: "Instagram",
      locale: "en-US",
      objective: "Awareness",
      variantKey: "feed-4x5",
      assetIndex: 2,
      extension: "jpg",
    }),
    "quiet-luxury_instagram_en-us_feed-4x5_02.jpg",
  );
});

test("export manifest includes planned variant filenames and master assets", () => {
  const manifest = buildExportManifest({
    _id: "pack-1",
    name: "Quiet Luxury / Instagram / en-US",
    platform: "Instagram",
    locale: "en-US",
    campaignName: "Quiet Luxury",
    deliveryBundleKey: "feed-core",
    fileNameTemplate: "{campaign}_{variant}_{assetIndex}",
    assets: [
      {
        _id: "asset-1",
        publicUrl: "https://assets.example.com/asset-1.jpg",
        mimeType: "image/jpeg",
        aspectRatio: "4:5",
        provider: "openai",
      },
    ],
  });

  assert.equal(manifest.bundle.key, "feed-core");
  assert.equal(manifest.assets[0]?.masterFileName, "quiet-luxury_master-4x5_01.jpg");
  assert.equal(
    manifest.assets[0]?.plannedFiles[0]?.fileName,
    "quiet-luxury_feed-4x5_01.jpg",
  );
  assert.equal(manifest.assets[0]?.plannedFiles.length, 2);
});
