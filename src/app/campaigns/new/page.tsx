import { Panel } from "@/components/panel";

const steps = [
  {
    title: "Campaign Setup",
    fields: ["Objective", "Platform set", "Locale", "Audience angle"],
  },
  {
    title: "Product Context",
    fields: ["Product picker", "Collection", "Reference imagery", "Price and offer"],
  },
  {
    title: "Brief Builder",
    fields: ["Message hierarchy", "Visual direction", "Hooks", "CTA options"],
  },
  {
    title: "Generation",
    fields: ["Image or video", "Variant count", "Preset pack", "Review threshold"],
  },
];

export default function NewCampaignPage() {
  return (
    <div className="px-5 py-5 sm:px-8 lg:px-10">
      <Panel
        eyebrow="Creation Flow"
        title="New Campaign"
        description="The creation route should feel like one guided composition surface rather than a long enterprise form."
      >
        <div className="mt-8 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[24px] border border-white/6 bg-[var(--color-panel-muted)] p-5"
              >
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-orange)]">
                  Step {index + 1}
                </div>
                <h2 className="mt-2 text-xl font-semibold text-white">{step.title}</h2>
                <div className="mt-4 grid gap-2">
                  {step.fields.map((field) => (
                    <div
                      key={field}
                      className="rounded-2xl border border-dashed border-white/10 px-4 py-3 text-sm text-white/78"
                    >
                      {field}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-white/6 bg-black/20 p-5">
              <div className="eyebrow">Right Drawer</div>
              <div className="mt-4 grid gap-3">
                {[
                  "Selected products",
                  "Brand rules",
                  "Offer and pricing context",
                  "Platform preset summary",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[20px] border border-white/6 bg-white/3 px-4 py-4 text-sm text-white/88"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[var(--color-orange)]/15 bg-[var(--color-orange-soft)] p-5">
              <div className="eyebrow">Bottom Composer</div>
              <div className="mt-4 rounded-[22px] border border-white/10 bg-[var(--color-panel)] p-5 text-sm leading-6 text-white/88">
                Generate a quiet-luxury awareness concept for The Architect Ink
                and Tortoise, optimized for Instagram 4:5 and Pinterest, with
                close-up acetate texture, premium natural light, and minimal copy.
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
