import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header, HeaderError } from "@/components/Header";
import { LiveRefresh } from "@/components/LiveRefresh";
import { Sidebar } from "@/components/Sidebar";
import { readPortfolio } from "@/lib/fs";
import type { SlotContribution } from "@/components/MRRTicker";
import "./globals.css";

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const jbMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mission Control",
  description: "Operator cockpit for the Mission Control portfolio.",
};

// The repo files are the database; every render reads them fresh.
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const portfolio = await readPortfolio();

  const slots: SlotContribution[] =
    portfolio?.slots?.map((s) => ({
      slot: s.slot,
      name: s.name,
      mrrCurrentUsd: s.mrr_current_usd ?? 0,
      mrrTargetUsd:
        typeof s.mrr_target_usd === "number" ? s.mrr_target_usd : null,
    })) ?? [];

  return (
    <html
      lang="en"
      className={`${space.variable} ${jbMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full">
        <TooltipProvider delayDuration={150}>
          {/* The ribbon lives in the layout, so its refresh lives here too. */}
          <LiveRefresh watch={["registry/portfolio.yaml"]} />
          {portfolio ? (
            <Header
              currentUsd={portfolio.north_star.current_mrr_usd}
              targetUsd={portfolio.north_star.target_mrr_usd}
              deadline={portfolio.north_star.deadline}
              slots={slots}
            />
          ) : (
            <HeaderError error="Cannot read registry/portfolio.yaml: file not found" />
          )}
          <div className="flex min-h-[calc(100vh-53px)]">
            <Sidebar />
            <main className="min-w-0 flex-1">
              <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
                {children}
              </div>
            </main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
