import { Panel } from "@/components/panel";

const integrations = [
  {
    name: "Convex",
    note: "Auth confirmed on this machine by you; project still needs to be initialized in this repo.",
  },
  {
    name: "Vercel",
    note: "CLI auth confirmed locally. Run `vercel link` after creating the project in the dashboard or via CLI.",
  },
  {
    name: "Cloudflare R2",
    note: "Wrangler is installed but Cloudflare auth is not active yet on this machine.",
  },
  {
    name: "OpenAI",
    note: "Add API key and model selections in `.env.local` before generation features are wired in.",
  },
];

export default function SettingsPage() {
  return (
    <div className="px-5 py-5 sm:px-8 lg:px-10">
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Panel
          eyebrow="Integration State"
          title="Settings"
          description="This route should eventually surface live connection health and environment status, but for now it documents what must be linked."
        >
          <div className="mt-6 grid gap-3">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="rounded-[24px] border border-white/6 bg-black/18 p-4"
              >
                <h2 className="text-lg font-semibold text-white">
                  {integration.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-soft)]">
                  {integration.note}
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          eyebrow="Environment Keys"
          title="`.env.local` coverage"
          description="The local file is pre-created with placeholders for every required integration. Secrets stay local and the tracked template remains safe."
        >
          <div className="mt-6 grid gap-2">
            {[
              "OPENAI_API_KEY",
              "CONVEX_DEPLOYMENT",
              "NEXT_PUBLIC_CONVEX_URL",
              "CLOUDFLARE_ACCOUNT_ID",
              "CLOUDFLARE_R2_BUCKET",
              "R2_ACCESS_KEY_ID",
              "R2_SECRET_ACCESS_KEY",
              "VERCEL_PROJECT_ID",
              "VERCEL_ORG_ID",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-dashed border-white/10 px-4 py-3 text-sm text-white/82"
              >
                {item}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
