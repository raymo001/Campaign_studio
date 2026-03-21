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
    "Campaign workspace for product-grounded image and video generation across social platforms.",
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
        <div className="grid min-h-screen lg:grid-cols-[252px_minmax(0,1fr)]">
          <StudioNav />
          <main className="min-w-0">
            <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(254,104,22,0.10),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
