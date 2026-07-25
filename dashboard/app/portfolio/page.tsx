import {
  PortfolioHealth,
  type ReportView,
  type SlotRow,
} from "@/components/PortfolioHealth";
import { listReports, readPortfolio, readReport } from "@/lib/fs";
import type { ReportFile } from "@/lib/types";

export const dynamic = "force-dynamic";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days since an ISO timestamp, null when missing or unparsable. */
function daysSince(iso: string | undefined): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return null;
  return Math.max(0, Math.floor((Date.now() - t) / DAY_MS));
}

async function loadReport(
  file: ReportFile | undefined,
): Promise<ReportView | null> {
  if (!file) return null;
  const content = await readReport("mobius", file.filename);
  if (content === null) return null;
  return { filename: file.filename, mtime: file.mtime, content };
}

export default async function PortfolioPage() {
  const [portfolio, reports] = await Promise.all([
    readPortfolio(),
    listReports("mobius"),
  ]);

  // listReports sorts newest first, so the first match is the latest.
  const [sentinel, drift] = await Promise.all([
    loadReport(
      reports.find((f) => f.filename.toLowerCase().includes("sentinel")),
    ),
    loadReport(
      reports.find((f) => f.filename.toLowerCase().includes("drift")),
    ),
  ]);

  const slots: SlotRow[] = (portfolio?.slots ?? []).map((s) => ({
    slot: s.slot,
    name: s.name,
    status: s.status,
    daysSinceActivity: daysSince(s.last_activity),
    lastActivity: s.last_activity ? s.last_activity.slice(0, 10) : null,
    nextGate:
      typeof s.next_gate === "string" && s.next_gate ? s.next_gate : "[GAP]",
  }));

  return (
    <PortfolioHealth
      portfolioReadable={portfolio !== null}
      slots={slots}
      sentinel={sentinel}
      drift={drift}
    />
  );
}
