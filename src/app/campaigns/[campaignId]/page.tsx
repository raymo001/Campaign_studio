import Image from "next/image";
import { notFound } from "next/navigation";
import { GenerationComposer } from "@/components/generation-composer";
import { getCampaignDetailFromConvex } from "@/lib/convex-server";
import {
  geminiSupportedAspectRatios,
  geminiSupportedImageSizes,
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
  const products = detail.products;
  const personas = detail.personas;
  const generationJobs = detail.generationJobs;
  const heroAsset = assets[0];
  const secondaryAssets = assets.slice(1, 6);
  const personaById = new Map(personas.map((persona) => [persona._id, persona.name]));

  return (
    <div className="mx-auto max-w-[1760px] px-5 pb-32 pt-6 sm:px-7 lg:px-9">
      <div className="grid gap-6">
        <header className="flex flex-col gap-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-4xl">
              <div className="mb-3 text-[11px] uppercase tracking-[0.24em] text-white/26">
                Campaign
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
                  {detail.campaign.name}
                </h1>
                <span className="rounded-full border border-[rgba(58,147,122,0.5)] bg-[rgba(31,102,86,0.16)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#8ecfbd]">
                  {detail.campaign.status}
                </span>
              </div>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/44">
                {latestBrief?.proposition ||
                  "Product-grounded campaign space for fast creative iteration."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-white/32">
              <Chip>{detail.campaign.objective}</Chip>
              <Chip>{detail.campaign.primaryPlatform}</Chip>
              <Chip>{detail.campaign.locale}</Chip>
              <Chip>{assets.length} assets</Chip>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-white/48">
            {products.map((product) => (
              <span
                key={product._id}
                className="rounded-full border border-white/7 bg-white/[0.02] px-3 py-1.5"
              >
                {product.name}
              </span>
            ))}
          </div>
        </header>

        <main className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
          <section className="grid gap-4">
            {assets.length === 0 ? (
              <div className="surface-muted flex min-h-[620px] items-center justify-center rounded-[30px] text-sm text-white/34">
                Generate the first asset to populate the board.
              </div>
            ) : (
              <div className="grid auto-rows-[240px] gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                <AssetTile asset={heroAsset} hero />
                {secondaryAssets.map((asset) => (
                  <AssetTile key={asset._id} asset={asset} />
                ))}
              </div>
            )}

            <div className="rounded-[28px] border border-white/6 bg-white/[0.018] px-5 py-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/28">
                  Generation history
                </div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/24">
                  {generationJobs.length} jobs
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {generationJobs.slice(0, 6).map((job) => {
                  const promptSpec = readPromptSpec(job.promptSpec);
                  const cueTags = promptSpec?.referenceCues ?? [];
                  const uploadedReferences = promptSpec?.uploadedReferences ?? [];
                  const personaName = job.personaId
                    ? personaById.get(job.personaId) || "Persona"
                    : null;

                  return (
                    <article
                      key={job._id}
                      className="rounded-[22px] border border-white/6 bg-black/14 px-4 py-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium text-white/88">
                            {job.provider} / {job.model}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em] text-white/30">
                            {job.useCase ? <MiniChip>{job.useCase}</MiniChip> : null}
                            {personaName ? <MiniChip>{personaName}</MiniChip> : null}
                            <MiniChip>{job.status}</MiniChip>
                          </div>
                        </div>
                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/24">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {cueTags.length > 0 ? (
                        <div className="mt-4">
                          <div className="text-[11px] uppercase tracking-[0.18em] text-white/24">
                            Prompt cues
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {cueTags.map((cue) => (
                              <MiniChip key={cue}>{cue}</MiniChip>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {uploadedReferences.length > 0 ? (
                        <div className="mt-4">
                          <div className="text-[11px] uppercase tracking-[0.18em] text-white/24">
                            Uploaded references
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {uploadedReferences.map((reference) => (
                              <a
                                key={reference.publicUrl}
                                href={reference.publicUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full border border-white/7 px-3 py-1 text-[11px] text-white/62 transition hover:border-white/14 hover:text-white"
                              >
                                {reference.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="grid gap-4 xl:pt-1">
            <div className="rounded-[28px] border border-white/6 bg-white/[0.018] px-5 py-5">
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/28">
                Brief direction
              </div>
              <div className="mt-4 grid gap-4">
                <MetaBlock
                  label="Visual"
                  value={latestBrief?.creativeDirection?.visualStyle}
                />
                <MetaBlock
                  label="Hook"
                  value={latestBrief?.copyDirection?.hook}
                />
                <MetaBlock
                  label="CTA"
                  value={latestBrief?.copyDirection?.callToAction}
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-white/6 bg-white/[0.018] px-5 py-5">
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/28">
                Recent output
              </div>
              <div className="mt-4 grid gap-3">
                {assets.slice(0, 3).map((asset) => (
                  <div
                    key={asset._id}
                    className="flex items-center justify-between rounded-[20px] border border-white/6 bg-black/14 px-4 py-3"
                  >
                    <div>
                      <div className="text-sm font-medium text-white/88">
                        {asset.provider}
                      </div>
                      <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/26">
                        {asset.aspectRatio || "image"}
                      </div>
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/34">
                      {asset.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>
      </div>

      <GenerationComposer
        campaignId={detail.campaign._id}
        defaultHook={
          latestBrief?.copyDirection?.hook ||
          "Render the next campaign variant from the saved brief."
        }
        defaultAspectRatio={latestBrief?.generationDefaults?.aspectRatio || "4:5"}
        defaultImageSize={latestBrief?.generationDefaults?.imageSize || "2K"}
        personas={personas.map((persona) => ({
          id: persona._id,
          name: persona.name,
        }))}
        geminiAspectRatios={geminiSupportedAspectRatios}
        geminiImageSizes={geminiSupportedImageSizes}
        openAiSizes={openAiSupportedImageSizes}
        seedreamSizes={seedreamSupportedPixelSizes}
      />
    </div>
  );
}

function AssetTile({
  asset,
  hero = false,
}: {
  asset:
    | {
        _id: string;
        publicUrl?: string;
        provider: string;
        status: string;
        aspectRatio?: string;
      }
    | undefined;
  hero?: boolean;
}) {
  if (!asset) {
    return (
      <div className="surface-muted flex min-h-[240px] items-center justify-center rounded-[28px] text-sm text-white/32">
        Awaiting asset
      </div>
    );
  }

  return (
    <article
      className={`group relative overflow-hidden rounded-[28px] bg-[#0a0c0b] ${
        hero ? "lg:col-span-2 lg:row-span-2 2xl:col-span-2" : ""
      }`}
    >
      {asset.publicUrl ? (
        <Image
          src={asset.publicUrl}
          alt={asset.provider}
          fill
          priority={hero}
          unoptimized
          className="object-cover transition duration-500 group-hover:scale-[1.015]"
        />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.16)_42%,rgba(0,0,0,0.74))]" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-white/38">
            {asset.provider}
          </div>
          <div className="mt-2 text-xs text-white/68">{asset.aspectRatio || "image"}</div>
        </div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/58">
          {asset.status}
        </div>
      </div>
    </article>
  );
}

function MetaBlock({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/6 bg-black/12 px-4 py-4">
      <div className="text-[11px] uppercase tracking-[0.18em] text-white/28">{label}</div>
      <div className="mt-3 text-[15px] leading-7 text-white/76">{value || "Not set"}</div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/7 px-3 py-1.5">{children}</span>
  );
}

function MiniChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/7 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/34">
      {children}
    </span>
  );
}

function readPromptSpec(value: unknown):
  | {
      referenceCues?: string[];
      uploadedReferences?: Array<{ name: string; publicUrl: string }>;
    }
  | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as {
    referenceCues?: unknown;
    uploadedReferences?: unknown;
  };

  return {
    referenceCues: Array.isArray(candidate.referenceCues)
      ? candidate.referenceCues.filter(
          (entry): entry is string => typeof entry === "string",
        )
      : [],
    uploadedReferences: Array.isArray(candidate.uploadedReferences)
      ? candidate.uploadedReferences.filter(
          (
            entry,
          ): entry is {
            name: string;
            publicUrl: string;
          } =>
            typeof entry === "object" &&
            entry !== null &&
            "name" in entry &&
            "publicUrl" in entry &&
            typeof entry.name === "string" &&
            typeof entry.publicUrl === "string",
        )
      : [],
  };
}
