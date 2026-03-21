import Link from "next/link";
import { Panel } from "@/components/panel";
import { listCampaignsFromConvex } from "@/lib/convex-server";

export default async function CampaignsPage() {
  const campaigns = await listCampaignsFromConvex(20).catch(() => []);

  return (
    <div className="px-5 py-5 sm:px-8 lg:px-10">
      <div className="grid gap-4">
        <Panel
          eyebrow="Route Wireframe"
          title="Campaigns"
          description="This page is the operating table for active work: status, owners, stage, and a fast path into creation."
        >
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/campaigns/new"
              className="rounded-full bg-[var(--color-orange)] px-5 py-3 text-sm font-semibold text-white"
            >
              Create Campaign
            </Link>
            <Link
              href="/campaigns/sample-campaign"
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
            >
              Open Sample Campaign
            </Link>
          </div>
        </Panel>

        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
          <Panel
            eyebrow="Active List"
            title="Current campaign board"
            description="In the implemented product, this becomes a filterable data table or kanban view."
          >
            <div className="mt-6 grid gap-3">
              {campaigns.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-white/10 px-4 py-8 text-sm text-[var(--color-soft)]">
                  No campaigns exist yet. The Convex campaign table is ready, and
                  the next step is wiring the create flow to `campaigns.create`.
                </div>
              ) : null}
              {campaigns.map((campaign) => (
                <div
                  key={campaign._id}
                  className="rounded-[24px] border border-white/6 bg-black/18 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-white">
                      {campaign.name}
                    </h3>
                    <span className="rounded-full border border-[var(--color-orange)]/25 bg-[var(--color-orange-soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-orange)]">
                      {campaign.status}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-[var(--color-soft)] sm:grid-cols-3">
                    <div>
                      <div className="eyebrow">Objective</div>
                      <div className="mt-2 text-white/88">{campaign.objective}</div>
                    </div>
                    <div>
                      <div className="eyebrow">Platforms</div>
                      <div className="mt-2 text-white/88">
                        {campaign.platformMix.join(" / ")}
                      </div>
                    </div>
                    <div>
                      <div className="eyebrow">Locale</div>
                      <div className="mt-2 text-white/88">{campaign.locale}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            eyebrow="Sidebar"
            title="Useful filters"
            description="Keep filters short and operational. This should stay lighter than a full project-management interface."
          >
            <div className="mt-6 grid gap-3">
              {[
                "Objective",
                "Platform",
                "Locale",
                "Collection",
                "Stage",
                "Last updated",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[20px] border border-dashed border-white/10 px-4 py-4 text-sm text-white/80"
                >
                  {item}
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
