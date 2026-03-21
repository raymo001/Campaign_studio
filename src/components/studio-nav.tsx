"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNavigation } from "@/lib/navigation";

export function StudioNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r border-white/6 bg-[#0a0d0c] lg:flex lg:w-[88px] lg:flex-col lg:items-center lg:py-5">
      <div className="flex h-full w-full flex-col items-center justify-between">
        <div className="flex flex-col items-center gap-5">
          <Link
            href="/"
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-white shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
          >
            <span className="display text-xl leading-none">V</span>
          </Link>

          <nav className="flex flex-col items-center gap-2">
            {primaryNavigation.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  aria-label={item.label}
                  className={`group flex h-12 w-12 items-center justify-center rounded-2xl border transition ${
                    active
                      ? "border-[rgba(58,147,122,0.7)] bg-[rgba(31,102,86,0.42)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      : "border-transparent bg-transparent text-white/44 hover:border-white/8 hover:bg-white/[0.03] hover:text-white/82"
                  }`}
                >
                  <NavIcon type={item.icon} />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-px bg-white/8" />
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-black/35 text-sm text-white/88">
            N
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavIcon({ type }: { type: (typeof primaryNavigation)[number]["icon"] }) {
  const className = "h-[18px] w-[18px]";

  switch (type) {
    case "grid":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <rect x="4" y="4" width="6" height="6" rx="1.5" />
          <rect x="14" y="4" width="6" height="6" rx="1.5" />
          <rect x="4" y="14" width="6" height="6" rx="1.5" />
          <rect x="14" y="14" width="6" height="6" rx="1.5" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
        </svg>
      );
    case "cube":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="m12 3 7 4v10l-7 4-7-4V7l7-4Z" />
          <path d="m12 12 7-4" />
          <path d="m12 12-7-4" />
          <path d="M12 12v9" />
        </svg>
      );
    case "image":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <circle cx="8.5" cy="9" r="1.5" />
          <path d="m21 16-5.5-5.5L7 19" />
        </svg>
      );
    case "stack":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="m12 4 8 4-8 4-8-4 8-4Z" />
          <path d="m4 12 8 4 8-4" />
          <path d="m4 16 8 4 8-4" />
        </svg>
      );
    case "droplet":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M12 3c3.5 4 6 7 6 10a6 6 0 0 1-12 0c0-3 2.5-6 6-10Z" />
        </svg>
      );
    case "sliders":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M4 6h16" />
          <path d="M4 18h16" />
          <path d="M8 6v8" />
          <path d="M16 10v8" />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v18H7.5A2.5 2.5 0 0 0 5 22Z" />
          <path d="M5 4.5V22" />
          <path d="M9 7h6" />
          <path d="M9 11h6" />
        </svg>
      );
  }
}
