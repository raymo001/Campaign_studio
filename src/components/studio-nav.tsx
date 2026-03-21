"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNavigation } from "@/lib/navigation";

export function StudioNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r border-white/6 bg-black/18 px-5 py-5 lg:block">
      <div className="flex h-full flex-col rounded-[30px] border border-white/6 bg-[linear-gradient(180deg,rgba(18,25,23,0.96),rgba(9,13,12,0.98))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-orange)]">
            Vanpella
          </p>
          <div className="mt-3">
            <div className="display text-3xl leading-none text-white">
              Campaign
            </div>
            <div className="display text-3xl leading-none text-white/78">
              Studio
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--color-soft)]">
            Product-grounded creation for paid social, launches, and evergreen
            commerce campaigns.
          </p>
        </div>

        <nav className="mt-10 flex flex-1 flex-col gap-2">
          {primaryNavigation.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-[20px] px-4 py-3 transition ${
                  active
                    ? "bg-[var(--color-green)] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                    : "text-[var(--color-soft)] hover:bg-white/4 hover:text-white"
                }`}
              >
                <div className="text-sm font-semibold">{item.label}</div>
                <div className="mt-1 text-xs leading-5 opacity-80">
                  {item.short}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="rounded-[24px] border border-[var(--color-orange)]/20 bg-[var(--color-orange-soft)] p-4">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-orange)]">
            Stack
          </div>
          <p className="mt-3 text-sm leading-6 text-white/88">
            Next.js on Vercel, Convex for app state, and Cloudflare R2 for
            generated media.
          </p>
        </div>
      </div>
    </aside>
  );
}
