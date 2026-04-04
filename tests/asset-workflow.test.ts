import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeExportStatus,
  normalizeReviewStatus,
  resolveAssetWorkflowState,
} from "@/lib/asset-workflow";

test("asset workflow defaults to draft and not-exported", () => {
  const next = resolveAssetWorkflowState({});

  assert.equal(next.reviewStatus, "draft");
  assert.equal(next.exportStatus, "not-exported");
});

test("approved assets can be queued for export", () => {
  const next = resolveAssetWorkflowState({
    nextReviewStatus: "approved",
    nextExportStatus: "queued",
  });

  assert.equal(next.reviewStatus, "approved");
  assert.equal(next.exportStatus, "queued");
});

test("non-approved assets cannot move to exported states", () => {
  assert.throws(
    () =>
      resolveAssetWorkflowState({
        nextReviewStatus: "shortlisted",
        nextExportStatus: "exported",
      }),
    /Only approved assets/,
  );
});

test("rejected assets always reset export state", () => {
  const next = resolveAssetWorkflowState({
    currentExportStatus: "queued",
    nextReviewStatus: "rejected",
  });

  assert.equal(next.reviewStatus, "rejected");
  assert.equal(next.exportStatus, "not-exported");
});

test("normalizers guard unknown values", () => {
  assert.equal(normalizeReviewStatus("weird"), "draft");
  assert.equal(normalizeExportStatus("bad"), "not-exported");
});
