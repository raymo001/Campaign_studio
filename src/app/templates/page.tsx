import { seedTemplatePresetsAction } from "@/app/campaigns/actions";
import { listTemplatePresetsFromConvex } from "@/lib/convex-server";

export default async function TemplatesPage() {
  const presets = await listTemplatePresetsFromConvex(24).catch(() => []);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-7 sm:py-6 lg:px-9">
      <div className="grid gap-6">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="eyebrow">Templates</div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Campaign presets.
            </h1>
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

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {presets.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/10 px-5 py-12 text-center text-sm text-white/34">
              No template presets yet.
            </div>
          ) : null}

          {presets.map((preset) => (
            <article
              key={preset._id}
              className="rounded-[28px] border border-white/6 bg-white/[0.016] px-5 py-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/28">
                  {preset.primaryPlatform}
                </div>
                <div className="rounded-full border border-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/34">
                  {preset.objective}
                </div>
              </div>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                {preset.name}
              </h2>

              <div className="mt-5 rounded-[22px] border border-white/6 bg-[linear-gradient(180deg,rgba(22,71,61,0.2),rgba(255,255,255,0.02))] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/30">
                  Visual direction
                </div>
                <div className="mt-2 text-sm leading-6 text-white/70">
                  {preset.visualDirection}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em] text-white/32">
                <span className="rounded-full border border-white/7 px-3 py-1.5">
                  {preset.aspectRatio}
                </span>
                <span className="rounded-full border border-white/7 px-3 py-1.5">
                  {preset.imageSize}
                </span>
                <span className="rounded-full border border-white/7 px-3 py-1.5">
                  {preset.useCase}
                </span>
              </div>

              <div className="mt-4 text-sm leading-6 text-white/42">
                {preset.copyDirection}
              </div>

              <div className="mt-4 grid gap-2">
                {preset.notes.slice(0, 3).map((note) => (
                  <div
                    key={note}
                    className="rounded-[18px] border border-white/6 bg-black/12 px-4 py-3 text-sm text-white/66"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
