const templateGroups = [
  "Awareness / Editorial Still",
  "Sale / Conversion Static",
  "Launch / Reel Cover",
  "TikTok / Storyboard Vertical",
  "Pinterest / Product Discovery Pin",
  "Retargeting / Offer Refresh",
];

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-7 lg:px-9">
      <div className="grid gap-6">
        <header className="max-w-3xl">
          <div className="eyebrow">Templates</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Campaign templates.
          </h1>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templateGroups.map((group) => (
            <article
              key={group}
              className="rounded-[28px] border border-white/6 bg-white/[0.016] px-5 py-5"
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/28">
                Preset
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                {group}
              </h2>
              <div className="mt-5 h-36 rounded-[22px] bg-[linear-gradient(180deg,rgba(22,71,61,0.28),rgba(255,255,255,0.02))]" />
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
