const guides = [
  {
    title: "Start a campaign",
    steps: [
      "Create a new campaign and choose the primary platform.",
      "Attach the products you want the brief to reference.",
      "Review the saved brief direction before generating assets.",
    ],
  },
  {
    title: "Generate assets",
    steps: [
      "Pick the provider and aspect ratio from the bottom composer.",
      "Use Gemini image size or pixel-size override as needed.",
      "Review new outputs directly in the campaign board.",
    ],
  },
  {
    title: "Review output",
    steps: [
      "Use the campaign gallery as the primary review surface.",
      "Compare variants by provider and ratio.",
      "Move accepted results toward export packs.",
    ],
  },
];

export default function TutorialsPage() {
  return (
    <div className="mx-auto max-w-[1480px] px-5 py-6 sm:px-7 lg:px-9">
      <div className="grid gap-6">
        <section className="rounded-[32px] border border-white/6 bg-white/[0.016] px-6 py-6 sm:px-8">
          <div className="eyebrow">Tutorials</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Tutorials and help.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/44">
            Learn how to create campaigns, generate assets, and review results.
          </p>
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          {guides.map((guide) => (
            <article
              key={guide.title}
              className="rounded-[28px] border border-white/6 bg-white/[0.016] px-6 py-6"
            >
              <div className="eyebrow">Guide</div>
              <h2 className="mt-3 text-2xl font-semibold text-white">{guide.title}</h2>
              <div className="mt-5 grid gap-3">
                {guide.steps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-[20px] border border-white/6 bg-black/14 px-4 py-4"
                  >
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-orange)]">
                      Step {index + 1}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-white/76">{step}</div>
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
