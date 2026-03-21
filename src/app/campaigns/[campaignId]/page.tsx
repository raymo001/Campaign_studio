import { Panel } from "@/components/panel";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;

  return (
    <div className="px-5 py-5 sm:px-8 lg:px-10">
      <div className="grid gap-4">
        <Panel
          eyebrow="Campaign Detail"
          title={campaignId.replaceAll("-", " ")}
          description="The detail route needs brief lineage, products in scope, generation batches, and approval state in one place."
        >
          <div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-4">
              <div className="rounded-[24px] border border-white/6 bg-black/18 p-5">
                <div className="eyebrow">Creative Brief</div>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/88">
                  Structured, editorial campaign focused on bold acetate forms,
                  shadow play, and confident close-ups. Prioritize premium feel
                  over heavy text overlays and generate platform-specific hooks
                  after the image set is approved.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/6 bg-black/18 p-5">
                <div className="eyebrow">Asset Review Grid</div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-[20px] border border-white/8 bg-[linear-gradient(180deg,rgba(35,100,84,0.25),rgba(255,255,255,0.03))] p-3"
                    >
                      <div className="aspect-[4/5] rounded-[16px] bg-black/20" />
                      <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-[var(--color-soft)]">
                        <span>Variant {index + 1}</span>
                        <span>{index < 2 ? "Approved" : "Draft"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[24px] border border-white/6 bg-[var(--color-panel)] p-5">
                <div className="eyebrow">Products</div>
                <div className="mt-4 grid gap-2">
                  {["The Architect Ink", "The Architect Tortoise"].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/6 bg-white/3 px-4 py-3 text-sm text-white/88"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/6 bg-[var(--color-panel)] p-5">
                <div className="eyebrow">Approval Queue</div>
                <div className="mt-4 grid gap-3">
                  {[
                    "Visual QA",
                    "Brand tone check",
                    "Offer verification",
                    "Export to platform pack",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-dashed border-white/10 px-4 py-3 text-sm text-white/78"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
