import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ribbon values are wired to registry/portfolio.yaml in the data-layer
  // step; until then the shell renders the zero state, which is also the
  // true state.
  const ribbon = {
    currentUsd: 0,
    targetUsd: 5000,
    deadline: null,
    slots: [],
  };

  return (
    <html
      lang="en"
      className={`${space.variable} ${jbMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full">
        <TooltipProvider delayDuration={150}>
          <Header {...ribbon} />
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
