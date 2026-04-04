import Link from "next/link";
import {
  createExportPackAction,
  updateExportPackStatusAction,
} from "@/app/campaigns/actions";
import {
  getExportOverviewFromConvex,
  listExportPacksFromConvex,
  listTemplatePresetsFromConvex,
} from "@/lib/convex-server";
import { exportPackStatusOptions, normalizeExportPackStatus } from "@/lib/template-presets";

export default async function ExportsPage() {
  const [overview, exportPacks, templates] = await Promise.all([
    getExportOverviewFromConvex().catch(() => null),
    listExportPacksFromConvex(24).catch(() => []),
    listTemplatePresetsFromConvex(24).catch(() => []),
  ]);

  const approvedAssets = overview?.approvedAssets ?? [];

  return (
    <div className="mx-auto max-w-[1720px] px-4 py-5 sm:px-7 sm:py-6 lg:px-9">
      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <section className="rounded-[30px] border border-white/6 bg-white/[0.016] px-6 py-6">
          <div className="eyebrow">Exports</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Export packs.
          </h1>
          <p className="mt-4 text-base leading-7 text-white/42">
            Group approved assets into platform-specific delivery packs and move them through export status.
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-white/30">
            <span className="rounded-full border border-white/8 px-3 py-1.5">
              {overview?.packCount ?? 0} packs
            </span>
            <span className="rounded-full border border-white/8 px-3 py-1.5">
              {overview?.readyCount ?? 0} ready
            </span>
            <span className="rounded-full border border-white/8 px-3 py-1.5">
              {overview?.exportedCount ?? 0} exported
            </span>
          </div>

          <form action={createExportPackAction} className="mt-6 grid gap-4">
            <Field label="Platform">
              <select
                name="platform"
                defaultValue="Instagram"
                className="h-12 rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
              >
                {["Instagram", "Facebook", "Pinterest", "TikTok"].map((platform) => (
                  <option key={platform} value={platform} className="bg-[var(--color-panel)]">
                    {platform}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Locale">
              <select
                name="locale"
                defaultValue="en-US"
                className="h-12 rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
              >
                {["en-US", "en-GB", "fr-FR", "de-DE"].map((locale) => (
                  <option key={locale} value={locale} className="bg-[var(--color-panel)]">
                    {locale}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Template preset">
              <select
                name="templatePresetId"
                defaultValue=""
                className="h-12 rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
              >
                <option value="" className="bg-[var(--color-panel)]">
                  No preset
                </option>
                {templates.map((template) => (
                  <option key={template._id} value={template._id} className="bg-[var(--color-panel)]">
                    {template.primaryPlatform} / {template.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Notes">
              <textarea
                name="notes"
                rows={3}
                placeholder="Delivery notes, file naming, copy variations, or handoff details."
                className="rounded-[18px] border border-white/8 bg-black/18 px-4 py-3 text-sm text-white outline-none"
              />
            </Field>

            <div className="grid gap-3">
              <div className="text-sm text-white/58">Approved assets</div>
              {approvedAssets.length === 0 ? (
                <div className="rounded-[20px] border border-dashed border-white/10 px-4 py-8 text-sm text-white/34">
                  No approved assets available. Approve assets in the library first.
                </div>
              ) : (
                <>
                  {approvedAssets[0]?.campaignId ? (
                    <input type="hidden" name="campaignId" value={approvedAssets[0].campaignId} />
                  ) : null}
                  {approvedAssets[0]?.campaignName ? (
                    <input type="hidden" name="campaignName" value={approvedAssets[0].campaignName} />
                  ) : null}
                  {approvedAssets[0]?.objective ? (
                    <input type="hidden" name="objective" value={approvedAssets[0].objective} />
                  ) : null}
                  {approvedAssets.map((asset) => (
                    <label
                      key={asset._id}
                      className="flex items-center gap-3 rounded-[20px] border border-white/7 bg-black/14 px-4 py-3 text-sm text-white/80"
                    >
                      <input
                        type="checkbox"
                        name="assetIds"
                        value={asset._id}
                        className="h-4 w-4 accent-[var(--color-orange)]"
                      />
                      <span className="min-w-0 flex-1 truncate">
                        {asset.provider} / {asset.aspectRatio || "image"}
                      </span>
                    </label>
                  ))}
                </>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[var(--color-orange)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(254,104,22,0.24)] sm:w-auto"
            >
              Create Export Pack
            </button>
          </form>
        </section>

        <section className="grid gap-4">
          <div className="rounded-[30px] border border-white/6 bg-white/[0.016] px-6 py-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="eyebrow">Pack Queue</div>
                <h2 className="mt-3 text-2xl font-semibold text-white">Current exports</h2>
              </div>
              <Link href="/assets" className="text-sm font-medium text-white/52 transition hover:text-white">
                Open assets
              </Link>
            </div>

            <div className="mt-6 grid gap-4">
              {exportPacks.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-white/10 px-5 py-12 text-center text-sm text-white/34">
                  No export packs yet.
                </div>
              ) : (
                exportPacks.map((pack) => (
                  <article
                    key={pack._id}
                    className="rounded-[24px] border border-white/6 bg-black/14 px-5 py-5"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0">
                        <div className="text-xl font-semibold text-white">{pack.name}</div>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em] text-white/34">
                          <span className="rounded-full border border-white/7 px-3 py-1.5">
                            {pack.platform}
                          </span>
                          <span className="rounded-full border border-white/7 px-3 py-1.5">
                            {pack.locale}
                          </span>
                          <span className="rounded-full border border-white/7 px-3 py-1.5">
                            {pack.assetCount} assets
                          </span>
                          {pack.templatePresetName ? (
                            <span className="rounded-full border border-white/7 px-3 py-1.5">
                              {pack.templatePresetName}
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-3 text-sm text-white/42">
                          {pack.notes || pack.campaignName || "No notes"}
                        </div>
                      </div>

                      <form action={updateExportPackStatusAction} className="grid gap-2 sm:min-w-[180px]">
                        <input type="hidden" name="exportPackId" value={pack._id} />
                        <select
                          name="status"
                          defaultValue={normalizeExportPackStatus(pack.status)}
                          className="h-11 rounded-[16px] border border-white/8 bg-black/18 px-3 text-sm text-white outline-none"
                        >
                          {exportPackStatusOptions.map((status) => (
                            <option key={status} value={status} className="bg-[var(--color-panel)]">
                              {status}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/84 transition hover:border-white/16 hover:bg-white/[0.05]"
                        >
                          Save status
                        </button>
                      </form>
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
