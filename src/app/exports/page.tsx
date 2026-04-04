import Link from "next/link";
import {
  createExportPackAction,
  updateExportPackDeliveryAction,
  updateExportPackStatusAction,
} from "@/app/campaigns/actions";
import { campaignObjectiveOptions, localeOptions, platformOptions } from "@/lib/campaigns";
import {
  getExportOverviewFromConvex,
  listExportPacksFromConvex,
  listTemplatePresetsFromConvex,
} from "@/lib/convex-server";
import { buildExportPackPreview } from "@/lib/export-packaging";
import {
  defaultFileNameTemplate,
  deliveryBundles,
  exportPackStatusOptions,
  normalizeTemplatePresetRecord,
  normalizeExportPackStatus,
} from "@/lib/template-presets";

export default async function ExportsPage() {
  const [overview, exportPacks, templates] = await Promise.all([
    getExportOverviewFromConvex().catch(() => null),
    listExportPacksFromConvex(24).catch(() => []),
    listTemplatePresetsFromConvex(24).catch(() => []),
  ]);

  const approvedAssets = overview?.approvedAssets ?? [];
  const resolvedTemplates = templates.map((template) =>
    normalizeTemplatePresetRecord(template as Record<string, unknown>),
  );

  return (
    <div className="mx-auto max-w-[1720px] px-4 py-5 sm:px-7 sm:py-6 lg:px-9">
      <div className="grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
        <section className="rounded-[30px] border border-white/6 bg-white/[0.016] px-6 py-6">
          <div className="eyebrow">Exports</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Delivery packs.
          </h1>
          <p className="mt-4 text-base leading-7 text-white/42">
            Build channel-ready handoff packs with bundle specs, filenames, and downloadable manifests.
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
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Platform">
                <select
                  name="platform"
                  defaultValue="Instagram"
                  className="h-12 rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
                >
                  {platformOptions.map((platform) => (
                    <option key={platform} value={platform} className="bg-[var(--color-panel)]">
                      {platform}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Locale">
                <select
                  name="locale"
                  defaultValue={localeOptions[0]}
                  className="h-12 rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
                >
                  {localeOptions.map((locale) => (
                    <option key={locale} value={locale} className="bg-[var(--color-panel)]">
                      {locale}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Objective">
                <select
                  name="objective"
                  defaultValue={campaignObjectiveOptions[0]}
                  className="h-12 rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
                >
                  {campaignObjectiveOptions.map((objective) => (
                    <option key={objective} value={objective} className="bg-[var(--color-panel)]">
                      {objective}
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
                  {resolvedTemplates.map((template) => (
                    <option key={String(template._id)} value={String(template._id)} className="bg-[var(--color-panel)]">
                      {template.primaryPlatform} / {template.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Delivery bundle">
              <select
                name="deliveryBundleKey"
                defaultValue={deliveryBundles[0].key}
                className="h-12 rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
              >
                {deliveryBundles.map((bundle) => (
                  <option key={bundle.key} value={bundle.key} className="bg-[var(--color-panel)]">
                    {bundle.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Filename template">
              <input
                name="fileNameTemplate"
                defaultValue={defaultFileNameTemplate}
                className="h-12 rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
              />
            </Field>

            <Field label="Notes">
              <textarea
                name="notes"
                rows={3}
                placeholder="Delivery notes, handoff details, or destination guidance."
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
                  {approvedAssets.map((asset) => (
                    <label
                      key={String(asset._id)}
                      className="flex items-center gap-3 rounded-[20px] border border-white/7 bg-black/14 px-4 py-3 text-sm text-white/80"
                    >
                      <input
                        type="checkbox"
                        name="assetIds"
                        value={String(asset._id)}
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
                <div className="eyebrow">Pack queue</div>
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
                exportPacks.map((pack) => {
                  const preview = buildExportPackPreview({
                    ...pack,
                    campaignName: pack.campaignName,
                    templatePresetName: pack.templatePresetName,
                  });

                  return (
                    <article
                      key={String(pack._id)}
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
                            <span className="rounded-full border border-white/7 px-3 py-1.5">
                              {preview.bundle.name}
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
                          <input type="hidden" name="exportPackId" value={String(pack._id)} />
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

                      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                        <form action={updateExportPackDeliveryAction} className="grid gap-4 rounded-[22px] border border-white/6 bg-white/[0.02] p-4">
                          <input type="hidden" name="exportPackId" value={String(pack._id)} />
                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Preset">
                              <select
                                name="templatePresetId"
                                defaultValue={pack.templatePresetId || ""}
                                className="h-11 rounded-[16px] border border-white/8 bg-black/18 px-3 text-sm text-white outline-none"
                              >
                                <option value="" className="bg-[var(--color-panel)]">
                                  No preset
                                </option>
                                {resolvedTemplates.map((template) => (
                                  <option
                                    key={String(template._id)}
                                    value={String(template._id)}
                                    className="bg-[var(--color-panel)]"
                                  >
                                    {template.primaryPlatform} / {template.name}
                                  </option>
                                ))}
                              </select>
                            </Field>
                            <Field label="Bundle">
                              <select
                                name="deliveryBundleKey"
                                defaultValue={preview.bundle.key}
                                className="h-11 rounded-[16px] border border-white/8 bg-black/18 px-3 text-sm text-white outline-none"
                              >
                                {deliveryBundles.map((bundle) => (
                                  <option
                                    key={bundle.key}
                                    value={bundle.key}
                                    className="bg-[var(--color-panel)]"
                                  >
                                    {bundle.name}
                                  </option>
                                ))}
                              </select>
                            </Field>
                          </div>

                          <Field label="Filename template">
                            <input
                              name="fileNameTemplate"
                              defaultValue={preview.fileNameTemplate}
                              className="h-11 rounded-[16px] border border-white/8 bg-black/18 px-3 text-sm text-white outline-none"
                            />
                          </Field>

                          <Field label="Notes">
                            <textarea
                              name="notes"
                              defaultValue={pack.notes || ""}
                              rows={3}
                              className="rounded-[16px] border border-white/8 bg-black/18 px-3 py-3 text-sm text-white outline-none"
                            />
                          </Field>

                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <button
                              type="submit"
                              className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/84 transition hover:border-white/16 hover:bg-white/[0.05]"
                            >
                              Save delivery details
                            </button>
                            <Link
                              href={`/exports/${String(pack._id)}/download`}
                              className="rounded-full bg-[var(--color-orange)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(254,104,22,0.18)]"
                            >
                              Download package
                            </Link>
                          </div>
                        </form>

                        <div className="grid gap-3 rounded-[22px] border border-white/6 bg-white/[0.02] p-4">
                          <div className="text-[11px] uppercase tracking-[0.18em] text-white/30">
                            Planned files
                          </div>
                          <div className="grid gap-2">
                            {preview.files.slice(0, 6).map((file) => (
                              <div
                                key={`${file.assetId}-${file.variantKey}`}
                                className="rounded-[16px] border border-white/6 bg-black/16 px-4 py-3"
                              >
                                <div className="text-sm text-white/80">{file.fileName}</div>
                                <div className="mt-1 text-xs text-white/42">
                                  {file.target.width}×{file.target.height} · {file.target.aspectRatio}
                                </div>
                              </div>
                            ))}
                            {preview.files.length > 6 ? (
                              <div className="text-xs text-white/38">
                                +{preview.files.length - 6} more planned files in manifest
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
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
