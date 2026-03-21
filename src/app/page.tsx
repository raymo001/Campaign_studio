import Link from "next/link";

const metrics = [
  { label: "Campaigns", value: "12", note: "Active across awareness to sales" },
  { label: "Products", value: "46", note: "Synced from the Vanpella feed" },
  { label: "Assets", value: "184", note: "Draft and approved renders" },
  { label: "Exports", value: "29", note: "Platform-ready packs" },
];

const recentCampaigns = [
  {
    name: "Quiet Luxury Awareness",
    objective: "Awareness",
    status: "Draft",
    href: "/campaigns",
  },
  {
    name: "Architect Conversion Push",
    objective: "Sales",
    status: "Active",
    href: "/campaigns",
  },
  {
    name: "Spring Editorial Drop",
    objective: "Launch",
    status: "Review",
    href: "/campaigns",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-[1680px] px-5 py-6 sm:px-7 lg:px-9">
      <div className="grid gap-6">
        <section className="surface rounded-[34px] px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow">Vanpella</p>
              <h1 className="display mt-3 text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl">
                Campaign creation for product-led commerce.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/46">
                Build campaigns, generate assets, and publish across every
                platform from one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/campaigns/new"
                className="rounded-full bg-[var(--color-orange)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(254,104,22,0.24)] transition hover:brightness-105"
              >
                New Campaign
              </Link>
              <Link
                href="/campaigns"
                className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition hover:border-white/18 hover:bg-white/[0.05]"
              >
                Open Studio
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

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_420px]">
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
              {recentCampaigns.map((campaign) => (
                <Link
                  key={campaign.name}
                  href={campaign.href}
                  className="rounded-[24px] border border-white/6 bg-black/14 px-5 py-5 transition hover:border-white/12 hover:bg-white/[0.02]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xl font-semibold text-white">{campaign.name}</div>
                      <div className="mt-2 text-sm text-white/36">{campaign.objective}</div>
                    </div>
                    <div className="rounded-full border border-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/34">
                      {campaign.status}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-white/6 bg-white/[0.016] px-6 py-6">
            <div className="eyebrow">Quick Access</div>
            <div className="mt-5 grid gap-3">
              <QuickLink
                href="/products"
                title="Products"
                description="Browse synced catalog context."
              />
              <QuickLink
                href="/assets"
                title="Assets"
                description="Review generated media and exports."
              />
              <QuickLink
                href="/templates"
                title="Templates"
                description="Use platform-specific campaign presets."
              />
              <QuickLink
                href="/tutorials"
                title="Tutorials"
                description="Open product guides and help."
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[22px] border border-white/6 bg-black/14 px-5 py-4 transition hover:border-white/12 hover:bg-white/[0.02]"
    >
      <div className="text-lg font-semibold text-white">{title}</div>
      <div className="mt-2 text-sm leading-6 text-white/38">{description}</div>
    </Link>
  );
}
