import Image from "next/image";
import Link from "next/link";
import { updateAssetWorkflowAction } from "@/app/campaigns/actions";
import {
  listAssetsFromConvex,
} from "@/lib/convex-server";
import {
  assetExportStatusOptions,
  assetReviewStatusOptions,
  normalizeExportStatus,
  normalizeReviewStatus,
} from "@/lib/asset-workflow";

export default async function AssetsPage() {
  const assets = await listAssetsFromConvex(40).catch(() => []);

  return (
    <div className="mx-auto max-w-[1700px] px-4 py-5 sm:px-7 sm:py-6 lg:px-9">
      <div className="grid gap-6">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="eyebrow">Assets</div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Review and export.
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-white/30">
            <span className="rounded-full border border-white/8 px-3 py-1.5">
              {assets.length} recent
            </span>
            <span className="rounded-full border border-white/8 px-3 py-1.5">
              {assets.filter((asset) => normalizeReviewStatus(asset.reviewStatus) === "approved").length} approved
            </span>
            <span className="rounded-full border border-white/8 px-3 py-1.5">
              {assets.filter((asset) => normalizeExportStatus(asset.exportStatus) === "exported").length} exported
            </span>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {assets.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/10 px-5 py-12 text-center text-sm text-white/34">
              No assets yet.
            </div>
          ) : null}

          {assets.map((asset) => {
            const reviewStatus = normalizeReviewStatus(asset.reviewStatus);
            const exportStatus = normalizeExportStatus(asset.exportStatus);

            return (
              <article
                key={asset._id}
                className="overflow-hidden rounded-[28px] border border-white/6 bg-white/[0.016]"
              >
                <div className="relative aspect-[4/5] bg-[#0a0c0b]">
                  {asset.publicUrl ? (
                    <Image
                      src={asset.publicUrl}
                      alt={asset.provider}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.7))]" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/44">
                        {asset.provider}
                      </div>
                      <div className="mt-2 text-sm text-white/72">
                        {asset.campaignName || "Standalone asset"}
                      </div>
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                      {asset.aspectRatio || "image"}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 px-5 py-5">
                  <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em] text-white/34">
                    <span className="rounded-full border border-white/7 px-3 py-1.5">
                      {reviewStatus}
                    </span>
                    <span className="rounded-full border border-white/7 px-3 py-1.5">
                      {exportStatus}
                    </span>
                    {asset.useCase ? (
                      <span className="rounded-full border border-white/7 px-3 py-1.5">
                        {asset.useCase}
                      </span>
                    ) : null}
                    {asset.personaName ? (
                      <span className="rounded-full border border-white/7 px-3 py-1.5">
                        {asset.personaName}
                      </span>
                    ) : null}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <form action={updateAssetWorkflowAction} className="grid gap-2">
                      <input type="hidden" name="assetId" value={asset._id} />
                      <input type="hidden" name="redirectTo" value="/assets" />
                      <label className="grid gap-2">
                        <span className="text-xs text-white/46">Review</span>
                        <select
                          name="reviewStatus"
                          defaultValue={reviewStatus}
                          className="h-11 rounded-[16px] border border-white/8 bg-black/18 px-3 text-sm text-white outline-none"
                        >
                          {assetReviewStatusOptions.map((option) => (
                            <option key={option} value={option} className="bg-[var(--color-panel)]">
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="submit"
                        className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/84 transition hover:border-white/16 hover:bg-white/[0.05]"
                      >
                        Save review
                      </button>
                    </form>

                    <form action={updateAssetWorkflowAction} className="grid gap-2">
                      <input type="hidden" name="assetId" value={asset._id} />
                      <input type="hidden" name="redirectTo" value="/assets" />
                      <label className="grid gap-2">
                        <span className="text-xs text-white/46">Export</span>
                        <select
                          name="exportStatus"
                          defaultValue={exportStatus}
                          className="h-11 rounded-[16px] border border-white/8 bg-black/18 px-3 text-sm text-white outline-none"
                        >
                          {assetExportStatusOptions.map((option) => (
                            <option key={option} value={option} className="bg-[var(--color-panel)]">
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="submit"
                        className="rounded-full bg-[var(--color-orange)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(254,104,22,0.18)] transition hover:brightness-105"
                      >
                        Update export
                      </button>
                    </form>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-xs text-white/38">
                    <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                    {asset.campaignId ? (
                      <Link
                        href={`/campaigns/${asset.campaignId}`}
                        className="text-white/56 transition hover:text-white"
                      >
                        Open campaign
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
