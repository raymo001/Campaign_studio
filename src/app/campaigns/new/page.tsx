import { createCampaignAction } from "@/app/campaigns/actions";
import {
  campaignObjectiveOptions,
  localeOptions,
  platformOptions,
} from "@/lib/campaigns";
import { listProductsFromConvex } from "@/lib/convex-server";

export default async function NewCampaignPage() {
  const products = await listProductsFromConvex(100).catch(() => []);

  return (
    <div className="mx-auto max-w-[1620px] px-4 py-5 sm:px-7 sm:py-6 lg:px-9">
      <form action={createCampaignAction} className="grid gap-6">
        <header className="max-w-3xl">
          <div className="eyebrow">New campaign</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Create a campaign.
          </h1>
          <p className="mt-4 text-base leading-7 text-white/42">
            Choose the objective, the platform, and the products.
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section className="grid gap-4">
            <div className="rounded-[30px] border border-white/6 bg-white/[0.016] px-6 py-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Campaign name">
                  <input
                    name="name"
                    required
                    placeholder="Spring collection launch"
                    className="h-12 w-full rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
                  />
                </Field>
                <Field label="Objective">
                  <select
                    name="objective"
                    required
                    defaultValue="Awareness"
                    className="h-12 w-full rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
                  >
                    {campaignObjectiveOptions.map((option) => (
                      <option key={option} value={option} className="bg-[var(--color-panel)]">
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Primary platform">
                  <select
                    name="primaryPlatform"
                    required
                    defaultValue="Instagram"
                    className="h-12 w-full rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
                  >
                    {platformOptions.map((option) => (
                      <option key={option} value={option} className="bg-[var(--color-panel)]">
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Locale">
                  <select
                    name="locale"
                    required
                    defaultValue="en-US"
                    className="h-12 w-full rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
                  >
                    {localeOptions.map((option) => (
                      <option key={option} value={option} className="bg-[var(--color-panel)]">
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Audience angle" className="mt-4">
                <textarea
                  name="audienceAngle"
                  rows={4}
                  placeholder="Style-conscious customers looking for premium acetate eyewear."
                  className="w-full rounded-[18px] border border-white/8 bg-black/18 px-4 py-3 text-sm text-white outline-none"
                />
              </Field>
            </div>

            <div className="rounded-[30px] border border-white/6 bg-white/[0.016] px-6 py-6">
              <div className="mb-4 text-[11px] uppercase tracking-[0.22em] text-white/30">
                Platform mix
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {platformOptions.map((platform) => (
                  <label
                    key={platform}
                    className="flex items-center gap-3 rounded-[20px] border border-white/7 bg-black/14 px-4 py-3 text-sm text-white/82"
                  >
                    <input
                      type="checkbox"
                      name="platformMix"
                      value={platform}
                      defaultChecked={platform === "Instagram" || platform === "Pinterest"}
                      className="h-4 w-4 accent-[var(--color-orange)]"
                    />
                    <span>{platform}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-white/6 bg-white/[0.016] px-6 py-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/30">
                Products
              </div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/24">
                {products.length} synced
              </div>
            </div>

            <div className="grid gap-3">
              {products.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-white/10 px-4 py-8 text-sm text-white/34">
                  No products available.
                </div>
              ) : null}
              {products.map((product) => (
                <label
                  key={product._id}
                  className="flex items-start gap-4 rounded-[22px] border border-white/7 bg-black/14 px-4 py-4"
                >
                  <input
                    type="checkbox"
                    name="productSkus"
                    value={product.sku}
                    className="mt-1 h-4 w-4 accent-[var(--color-orange)]"
                  />
                  <div className="min-w-0">
                    <div className="text-lg font-medium text-white">{product.name}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/26">
                      {product.sku}
                    </div>
                    <div className="mt-3 text-sm leading-6 text-white/38">
                      {product.descriptions.short ||
                        product.descriptions.long ||
                        "No synced copy."}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="flex justify-stretch sm:justify-end">
          <button
            type="submit"
            className="w-full rounded-full bg-[var(--color-orange)] px-7 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(254,104,22,0.24)] sm:w-auto"
          >
            Create Campaign
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`grid gap-2 ${className}`}>
      <span className="text-sm text-white/58">{label}</span>
      {children}
    </label>
  );
}
