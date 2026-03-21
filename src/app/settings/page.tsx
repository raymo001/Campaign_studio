import { Panel } from "@/components/panel";
import { getImageProviderStatuses } from "@/lib/image-providers";

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

const imageProviders = getImageProviderStatuses();

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
              "GEMINI_API_KEY",
              "ARK_API_KEY",
              "CONVEX_DEPLOYMENT",
              "NEXT_PUBLIC_CONVEX_URL",
              "CLOUDFLARE_ACCOUNT_ID",
              "CLOUDFLARE_R2_BUCKET",
              "R2_ACCESS_KEY_ID",
              "R2_SECRET_ACCESS_KEY",
              "GEMINI_IMAGE_MODEL",
              "OPENAI_IMAGE_MODEL",
              "SEEDREAM_IMAGE_MODEL",
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

      <div className="mt-4">
        <Panel
          eyebrow="Image Models"
          title="Provider readiness"
          description="These providers are now wired into the app through server routes for generation and, in OpenAI's case, edits."
        >
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {imageProviders.map((provider) => (
              <div
                key={provider.id}
                className="rounded-[24px] border border-white/6 bg-black/18 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {provider.label}
                    </div>
                    <div className="mt-2 text-sm text-[var(--color-soft)]">
                      {provider.model}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${
                      provider.ready
                        ? "bg-[var(--color-green)] text-white"
                        : "bg-[var(--color-orange-soft)] text-[var(--color-orange)]"
                    }`}
                  >
                    {provider.ready ? "Ready" : "Missing Env"}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {provider.capabilities.map((capability) => (
                    <span
                      key={capability}
                      className="rounded-full border border-white/8 px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/80"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
                {provider.availableModels?.length ? (
                  <div className="mt-4 grid gap-2">
                    {provider.availableModels.map((model) => (
                      <div
                        key={model}
                        className="rounded-2xl border border-white/8 bg-white/3 px-3 py-2 text-xs tracking-[0.08em] text-white/85"
                      >
                        {model}
                      </div>
                    ))}
                  </div>
                ) : null}
                {provider.missingEnv.length > 0 ? (
                  <p className="mt-4 text-sm leading-6 text-[var(--color-soft)]">
                    Missing: {provider.missingEnv.join(", ")}
                  </p>
                ) : null}
                {provider.notes ? (
                  <p className="mt-4 text-sm leading-6 text-[var(--color-soft)]">
                    {provider.notes}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[24px] border border-white/6 bg-[var(--color-panel)] p-5 text-sm leading-7 text-white/84">
            Routes:
            <br />
            `GET /api/image-providers`
            <br />
            `POST /api/images/generate`
            <br />
            `POST /api/images/edit`
          </div>
        </Panel>
      </div>
    </div>
  );
}
