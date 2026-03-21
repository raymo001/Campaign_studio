import test from "node:test";
import assert from "node:assert/strict";
import { buildReferenceCueStrings } from "@/lib/reference-images";

test("buildReferenceCueStrings flattens summaries and tags into reusable prompt cues", () => {
  const cues = buildReferenceCueStrings({
    overallSummary: "Minimal premium portrait with warm neutral styling.",
    images: [
      {
        summary: "Close crop portrait with black acetate eyewear.",
        tags: ["portrait", "acetate eyewear", "warm neutrals"],
      },
      {
        summary: "Editorial half-body composition with clean tailoring.",
        tags: ["clean tailoring", "editorial", "premium fashion"],
      },
    ],
  });

  assert.ok(cues.includes("Minimal premium portrait with warm neutral styling."));
  assert.ok(cues.includes("portrait"));
  assert.ok(cues.includes("clean tailoring"));
});
