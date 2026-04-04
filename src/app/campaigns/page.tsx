import Link from "next/link";
import { listCampaignsFromConvex } from "@/lib/convex-server";

export default async function CampaignsPage() {
  const campaigns = await listCampaignsFromConvex(20).catch(() => []);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-7 sm:py-6 lg:px-9">
      <div className="grid gap-6">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="eyebrow">Campaigns</div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              All campaigns.
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/campaigns/new"
              className="w-full rounded-full bg-[var(--color-orange)] px-6 py-3 text-center text-sm font-semibold text-white shadow-[0_18px_44px_rgba(254,104,22,0.24)] sm:w-auto"
            >
              New Campaign
            </Link>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-white/30">
          {["All", "Awareness", "Sales", "Launch", "Review", "Instagram", "Pinterest"].map(
            (item, index) => (
              <span
                key={item}
                className={`rounded-full border px-3 py-1.5 ${
                  index === 0
                    ? "border-white/12 bg-white/[0.04] text-white/72"
                    : "border-white/7 text-white/32"
                }`}
              >
                {item}
              </span>
            ),
          )}
        </div>

        <section className="grid gap-3">
          {campaigns.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/10 px-5 py-12 text-center text-sm text-white/34">
              No campaigns yet.
            </div>
          ) : null}
          {campaigns.map((campaign) => (
            <Link
              key={campaign._id}
              href={`/campaigns/${campaign._id}`}
              className="rounded-[28px] border border-white/6 bg-white/[0.016] px-6 py-5 transition hover:border-white/12 hover:bg-white/[0.026]"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className="text-2xl font-semibold tracking-[-0.03em] text-white">
                    {campaign.name}
                  </div>
                  <div className="mt-2 text-sm text-white/36">{campaign.objective}</div>
                </div>

                <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-white/32">
                  <span className="rounded-full border border-white/8 px-3 py-1.5">
                    {campaign.status}
                  </span>
                  <span className="rounded-full border border-white/8 px-3 py-1.5">
                    {campaign.primaryPlatform}
                  </span>
                  <span className="rounded-full border border-white/8 px-3 py-1.5">
                    {campaign.locale}
                  </span>
                  <span className="rounded-full border border-white/8 px-3 py-1.5">
                    {campaign.platformMix.length} placements
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
