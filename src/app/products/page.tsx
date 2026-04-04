import {
  getProductSyncSummary,
  listProductsFromConvex,
} from "@/lib/convex-server";

export default async function ProductsPage() {
  const [summary, products] = await Promise.all([
    getProductSyncSummary().catch(() => null),
    listProductsFromConvex(18).catch(() => []),
  ]);

  return (
    <div className="mx-auto max-w-[1660px] px-4 py-5 sm:px-7 sm:py-6 lg:px-9">
      <div className="grid gap-6">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="eyebrow">Products</div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Product catalog.
            </h1>
            <p className="mt-4 text-base leading-7 text-white/42">
              Browse products and attach them to campaigns.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-white/32">
            <span className="rounded-full border border-white/8 px-3 py-1.5">
              {summary?.productCount ?? 0} synced
            </span>
            <span className="rounded-full border border-white/8 px-3 py-1.5">
              {summary?.latest?.finishedAt
                ? new Date(summary.latest.finishedAt).toLocaleDateString()
                : "No sync"}
            </span>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article
              key={product._id}
              className="rounded-[28px] border border-white/6 bg-white/[0.016] px-5 py-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                    {product.name}
                  </h2>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/26">
                    {product.sku}
                  </div>
                </div>
                <div className="rounded-full border border-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/30">
                  {product.currency ?? "EUR"} {product.retailPrice ?? "-"}
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-white/38">
                {product.descriptions.short ||
                  product.descriptions.long ||
                  "No synced copy."}
              </p>

              <div className="mt-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-white/30">
                <span className="rounded-full border border-white/7 px-3 py-1.5">
                  {product.referenceImages.length} refs
                </span>
                <span className="rounded-full border border-white/7 px-3 py-1.5">
                  {product.promptContext.polarized ? "Polarized" : "Standard"}
                </span>
                <span className="rounded-full border border-white/7 px-3 py-1.5">
                  {product.supportedLocales.length} locales
                </span>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
