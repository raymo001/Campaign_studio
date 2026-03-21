type PanelProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
  tone?: "default" | "muted";
};

export function Panel({
  eyebrow,
  title,
  description,
  children,
  tone = "default",
}: PanelProps) {
  return (
    <section
      className={`rounded-[28px] border p-5 sm:p-6 ${
        tone === "muted" ? "panel-muted" : "panel"
      }`}
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      {title ? (
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-soft)]">
          {description}
        </p>
      ) : null}
      {children}
    </section>
  );
}
