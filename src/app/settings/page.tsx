import { getImageProviderStatuses } from "@/lib/image-providers";

const integrations = [
  { name: "Convex", state: "Connected" },
  { name: "Vercel", state: "Connected" },
  { name: "Cloudflare R2", state: "Connected" },
  { name: "OpenAI", state: "Configured" },
  { name: "Gemini", state: "Configured" },
  { name: "Seedream", state: "Configured" },
];

const imageProviders = getImageProviderStatuses();

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-[1660px] px-5 py-6 sm:px-7 lg:px-9">
      <div className="grid gap-6">
        <header className="max-w-3xl">
          <div className="eyebrow">Settings</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Integrations and models.
          </h1>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="rounded-[28px] border border-white/6 bg-white/[0.016] px-5 py-5"
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/28">
                Integration
              </div>
              <div className="mt-3 text-2xl font-semibold text-white">{integration.name}</div>
              <div className="mt-4 inline-flex rounded-full border border-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/34">
                {integration.state}
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {imageProviders.map((provider) => (
            <article
              key={provider.id}
              className="rounded-[28px] border border-white/6 bg-white/[0.016] px-5 py-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-2xl font-semibold text-white">{provider.label}</div>
                  <div className="mt-2 text-sm text-white/34">{provider.model}</div>
                </div>
                <span className="rounded-full border border-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/34">
                  {provider.ready ? "Ready" : "Missing"}
                </span>
              </div>

              {provider.availableModels?.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {provider.availableModels.map((model) => (
                    <span
                      key={model}
                      className="rounded-full border border-white/7 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/32"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              ) : null}

              {provider.supportedSizes?.length ? (
                <div className="mt-5 text-sm leading-6 text-white/36">
                  Sizes: {provider.supportedSizes.slice(0, 5).join(", ")}
                </div>
              ) : null}
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
