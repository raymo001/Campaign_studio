import test from "node:test";
import assert from "node:assert/strict";
import { buildInternalPromptSpec, renderPromptForProvider } from "@/lib/prompt-system";

test("persona-editorial spec includes persona details and references", () => {
  const spec = buildInternalPromptSpec({
    campaign: {
      objective: "Awareness",
      primaryPlatform: "Instagram",
      locale: "en-US",
    },
    brief: {
      proposition: "Vanpella eyewear with refined editorial storytelling.",
      audienceAngle: "Premium fashion shoppers.",
      copyDirection: {
        hook: "See the collection.",
        bodyCopy: "Editorial premium eyewear.",
        callToAction: "Discover more.",
      },
      creativeDirection: {
        visualStyle: "Luxury editorial.",
        compositionRules: ["Keep the frame visible."],
        lighting: "Soft directional light.",
      },
    },
    products: [
      {
        sku: "sku-1",
        name: "The Architect Ink",
        brand: "VANPELLA",
        collection: "Core",
        referenceImages: ["https://example.com/product.png"],
        productImages: [],
        tryOnImages: [],
        descriptions: {},
        promptContext: {
          frameMaterial: "Acetate",
          frameShape: "Square",
          frameColor: "Ink Black",
          lensColor: "Smoke",
        },
      } as never,
    ],
    useCase: "persona-editorial",
    persona: {
      name: "Urban minimalist",
      archetype: "Editorial city shopper",
      ageBand: "25-34",
      genderPresentation: "Feminine",
      styleNotes: ["clean tailoring", "neutral palette"],
      physicalFeatures: ["oval face", "dark hair"],
      referenceImageUrl: "https://example.com/persona.png",
    },
  });

  assert.equal(spec.useCase, "persona-editorial");
  assert.equal(spec.persona?.name, "Urban minimalist");
  assert.ok(spec.references.some((ref) => ref.kind === "product"));
});

test("seedream renderer stays short and front-loaded", () => {
  const prompt = renderPromptForProvider("seedream", {
    goal: "Premium eyewear campaign",
    deliverableType: "image",
    useCase: "product-highlight",
    platform: "Instagram",
    objective: "Awareness",
    locale: "en-US",
    subject: "A clean product-led campaign image",
    productFocus: ["The Architect Ink, acetate, square, black"],
    setting: "A minimal studio",
    actionOrPose: "Hero framing",
    composition: ["Keep the product dominant."],
    lighting: "Soft studio light",
    style: ["Premium ecommerce", "restrained luxury"],
    brandTone: ["Precise", "premium"],
    constraints: ["Preserve geometry.", "Preserve material accuracy."],
    negativeAvoidance: ["distortion", "busy background", "cheap graphics"],
    references: [],
    referenceCues: [],
  });

  assert.match(prompt, /^A clean product-led campaign image/);
  assert.match(prompt, /avoid distortion, busy background, cheap graphics/i);
});
