import Link from "next/link";
import { Panel } from "@/components/panel";
import { primaryNavigation } from "@/lib/navigation";

const metrics = [
  { label: "Active Campaigns", value: "12", note: "Awareness to conversion" },
  { label: "Products Synced", value: "46", note: "Live Vanpella feed" },
  { label: "Draft Assets", value: "184", note: "Image + storyboard variants" },
  { label: "Export Packs", value: "29", note: "Platform-ready bundles" },
];

const flows = [
  "Choose goal, platform, products, and locale.",
  "Generate a structured campaign brief from the live product feed.",
  "Create image or storyboard variants with platform presets.",
  "Review, approve, resize, and export bundles.",
];

export default function Home() {
  return (
    <div className="px-5 py-5 sm:px-8 lg:px-10">
      <div className="panel rounded-[32px] border p-6 sm:p-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow">Vanpella Workspace</p>
              <h1 className="display mt-3 text-5xl leading-none tracking-tight text-white sm:text-6xl">
                Campaign Studio built for clean product storytelling.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-soft)] sm:text-lg">
                This wireframe turns the planning doc into a working route shell:
                feed-synced products, brief generation, image and video creation,
                approvals, templates, and brand control.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/campaigns/new"
                className="glow-ring rounded-full bg-[var(--color-orange)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-105"
              >
                New Campaign
              </Link>
              <Link
                href="/products"
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/8"
              >
                Open Product Feed
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <Panel key={metric.label} title={metric.label} tone="muted">
                <div className="mt-4 text-4xl font-semibold text-white">
                  {metric.value}
                </div>
                <p className="mt-2 text-sm text-[var(--color-soft)]">
                  {metric.note}
                </p>
              </Panel>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
            <Panel
              eyebrow="Primary Journey"
              title="The operator flow stays campaign-first."
              description="The app should avoid asking the team to think in models, negative prompts, or media pipelines."
            >
              <div className="mt-6 grid gap-3">
                {flows.map((flow, index) => (
                  <div
                    key={flow}
                    className="rounded-[22px] border border-white/6 bg-black/15 px-4 py-4"
                  >
                    <div className="text-xs font-bold tracking-[0.16em] text-[var(--color-orange)]">
                      Step {index + 1}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/90">{flow}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel
              eyebrow="Platform Packs"
              title="Preset bundles for the channels that matter."
              description="Every campaign output should know the destination before generation starts."
            >
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {["Instagram", "Facebook", "Pinterest", "TikTok"].map((name) => (
                  <div
                    key={name}
                    className="rounded-[20px] border border-white/6 bg-[var(--color-panel-muted)] p-4"
                  >
                    <div className="text-sm font-semibold text-white">{name}</div>
                    <div className="mt-4 flex h-28 items-center justify-center rounded-[16px] bg-gradient-to-br from-[var(--color-green)]/55 to-black/20 text-xs font-medium uppercase tracking-[0.2em] text-white/75">
                      preset preview
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.95fr_1.35fr]">
            <Panel
              eyebrow="Core Modules"
              title="Route map translated into live entry points."
              description="These route shells are implemented now so the repo already matches the information architecture."
            >
              <div className="mt-6 grid gap-3">
                {primaryNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-[20px] border border-white/6 bg-white/3 px-4 py-4 transition hover:border-white/12 hover:bg-white/5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-base font-semibold text-white">
                        {item.label}
                      </span>
                      <span className="text-xs tracking-[0.16em] text-[var(--color-soft)] uppercase">
                        {item.href}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-soft)]">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Panel>

            <Panel
              eyebrow="Wireframe Snapshot"
              title="The create surface is one dominant canvas."
              description="This is the most important product decision from the reference: fewer competing panels, more focus."
            >
              <div className="mt-6 grid gap-4 rounded-[28px] border border-white/6 bg-black/20 p-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[22px] border border-white/6 bg-[linear-gradient(160deg,rgba(35,100,84,0.24),rgba(255,255,255,0.02))] p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[var(--color-soft)]">
                    <span>Campaign Canvas</span>
                    <span>9:16 / 1:1 / 4:5</span>
                  </div>
                  <div className="mt-4 grid h-80 gap-3 sm:grid-cols-2">
                    <div className="rounded-[18px] bg-[var(--color-panel)] p-3">
                      <div className="h-full rounded-[14px] border border-dashed border-white/12 bg-[radial-gradient(circle_at_top,rgba(254,104,22,0.2),transparent_35%),rgba(255,255,255,0.02)]" />
                    </div>
                    <div className="rounded-[18px] bg-[var(--color-panel)] p-3">
                      <div className="grid h-full gap-3">
                        <div className="rounded-[14px] border border-dashed border-white/12 bg-white/2" />
                        <div className="rounded-[14px] border border-dashed border-white/12 bg-white/2" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="rounded-[22px] border border-white/6 bg-[var(--color-panel)] p-4">
                    <div className="eyebrow">Brief</div>
                    <p className="mt-3 text-sm leading-6 text-white/88">
                      Quiet-luxury awareness campaign for The Architect
                      collection, emphasizing structure, acetate finish, and
                      premium direct-to-consumer value.
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-white/6 bg-[var(--color-panel)] p-4">
                    <div className="eyebrow">Products in Context</div>
                    <div className="mt-3 grid gap-2">
                      {["The Architect Ink", "The Architect Tortoise", "The Minimalist"].map(
                        (item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-white/6 bg-white/3 px-3 py-3 text-sm text-white/88"
                          >
                            {item}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
