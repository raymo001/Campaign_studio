export const assetReviewStatusOptions = [
  "draft",
  "shortlisted",
  "approved",
  "rejected",
] as const;

export const assetExportStatusOptions = [
  "not-exported",
  "queued",
  "exported",
] as const;

export type AssetReviewStatus = (typeof assetReviewStatusOptions)[number];
export type AssetExportStatus = (typeof assetExportStatusOptions)[number];

export function resolveAssetWorkflowState(args: {
  currentReviewStatus?: string;
  currentExportStatus?: string;
  nextReviewStatus?: string;
  nextExportStatus?: string;
}) {
  const reviewStatus = normalizeReviewStatus(
    args.nextReviewStatus ?? args.currentReviewStatus,
  );
  let exportStatus = normalizeExportStatus(
    args.nextExportStatus ?? args.currentExportStatus,
  );

  if (reviewStatus !== "approved" && exportStatus !== "not-exported") {
    if (args.nextExportStatus) {
      throw new Error("Only approved assets can be queued or marked as exported.");
    }

    exportStatus = "not-exported";
  }

  if (reviewStatus === "rejected") {
    exportStatus = "not-exported";
  }

  return {
    reviewStatus,
    exportStatus,
  };
}

export function normalizeReviewStatus(value?: string): AssetReviewStatus {
  return assetReviewStatusOptions.includes(value as AssetReviewStatus)
    ? (value as AssetReviewStatus)
    : "draft";
}

export function normalizeExportStatus(value?: string): AssetExportStatus {
  return assetExportStatusOptions.includes(value as AssetExportStatus)
    ? (value as AssetExportStatus)
    : "not-exported";
}
