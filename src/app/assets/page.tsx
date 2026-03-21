export default function AssetsPage() {
  return (
    <div className="mx-auto max-w-[1700px] px-5 py-6 sm:px-7 lg:px-9">
      <div className="grid gap-6">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="eyebrow">Assets</div>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Generated media, kept visual.
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-white/30">
            {["All", "Draft", "Approved", "4:5", "9:16", "Exported"].map((item, index) => (
              <span
                key={item}
                className={`rounded-full border px-3 py-1.5 ${
                  index === 0
                    ? "border-white/12 bg-white/[0.04] text-white/72"
                    : "border-white/7 text-white/32"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </header>

        <div className="grid auto-rows-[280px] gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <article
              key={index}
              className={`relative overflow-hidden rounded-[28px] bg-[#0a0c0b] ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,71,61,0.28),rgba(255,255,255,0.02))]" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                <div>
                  <div className="text-sm font-medium text-white/88">Asset {index + 1}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/30">
                    4:5
                  </div>
                </div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/36">
                  Ready
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
