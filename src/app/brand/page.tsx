import { Panel } from "@/components/panel";

export default function BrandPage() {
  return (
    <div className="px-5 py-5 sm:px-8 lg:px-10">
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel
          eyebrow="Brand System"
          title="Brand"
          description="This route centralizes tokens and generation guardrails so outputs stay premium and controlled."
        >
          <div className="mt-6 grid gap-3">
            {[
              "Primary green #16473d",
              "Accent orange #fe6816",
              "Premium dark workspace",
              "Quiet-luxury tone",
              "Disallowed claims and promo rules",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-white/6 bg-black/18 px-4 py-4 text-sm text-white/86"
              >
                {item}
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          eyebrow="Brand Guardrails"
          title="Creative policy blocks"
          description="These should become structured records in Convex and feed directly into brief generation."
        >
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Logo placement",
              "Copy density",
              "Luxury editorial references",
              "Offer and price disclosure",
              "Localization tone",
              "Lifestyle scene constraints",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-dashed border-white/10 px-4 py-6 text-sm text-white/82"
              >
                {item}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
