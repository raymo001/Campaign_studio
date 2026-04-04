import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { StudioNav } from "@/components/studio-nav";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vanpella Campaign Studio",
  description:
    "Campaign creation for image and video generation across social platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--color-app)] text-[var(--color-ink)]">
        <div className="grid min-h-screen lg:grid-cols-[88px_minmax(0,1fr)]">
          <StudioNav />
          <main className="min-w-0 bg-[radial-gradient(circle_at_top,rgba(254,104,22,0.06),transparent_22%),linear-gradient(180deg,#0a0c0b_0%,#080909_100%)]">
            <div className="min-h-screen pb-28 lg:pb-0">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
