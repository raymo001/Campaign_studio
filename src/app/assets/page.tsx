import { Panel } from "@/components/panel";

export default function AssetsPage() {
  return (
    <div className="px-5 py-5 sm:px-8 lg:px-10">
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel
          eyebrow="Asset Library"
          title="Assets"
          description="The library should stay visual first: variants, approvals, export states, and reuse."
        >
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[24px] border border-white/6 bg-black/18 p-3"
              >
                <div className="aspect-[4/5] rounded-[18px] bg-[linear-gradient(180deg,rgba(22,71,61,0.35),rgba(255,255,255,0.04))]" />
                <div className="mt-3 flex items-center justify-between text-sm text-white/88">
                  <span>Asset {index + 1}</span>
                  <span className="text-xs uppercase tracking-[0.14em] text-[var(--color-soft)]">
                    4:5
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          eyebrow="Export Pack"
          title="What ships together"
          description="Approved exports should carry media plus copy payloads and lineage metadata."
        >
          <div className="mt-6 grid gap-3">
            {[
              "Approved media",
              "Captions",
              "Headlines",
              "CTA copy",
              "Manifest JSON",
              "Product links",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-dashed border-white/10 px-4 py-3 text-sm text-white/82"
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
