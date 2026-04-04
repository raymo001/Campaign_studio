import {
  removeTemplatePresetAction,
  seedTemplatePresetsAction,
  upsertTemplatePresetAction,
} from "@/app/campaigns/actions";
import {
  campaignObjectiveOptions,
  localeOptions,
  platformOptions,
} from "@/lib/campaigns";
import { listTemplatePresetsFromConvex } from "@/lib/convex-server";
import { promptUseCaseOptions } from "@/lib/prompt-system";
import {
  defaultFileNameTemplate,
  deliveryBundles,
  normalizeTemplatePresetRecord,
  normalizeFileNameTemplate,
  normalizeTemplatePresetStatus,
  templatePresetStatusOptions,
} from "@/lib/template-presets";

export default async function TemplatesPage() {
  const presets = (await listTemplatePresetsFromConvex(40).catch(() => [])).map(
    (preset) => normalizeTemplatePresetRecord(preset as Record<string, unknown>),
  );

  return (
    <div className="mx-auto max-w-[1680px] px-4 py-5 sm:px-7 sm:py-6 lg:px-9">
      <div className="grid gap-6">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="eyebrow">Templates</div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Editable delivery presets.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/42">
              Keep campaign prompts, delivery bundles, and filename rules in one place.
            </p>
          </div>

          {presets.length === 0 ? (
            <form action={seedTemplatePresetsAction}>
              <button
                type="submit"
                className="rounded-full bg-[var(--color-orange)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(254,104,22,0.24)]"
              >
                Seed Presets
              </button>
            </form>
          ) : null}
        </header>

        <section className="rounded-[30px] border border-white/6 bg-white/[0.016] px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="eyebrow">New preset</div>
              <h2 className="mt-3 text-2xl font-semibold text-white">Create a custom preset</h2>
            </div>
            <div className="text-sm text-white/42">
              Bundle defaults and file names flow directly into export packs.
            </div>
          </div>

          <form action={upsertTemplatePresetAction} className="mt-6 grid gap-4 xl:grid-cols-2">
            <PresetFields />
            <div className="grid gap-4">
              <Field label="Visual direction">
                <textarea
                  name="visualDirection"
                  rows={5}
                  required
                  placeholder="Premium still-life composition with quiet reflections and clean negative space."
                  className="rounded-[18px] border border-white/8 bg-black/18 px-4 py-3 text-sm text-white outline-none"
                />
              </Field>
              <Field label="Copy direction">
                <textarea
                  name="copyDirection"
                  rows={3}
                  required
                  placeholder="Discovery-led headline with one restrained CTA."
                  className="rounded-[18px] border border-white/8 bg-black/18 px-4 py-3 text-sm text-white outline-none"
                />
              </Field>
              <Field label="Notes">
                <textarea
                  name="notes"
                  rows={4}
                  placeholder={"One note per line\nLead with the hero frame\nKeep typography minimal"}
                  className="rounded-[18px] border border-white/8 bg-black/18 px-4 py-3 text-sm text-white outline-none"
                />
              </Field>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-full bg-[var(--color-orange)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(254,104,22,0.24)]"
                >
                  Save preset
                </button>
              </div>
            </div>
          </form>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          {presets.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/10 px-5 py-12 text-center text-sm text-white/34">
              No template presets yet.
            </div>
          ) : null}

          {presets.map((preset) => (
            <article
              key={String(preset._id)}
              className="rounded-[30px] border border-white/6 bg-white/[0.016] px-5 py-5 sm:px-6 sm:py-6"
            >
              <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-white/30">
                <span className="rounded-full border border-white/8 px-3 py-1.5">
                  {preset.primaryPlatform}
                </span>
                <span className="rounded-full border border-white/8 px-3 py-1.5">
                  {preset.objective}
                </span>
                <span className="rounded-full border border-white/8 px-3 py-1.5">
                  {normalizeTemplatePresetStatus(preset.status)}
                </span>
              </div>

              <form action={upsertTemplatePresetAction} className="mt-5 grid gap-4">
                <input type="hidden" name="presetId" value={String(preset._id)} />
                <div className="grid gap-4 xl:grid-cols-2">
                  <PresetFields preset={preset} />
                  <div className="grid gap-4">
                    <Field label="Visual direction">
                      <textarea
                        name="visualDirection"
                        defaultValue={preset.visualDirection}
                        rows={5}
                        required
                        className="rounded-[18px] border border-white/8 bg-black/18 px-4 py-3 text-sm text-white outline-none"
                      />
                    </Field>
                    <Field label="Copy direction">
                      <textarea
                        name="copyDirection"
                        defaultValue={preset.copyDirection}
                        rows={3}
                        required
                        className="rounded-[18px] border border-white/8 bg-black/18 px-4 py-3 text-sm text-white outline-none"
                      />
                    </Field>
                    <Field label="Notes">
                      <textarea
                        name="notes"
                        defaultValue={preset.notes.join("\n")}
                        rows={4}
                        className="rounded-[18px] border border-white/8 bg-black/18 px-4 py-3 text-sm text-white outline-none"
                      />
                    </Field>
                  </div>
                </div>

                <div className="rounded-[22px] border border-white/6 bg-black/16 px-4 py-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/30">
                    Delivery preview
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {deliveryBundles
                      .find((bundle) => bundle.key === preset.deliveryBundleKey)
                      ?.targets.map((target, index) => (
                        <div
                          key={target.key}
                          className="rounded-[18px] border border-white/6 bg-white/[0.02] px-4 py-3"
                        >
                          <div className="text-sm text-white/82">{target.label}</div>
                          <div className="mt-1 text-xs text-white/42">
                            {target.width}×{target.height} · {target.extension}
                          </div>
                          <div className="mt-3 text-xs text-white/54">
                            {normalizeFileNameTemplate(preset.fileNameTemplate)
                              .replace("{campaign}", "quiet-luxury")
                              .replace("{platform}", preset.primaryPlatform.toLowerCase())
                              .replace("{locale}", "en-us")
                              .replace("{variant}", target.key)
                              .replace("{assetIndex}", String(index + 1).padStart(2, "0"))}
                            .{target.extension}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-white/38">
                    Slug: {preset.slug}
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      className="rounded-full bg-[var(--color-orange)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(254,104,22,0.18)]"
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </form>

              <form action={removeTemplatePresetAction} className="mt-3">
                <input type="hidden" name="presetId" value={String(preset._id)} />
                <button
                  type="submit"
                  className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-white/72 transition hover:border-white/16 hover:bg-white/[0.05]"
                >
                  Delete preset
                </button>
              </form>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

function PresetFields({
  preset,
}: {
  preset?: {
    name: string;
    slug: string;
    objective: string;
    primaryPlatform: string;
    platformMix: string[];
    aspectRatio: string;
    imageSize: string;
    useCase: string;
    status: string;
    deliveryBundleKey?: string;
    fileNameTemplate?: string;
  };
}) {
  const selectedPlatforms = new Set(preset?.platformMix ?? []);

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Preset name">
          <input
            name="name"
            defaultValue={preset?.name}
            required
            className="h-12 rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
          />
        </Field>
        <Field label="Slug">
          <input
            name="slug"
            defaultValue={preset?.slug}
            placeholder="editorial-still"
            className="h-12 rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Objective">
          <select
            name="objective"
            defaultValue={preset?.objective ?? campaignObjectiveOptions[0]}
            className="h-12 rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
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
            defaultValue={preset?.primaryPlatform ?? platformOptions[0]}
            className="h-12 rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
          >
            {platformOptions.map((option) => (
              <option key={option} value={option} className="bg-[var(--color-panel)]">
                {option}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Aspect ratio">
          <input
            name="aspectRatio"
            defaultValue={preset?.aspectRatio ?? "4:5"}
            required
            className="h-12 rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
          />
        </Field>
        <Field label="Image size">
          <input
            name="imageSize"
            defaultValue={preset?.imageSize ?? "2K"}
            required
            className="h-12 rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
          />
        </Field>
        <Field label="Use case">
          <select
            name="useCase"
            defaultValue={preset?.useCase ?? promptUseCaseOptions[0]}
            className="h-12 rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
          >
            {promptUseCaseOptions.map((option) => (
              <option key={option} value={option} className="bg-[var(--color-panel)]">
                {option}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Platform mix">
        <div className="flex flex-wrap gap-2">
          {platformOptions.map((platform) => (
            <label
              key={platform}
              className="flex items-center gap-2 rounded-full border border-white/8 bg-black/12 px-3 py-2 text-sm text-white/72"
            >
              <input
                type="checkbox"
                name="platformMix"
                value={platform}
                defaultChecked={
                  selectedPlatforms.size === 0
                    ? platform === (preset?.primaryPlatform ?? platformOptions[0])
                    : selectedPlatforms.has(platform)
                }
                className="h-4 w-4 accent-[var(--color-orange)]"
              />
              <span>{platform}</span>
            </label>
          ))}
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Status">
          <select
            name="status"
            defaultValue={normalizeTemplatePresetStatus(preset?.status)}
            className="h-12 rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
          >
            {templatePresetStatusOptions.map((option) => (
              <option key={option} value={option} className="bg-[var(--color-panel)]">
                {option}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Bundle">
          <select
            name="deliveryBundleKey"
            defaultValue={preset?.deliveryBundleKey ?? deliveryBundles[0].key}
            className="h-12 rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
          >
            {deliveryBundles.map((bundle) => (
              <option key={bundle.key} value={bundle.key} className="bg-[var(--color-panel)]">
                {bundle.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px]">
        <Field label="Filename template">
          <input
            name="fileNameTemplate"
            defaultValue={preset?.fileNameTemplate ?? defaultFileNameTemplate}
            className="h-12 rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
          />
        </Field>
        <Field label="Default locale">
          <select
            name="displayLocale"
            defaultValue={localeOptions[0]}
            disabled
            className="h-12 rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white/40 outline-none"
          >
            {localeOptions.map((option) => (
              <option key={option} value={option} className="bg-[var(--color-panel)]">
                {option}
              </option>
            ))}
          </select>
        </Field>
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
