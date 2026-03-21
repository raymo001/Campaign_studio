import { Panel } from "@/components/panel";

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
    <div className="px-5 py-5 sm:px-8 lg:px-10">
      <Panel
        eyebrow="Preset Library"
        title="Templates"
        description="Templates should be opinionated and sparse. The team should pick from high-quality defaults, not maintain dozens of near-duplicates."
      >
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templateGroups.map((group) => (
            <div
              key={group}
              className="rounded-[24px] border border-white/6 bg-[var(--color-panel-muted)] p-5"
            >
              <div className="eyebrow">Preset</div>
              <h2 className="mt-3 text-xl font-semibold text-white">{group}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--color-soft)]">
                Platform-safe zones, output ratios, prompt structure, and copy
                expectations all live here.
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
