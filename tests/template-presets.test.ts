import test from "node:test";
import assert from "node:assert/strict";
import {
  buildExportPackName,
  defaultTemplatePresets,
  normalizeExportPackStatus,
} from "@/lib/template-presets";

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
