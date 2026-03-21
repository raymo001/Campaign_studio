import { createPersonaAction } from "@/app/campaigns/actions";
import { listPersonasFromConvex } from "@/lib/convex-server";

export default async function PersonasPage() {
  const personas = await listPersonasFromConvex(24).catch(() => []);

  return (
    <div className="mx-auto max-w-[1660px] px-5 py-6 sm:px-7 lg:px-9">
      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <section className="rounded-[30px] border border-white/6 bg-white/[0.016] px-6 py-6">
          <div className="eyebrow">Personas</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Persona profiles.
          </h1>
          <p className="mt-4 text-base leading-7 text-white/42">
            Create reusable model profiles for persona-led campaigns and later try-on work.
          </p>

          <form action={createPersonaAction} className="mt-6 grid gap-4">
            <Field label="Name">
              <input
                name="name"
                required
                placeholder="Urban minimalist"
                className="h-12 w-full rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
              />
            </Field>
            <Field label="Archetype">
              <input
                name="archetype"
                placeholder="Editorial city shopper"
                className="h-12 w-full rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
              />
            </Field>
            <Field label="Locale">
              <input
                name="locale"
                defaultValue="en-US"
                className="h-12 w-full rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
              />
            </Field>
            <Field label="Age band">
              <input
                name="ageBand"
                placeholder="25-34"
                className="h-12 w-full rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
              />
            </Field>
            <Field label="Gender presentation">
              <input
                name="genderPresentation"
                placeholder="Feminine"
                className="h-12 w-full rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
              />
            </Field>
            <Field label="Style notes">
              <input
                name="styleNotes"
                placeholder="clean tailoring, neutral palette, premium minimalism"
                className="h-12 w-full rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
              />
            </Field>
            <Field label="Physical features">
              <input
                name="physicalFeatures"
                placeholder="oval face, dark hair, defined cheekbones"
                className="h-12 w-full rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
              />
            </Field>
            <Field label="Reference image URL">
              <input
                name="referenceImageUrl"
                placeholder="https://..."
                className="h-12 w-full rounded-[18px] border border-white/8 bg-black/18 px-4 text-sm text-white outline-none"
              />
            </Field>
            <Field label="Reference image file">
              <input
                type="file"
                name="referenceFile"
                accept="image/*"
                className="block w-full rounded-[18px] border border-white/8 bg-black/18 px-4 py-3 text-sm text-white/72 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
              />
            </Field>

            <button
              type="submit"
              className="rounded-full bg-[var(--color-orange)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(254,104,22,0.24)]"
            >
              Save Persona
            </button>
          </form>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {personas.map((persona) => (
            <article
              key={persona._id}
              className="rounded-[28px] border border-white/6 bg-white/[0.016] px-5 py-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                    {persona.name}
                  </h2>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/28">
                    {persona.archetype || "Persona"}
                  </div>
                </div>
                <div className="rounded-full border border-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/34">
                  {persona.status}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em] text-white/30">
                {persona.ageBand ? (
                  <span className="rounded-full border border-white/7 px-3 py-1.5">
                    {persona.ageBand}
                  </span>
                ) : null}
                {persona.genderPresentation ? (
                  <span className="rounded-full border border-white/7 px-3 py-1.5">
                    {persona.genderPresentation}
                  </span>
                ) : null}
                <span className="rounded-full border border-white/7 px-3 py-1.5">
                  {persona.locale}
                </span>
              </div>

              <div className="mt-5 text-sm leading-6 text-white/40">
                {[...persona.styleNotes, ...persona.physicalFeatures].join(" · ") || "No notes yet."}
              </div>

              {persona.referenceImageUrl ? (
                <div className="mt-4 text-xs text-white/32">Reference image attached</div>
              ) : null}
            </article>
          ))}
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
