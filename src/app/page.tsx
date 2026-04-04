import Image from "next/image";
import Link from "next/link";
import { getOverviewFromConvex } from "@/lib/convex-server";
import { normalizeExportStatus, normalizeReviewStatus } from "@/lib/asset-workflow";

export default async function Home() {
  const overview = await getOverviewFromConvex().catch(() => null);
  const metrics = [
    {
      label: "Campaigns",
      value: overview?.counts.campaigns ?? 0,
      note: "Active and recent work",
    },
    {
      label: "Products",
      value: overview?.counts.products ?? 0,
      note: "Synced from the live feed",
    },
    {
      label: "Assets",
      value: overview?.counts.assets ?? 0,
      note: "Generated and reviewed media",
    },
    {
      label: "Exports",
      value: overview?.counts.exports ?? 0,
      note: "Ready for channel delivery",
    },
  ];

  const recentCampaigns = overview?.recentCampaigns ?? [];
  const recentAssets = overview?.recentAssets.slice(0, 4) ?? [];

  return (
    <div className="mx-auto max-w-[1680px] px-4 py-5 sm:px-7 sm:py-6 lg:px-9">
      <div className="grid gap-6">
        <section className="surface rounded-[32px] px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow">Vanpella</p>
              <h1 className="display mt-3 text-4xl leading-[0.95] tracking-tight text-white sm:text-6xl">
                Campaign creation for product-led commerce.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/46">
                Build campaigns, generate assets, and move approved work into exports from one place.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/campaigns/new"
                className="rounded-full bg-[var(--color-orange)] px-6 py-3 text-center text-sm font-semibold text-white shadow-[0_18px_44px_rgba(254,104,22,0.24)] transition hover:brightness-105"
              >
                New Campaign
              </Link>
              <Link
                href="/assets"
                className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-white/18 hover:bg-white/[0.05]"
              >
                Review Assets
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-[28px] border border-white/6 bg-white/[0.016] px-6 py-6"
            >
              <div className="text-sm uppercase tracking-[0.18em] text-white/30">
                {metric.label}
              </div>
              <div className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-white">
                {metric.value}
              </div>
              <div className="mt-3 text-sm leading-6 text-white/38">{metric.note}</div>
            </div>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <section className="rounded-[32px] border border-white/6 bg-white/[0.016] px-6 py-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="eyebrow">Current Work</div>
                <h2 className="mt-3 text-2xl font-semibold text-white">Recent campaigns</h2>
              </div>
              <Link
                href="/campaigns"
                className="text-sm font-medium text-white/52 transition hover:text-white"
              >
                View all
              </Link>
            </div>

            <div className="mt-6 grid gap-3">
              {recentCampaigns.length === 0 ? (
                <EmptyBlock label="No campaigns yet." />
              ) : (
                recentCampaigns.map((campaign) => (
                  <Link
                    key={campaign._id}
                    href={`/campaigns/${campaign._id}`}
                    className="rounded-[24px] border border-white/6 bg-black/14 px-5 py-5 transition hover:border-white/12 hover:bg-white/[0.02]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-xl font-semibold text-white">
                          {campaign.name}
                        </div>
                        <div className="mt-2 text-sm text-white/36">{campaign.objective}</div>
                      </div>
                      <div className="rounded-full border border-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/34">
                        {campaign.status}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[32px] border border-white/6 bg-white/[0.016] px-6 py-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="eyebrow">Recent Assets</div>
                <h2 className="mt-3 text-2xl font-semibold text-white">Latest outputs</h2>
              </div>
              <Link
                href="/assets"
                className="text-sm font-medium text-white/52 transition hover:text-white"
              >
                Open library
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {recentAssets.length === 0 ? (
                <div className="sm:col-span-2">
                  <EmptyBlock label="No assets yet." />
                </div>
              ) : (
                recentAssets.map((asset) => (
                  <article
                    key={asset._id}
                    className="overflow-hidden rounded-[24px] border border-white/6 bg-black/14"
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
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.56))]" />
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/48">
                          {asset.provider}
                        </div>
                        <div className="rounded-full border border-white/8 bg-black/18 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white/58">
                          {normalizeReviewStatus(asset.reviewStatus)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-white/42">
                      <span>{asset.aspectRatio || "image"}</span>
                      <span>{normalizeExportStatus(asset.exportStatus)}</span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function EmptyBlock({ label }: { label: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-white/10 px-5 py-10 text-sm text-white/34">
      {label}
    </div>
  );
}
