import { Panel } from "@/components/panel";
import {
  getProductSyncSummary,
  listProductsFromConvex,
} from "@/lib/convex-server";

const productFields = [
  "sku",
  "name",
  "descriptions",
  "promptContext",
  "referenceImages",
  "localized",
  "tags",
  "supportedLocales",
];

export default async function ProductsPage() {
  const [summary, products] = await Promise.all([
    getProductSyncSummary().catch(() => null),
    listProductsFromConvex(12).catch(() => []),
  ]);

  return (
    <div className="px-5 py-5 sm:px-8 lg:px-10">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel
          eyebrow="Feed Browser"
          title="Products"
          description="This route is the bridge between the live Vanpella feed and campaign generation."
        >
          <div className="mt-6 rounded-[24px] border border-white/6 bg-[var(--color-panel)] p-4 text-sm text-[var(--color-soft)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span>
                Synced products:{" "}
                <span className="font-semibold text-white">
                  {summary?.productCount ?? 0}
                </span>
              </span>
              <span>
                Last sync:{" "}
                <span className="font-semibold text-white">
                  {summary?.latest?.finishedAt
                    ? new Date(summary.latest.finishedAt).toLocaleString()
                    : "Not yet synced"}
                </span>
              </span>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            {products.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-white/10 px-4 py-8 text-sm text-[var(--color-soft)]">
                No products are in Convex yet. Run `POST /api/feed/sync` or call
                the sync action to load the live Vanpella feed.
              </div>
            ) : null}
            {products.map((product) => (
              <div
                key={product._id}
                className="rounded-[24px] border border-white/6 bg-black/18 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-white">{product.name}</h2>
                  <span className="rounded-full border border-white/8 px-3 py-1 text-xs uppercase tracking-[0.14em] text-[var(--color-soft)]">
                    {product.sku}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-white/78 sm:grid-cols-4">
                  <div className="rounded-2xl bg-white/3 px-3 py-3">
                    {product.referenceImages.length} refs
                  </div>
                  <div className="rounded-2xl bg-white/3 px-3 py-3">
                    {product.currency ?? "EUR"} {product.retailPrice ?? "-"}
                  </div>
                  <div className="rounded-2xl bg-white/3 px-3 py-3">
                    {product.promptContext.polarized ? "Polarized" : "Standard"}
                  </div>
                  <div className="rounded-2xl bg-white/3 px-3 py-3">
                    {product.supportedLocales.length} locales
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-[var(--color-soft)]">
                  {product.descriptions.short ?? product.descriptions.long ?? "No description"}
                </p>
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
