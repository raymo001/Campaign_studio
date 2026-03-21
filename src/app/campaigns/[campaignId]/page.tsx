import Image from "next/image";
import { notFound } from "next/navigation";
import { Panel } from "@/components/panel";
import { generateCampaignImageAction } from "@/app/campaigns/actions";
import { getCampaignDetailFromConvex } from "@/lib/convex-server";
import {
  geminiSupportedAspectRatios,
  geminiSupportedImageSizes,
  getGeminiImageModels,
  openAiSupportedImageSizes,
  seedreamSupportedPixelSizes,
} from "@/lib/image-providers";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const detail = await getCampaignDetailFromConvex(campaignId);

  if (!detail) {
    notFound();
  }

  const latestBrief = detail.briefs[0]?.briefJson;
  const assets = detail.assets;
  const jobs = detail.generationJobs;
  const products = detail.products;

  return (
    <div className="px-5 py-5 sm:px-8 lg:px-10">
      <div className="grid gap-4">
        <Panel
          eyebrow="Campaign Detail"
          title={detail.campaign.name}
          description="Brief lineage, product context, generation controls, and asset history are all grounded in Convex."
        >
          <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="grid gap-4">
              <div className="rounded-[24px] border border-white/6 bg-black/18 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="eyebrow">Structured Brief</div>
                    <div className="mt-2 text-sm text-[var(--color-soft)]">
                      {detail.briefs.length} saved brief version{detail.briefs.length === 1 ? "" : "s"}
                    </div>
                  </div>
                  <span className="rounded-full border border-[var(--color-orange)]/25 bg-[var(--color-orange-soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-orange)]">
                    {detail.campaign.status}
                  </span>
                </div>

                {latestBrief ? (
                  <div className="mt-5 grid gap-4 text-sm text-white/88">
                    <div className="rounded-[20px] border border-white/6 bg-white/3 px-4 py-4">
                      <div className="eyebrow">Proposition</div>
                      <p className="mt-3 leading-6">{latestBrief.proposition}</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-[20px] border border-white/6 bg-white/3 px-4 py-4">
                        <div className="eyebrow">Visual Direction</div>
                        <p className="mt-3 leading-6">{latestBrief.creativeDirection?.visualStyle}</p>
                        <div className="mt-3 text-[var(--color-soft)]">
                          {latestBrief.creativeDirection?.compositionRules?.join(" ")}
                        </div>
                      </div>
                      <div className="rounded-[20px] border border-white/6 bg-white/3 px-4 py-4">
                        <div className="eyebrow">Copy Direction</div>
                        <p className="mt-3 leading-6">{latestBrief.copyDirection?.hook}</p>
                        <div className="mt-3 text-[var(--color-soft)]">
                          CTA: {latestBrief.copyDirection?.callToAction}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-[20px] border border-dashed border-white/10 px-4 py-6 text-sm text-[var(--color-soft)]">
                    No brief has been stored for this campaign yet.
                  </div>
                )}
              </div>

              <div className="rounded-[24px] border border-white/6 bg-black/18 p-5">
                <div className="eyebrow">Asset Review Grid</div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {assets.length === 0 ? (
                    <div className="rounded-[20px] border border-dashed border-white/10 px-4 py-10 text-sm text-[var(--color-soft)] sm:col-span-2 xl:col-span-3">
                      No generated assets yet. Use the generation form to create the first R2-backed image.
                    </div>
                  ) : null}
                  {assets.map((asset) => (
                    <div
                      key={asset._id}
                      className="rounded-[20px] border border-white/8 bg-[linear-gradient(180deg,rgba(35,100,84,0.22),rgba(255,255,255,0.03))] p-3"
                    >
                      {asset.publicUrl ? (
                        <Image
                          src={asset.publicUrl}
                          alt={asset.kind}
                          width={900}
                          height={1125}
                          unoptimized
                          className="aspect-[4/5] w-full rounded-[16px] object-cover"
                        />
                      ) : (
                        <div className="aspect-[4/5] rounded-[16px] bg-black/20" />
                      )}
                      <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-[var(--color-soft)]">
                        <span>{asset.provider}</span>
                        <span>{asset.status}</span>
                      </div>
                      <div className="mt-2 text-xs text-white/70">
                        {asset.aspectRatio || asset.mimeType || "image"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[24px] border border-white/6 bg-[var(--color-panel)] p-5">
                <div className="eyebrow">Products</div>
                <div className="mt-4 grid gap-2">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="rounded-2xl border border-white/6 bg-white/3 px-4 py-3 text-sm text-white/88"
                    >
                      <div className="font-semibold text-white">{product.name}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--color-soft)]">
                        {product.sku}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/6 bg-[var(--color-panel)] p-5">
                <div className="eyebrow">Generate Image</div>
                <form action={generateCampaignImageAction} className="mt-4 grid gap-3">
                  <input type="hidden" name="campaignId" value={detail.campaign._id} />

                  <label className="grid gap-2 text-sm">
                    <span className="text-white/88">Provider</span>
                    <select
                      name="provider"
                      defaultValue="gemini"
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                    >
                      <option value="gemini" className="bg-[var(--color-panel)]">Gemini</option>
                      <option value="openai" className="bg-[var(--color-panel)]">OpenAI</option>
                      <option value="seedream" className="bg-[var(--color-panel)]">Seedream</option>
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm">
                    <span className="text-white/88">Model override</span>
                    <input
                      name="model"
                      placeholder={`Gemini: ${getGeminiImageModels().join(", ")}`}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                    />
                  </label>

                  <label className="grid gap-2 text-sm">
                    <span className="text-white/88">Aspect ratio</span>
                    <select
                      name="aspectRatio"
                      defaultValue={latestBrief?.generationDefaults?.aspectRatio || "4:5"}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                    >
                      {geminiSupportedAspectRatios.map((ratio) => (
                        <option key={ratio} value={ratio} className="bg-[var(--color-panel)]">
                          {ratio}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm">
                    <span className="text-white/88">Gemini resolution</span>
                    <select
                      name="imageSize"
                      defaultValue={latestBrief?.generationDefaults?.imageSize || "2K"}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                    >
                      {geminiSupportedImageSizes.map((size) => (
                        <option key={size} value={size} className="bg-[var(--color-panel)]">
                          {size}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm">
                    <span className="text-white/88">Pixel size for OpenAI / Seedream</span>
                    <input
                      name="size"
                      placeholder={`OpenAI: ${openAiSupportedImageSizes.join(", ")} | Seedream: ${seedreamSupportedPixelSizes[0]}...`}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                    />
                  </label>

                  <button
                    type="submit"
                    className="rounded-full bg-[var(--color-orange)] px-5 py-3 text-sm font-semibold text-white"
                  >
                    Generate Asset
                  </button>
                </form>
              </div>

              <div className="rounded-[24px] border border-white/6 bg-[var(--color-panel)] p-5">
                <div className="eyebrow">Generation Jobs</div>
                <div className="mt-4 grid gap-3">
                  {jobs.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 px-4 py-4 text-sm text-[var(--color-soft)]">
                      No generation jobs yet.
                    </div>
                  ) : null}
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      className="rounded-2xl border border-white/6 bg-white/3 px-4 py-4 text-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-semibold text-white">
                          {job.provider} / {job.model}
                        </div>
                        <span className="text-xs uppercase tracking-[0.14em] text-[var(--color-soft)]">
                          {job.status}
                        </span>
                      </div>
                      <div className="mt-2 line-clamp-4 text-[var(--color-soft)]">
                        {job.prompt}
                      </div>
                      {job.errorMessage ? (
                        <div className="mt-3 text-xs text-[var(--color-orange)]">
                          {job.errorMessage}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
