import { Panel } from "@/components/panel";

const productFields = [
  "name",
  "sku",
  "retailPrice",
  "description",
  "referenceImageUrls",
  "socialCaption",
  "whyVanpella",
  "localized",
];

export default function ProductsPage() {
  return (
    <div className="px-5 py-5 sm:px-8 lg:px-10">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel
          eyebrow="Feed Browser"
          title="Products"
          description="This route is the bridge between the live Vanpella feed and campaign generation."
        >
          <div className="mt-6 grid gap-3">
            {[
              "The Architect Ink",
              "The Architect Tortoise",
              "The Director Eclipse",
              "The Minimalist",
            ].map((product) => (
              <div
                key={product}
                className="rounded-[24px] border border-white/6 bg-black/18 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-white">{product}</h2>
                  <span className="rounded-full border border-white/8 px-3 py-1 text-xs uppercase tracking-[0.14em] text-[var(--color-soft)]">
                    live feed
                  </span>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-white/78 sm:grid-cols-4">
                  <div className="rounded-2xl bg-white/3 px-3 py-3">4 refs</div>
                  <div className="rounded-2xl bg-white/3 px-3 py-3">EUR 68</div>
                  <div className="rounded-2xl bg-white/3 px-3 py-3">Polarized</div>
                  <div className="rounded-2xl bg-white/3 px-3 py-3">Localized</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          eyebrow="Indexed Fields"
          title="Generation context"
          description="These are the first fields to normalize, hash, and embed in Convex."
        >
          <div className="mt-6 grid gap-2">
            {productFields.map((field) => (
              <div
                key={field}
                className="rounded-2xl border border-dashed border-white/10 px-4 py-3 text-sm text-white/82"
              >
                {field}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
