import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { runTryOnGenerationAction } from "@/app/campaigns/actions";
import { getCampaignDetailFromConvex } from "@/lib/convex-server";

export default async function CampaignTryOnPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const detail = await getCampaignDetailFromConvex(campaignId);

  if (!detail) {
    notFound();
  }

  const tryOnAssets = detail.assets.filter((asset) => {
    const job = detail.generationJobs.find((entry) => entry._id === asset.generationJobId);
    return job?.useCase === "try-on";
  });

  return (
    <div className="mx-auto max-w-[1700px] px-4 py-5 sm:px-7 sm:py-6 lg:px-9">
      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <section className="rounded-[30px] border border-white/6 bg-white/[0.016] px-6 py-6">
          <div className="eyebrow">Try-On</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Generate try-on images.
          </h1>
          <p className="mt-4 text-base leading-7 text-white/42">
            Pair a product with a persona or uploaded face reference and generate a fit-led mockup.
          </p>

          <form action={runTryOnGenerationAction} className="mt-6 grid gap-4">
            <input type="hidden" name="campaignId" value={detail.campaign._id} />

            <Field label="Provider">
              <select
                name="provider"
                defaultValue="gemini"
                className="h-12 w-full rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
              >
                <option value="gemini" className="bg-[var(--color-panel)]">Gemini</option>
                <option value="openai" className="bg-[var(--color-panel)]">OpenAI</option>
                <option value="seedream" className="bg-[var(--color-panel)]">Seedream</option>
              </select>
            </Field>

            <Field label="Product">
              <select
                name="productSku"
                required
                className="h-12 w-full rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
              >
                {detail.products.map((product) => (
                  <option key={product._id} value={product.sku} className="bg-[var(--color-panel)]">
                    {product.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Persona">
              <select
                name="personaId"
                defaultValue=""
                className="h-12 w-full rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
              >
                <option value="" className="bg-[var(--color-panel)]">No persona</option>
                {detail.personas.map((persona) => (
                  <option key={persona._id} value={persona._id} className="bg-[var(--color-panel)]">
                    {persona.name}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Aspect ratio">
                <select
                  name="aspectRatio"
                  defaultValue="4:5"
                  className="h-12 w-full rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
                >
                  {["4:5", "1:1", "9:16", "3:4"].map((ratio) => (
                    <option key={ratio} value={ratio} className="bg-[var(--color-panel)]">
                      {ratio}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Gemini resolution">
                <select
                  name="imageSize"
                  defaultValue="2K"
                  className="h-12 w-full rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
                >
                  {["512", "1K", "2K", "4K"].map((size) => (
                    <option key={size} value={size} className="bg-[var(--color-panel)]">
                      {size}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Direction">
              <textarea
                name="direction"
                rows={4}
                placeholder="Natural portrait, premium styling, realistic fit across brow and temples."
                className="w-full rounded-[18px] border border-white/8 bg-black/18 px-4 py-3 text-sm text-white outline-none"
              />
            </Field>

            <Field label="Reference images">
              <input
                type="file"
                name="referenceFiles"
                accept="image/*"
                multiple
                className="block w-full rounded-[18px] border border-white/8 bg-black/18 px-4 py-3 text-sm text-white/72 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
              />
            </Field>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="w-full rounded-full bg-[var(--color-orange)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(254,104,22,0.24)] sm:w-auto"
              >
                Generate Try-On
              </button>
              <Link
                href={`/campaigns/${detail.campaign._id}`}
                className="w-full rounded-full border border-white/8 bg-white/[0.03] px-6 py-3 text-center text-sm font-medium text-white/84 sm:w-auto"
              >
                Back to campaign
              </Link>
            </div>
          </form>
        </section>

        <section className="grid gap-4">
          <div className="rounded-[30px] border border-white/6 bg-white/[0.016] px-6 py-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="eyebrow">Recent Try-On</div>
                <h2 className="mt-3 text-2xl font-semibold text-white">Latest outputs</h2>
              </div>
              <span className="rounded-full border border-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/34">
                {tryOnAssets.length} results
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tryOnAssets.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-white/10 px-5 py-12 text-center text-sm text-white/34 md:col-span-2 xl:col-span-3">
                  No try-on images yet.
                </div>
              ) : (
                tryOnAssets.map((asset) => (
                  <article key={asset._id} className="overflow-hidden rounded-[24px] border border-white/6 bg-black/14">
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
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.68))]" />
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/46">
                          {asset.provider}
                        </div>
                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/58">
                          {asset.aspectRatio || "image"}
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-white/58">{label}</span>
      {children}
    </label>
  );
}
