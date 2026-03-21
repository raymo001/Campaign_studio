import { Panel } from "@/components/panel";
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
    <div className="px-5 py-5 sm:px-8 lg:px-10">
      <Panel
        eyebrow="Creation Flow"
        title="New Campaign"
        description="Create the campaign, attach live Vanpella products, and store the first structured brief in one pass."
      >
        <form action={createCampaignAction} className="mt-8 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-4">
            <div className="rounded-[24px] border border-white/6 bg-[var(--color-panel-muted)] p-5">
              <div className="eyebrow">Campaign Setup</div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Campaign name">
                  <input
                    name="name"
                    required
                    placeholder="Spring quiet luxury launch"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                  />
                </Field>
                <Field label="Objective">
                  <select
                    name="objective"
                    required
                    defaultValue="Awareness"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
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
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
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
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
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
                  placeholder="Style-conscious customers looking for premium acetate eyewear with a clean editorial feel."
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                />
              </Field>
            </div>

            <div className="rounded-[24px] border border-white/6 bg-[var(--color-panel-muted)] p-5">
              <div className="eyebrow">Platform Mix</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {platformOptions.map((platform) => (
                  <label
                    key={platform}
                    className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/18 px-4 py-3 text-sm text-white/88"
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

            <div className="rounded-[24px] border border-white/6 bg-[var(--color-panel-muted)] p-5">
              <div className="eyebrow">Product Context</div>
              <div className="mt-4 grid gap-3">
                {products.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-[var(--color-soft)]">
                    No synced products available yet. Run the feed sync first.
                  </div>
                ) : null}
                {products.map((product) => (
                  <label
                    key={product._id}
                    className="grid gap-2 rounded-[22px] border border-white/8 bg-black/18 px-4 py-4 text-sm text-white/88"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-white">{product.name}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--color-soft)]">
                          {product.sku}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        name="productSkus"
                        value={product.sku}
                        className="mt-1 h-4 w-4 accent-[var(--color-orange)]"
                      />
                    </div>
                    <div className="text-sm text-[var(--color-soft)]">
                      {product.descriptions.short || product.descriptions.long || "No synced copy."}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-white/6 bg-black/20 p-5">
              <div className="eyebrow">What This Creates</div>
              <div className="mt-4 grid gap-3 text-sm leading-6 text-white/88">
                <div className="rounded-[20px] border border-white/6 bg-white/3 px-4 py-4">
                  A campaign record linked to the selected live-feed products.
                </div>
                <div className="rounded-[20px] border border-white/6 bg-white/3 px-4 py-4">
                  A structured brief with proposition, copy direction, and image defaults.
                </div>
                <div className="rounded-[20px] border border-white/6 bg-white/3 px-4 py-4">
                  A ready campaign detail view where generation jobs and assets accumulate.
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[var(--color-orange)]/15 bg-[var(--color-orange-soft)] p-5">
              <div className="eyebrow">Submit</div>
              <p className="mt-3 text-sm leading-6 text-white/88">
                Keep this first step narrow. The studio should create a strong brief
                from clean product context, then let generation happen on the detail page.
              </p>
              <button
                type="submit"
                className="mt-6 w-full rounded-full bg-[var(--color-orange)] px-5 py-3 text-sm font-semibold text-white"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </form>
      </Panel>
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
      <span className="text-sm font-medium text-white/88">{label}</span>
      {children}
    </label>
  );
}
