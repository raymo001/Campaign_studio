export default function BrandPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-7 lg:px-9">
      <div className="grid gap-6">
        <header className="max-w-3xl">
          <div className="eyebrow">Brand</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Brand rules and palette.
          </h1>
        </header>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <section className="rounded-[30px] border border-white/6 bg-white/[0.016] px-6 py-6">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/28">
              Palette
            </div>
            <div className="mt-5 grid gap-3">
              <ColorSwatch name="Vanpella green" value="#16473d" className="bg-[#16473d]" />
              <ColorSwatch name="Accent orange" value="#fe6816" className="bg-[#fe6816]" />
              <ColorSwatch name="Studio black" value="#090b0a" className="bg-[#090b0a]" />
            </div>
          </section>

          <section className="rounded-[30px] border border-white/6 bg-white/[0.016] px-6 py-6">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/28">
              Guardrails
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[
                "Premium brand tone",
                "Controlled copy density",
                "Premium editorial references",
                "Offer disclosure rules",
                "Localization consistency",
                "Lifestyle scene constraints",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-white/6 bg-black/14 px-4 py-4 text-sm text-white/76"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ColorSwatch({
  name,
  value,
  className,
}: {
  name: string;
  value: string;
  className: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/6 bg-black/14 p-4">
      <div className={`h-20 rounded-[18px] ${className}`} />
      <div className="mt-4 text-lg font-medium text-white">{name}</div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/28">
        {value}
      </div>
    </div>
  );
}
