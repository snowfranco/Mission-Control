"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { AgentSlug } from "@/lib/agents";
import { AgentShape } from "@/components/shapes";

type NavItem = {
  href: string;
  label: string;
  agent: AgentSlug;
};

/**
 * Panel navigation. Each panel is identified by the shape of the agent
 * that owns it: decisions are Sphere's queue, radar is Torus's report
 * stream, the pipeline board is Icosa's territory, portfolio health is
 * Möbius's ledger, the office houses everyone (Sphere anchors it), and
 * the Frameshift feed is Cardioid's stage.
 *
 * The glyphs are the agents' shapes at sm size: the shape is the byline.
 */
const NAV: NavItem[] = [
  { href: "/", label: "Decisions", agent: "sphere" },
  { href: "/radar", label: "Radar", agent: "torus" },
  { href: "/pipeline", label: "Pipeline", agent: "icosa" },
  { href: "/portfolio", label: "Portfolio", agent: "mobius" },
  { href: "/agents", label: "Agents", agent: "sphere" },
  { href: "/frameshift", label: "Frameshift", agent: "cardioid" },
];

const CONSTANTS = ["Tasks", "Docs", "Team"];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-[53px] hidden h-[calc(100vh-53px)] w-[220px] shrink-0 flex-col border-r border-line bg-sidebar sm:flex">
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              <AgentShape agent={item.agent} size="sm" muted={!active} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-line p-3">
        {CONSTANTS.map((label) => (
          <div
            key={label}
            className="cursor-default px-3 py-1.5 text-xs text-muted-foreground/60"
          >
            {label}
          </div>
        ))}
      </div>
    </aside>
  );
}
