"use client";

import { marked } from "marked";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AgentShape } from "@/components/shapes";
import { cn } from "@/lib/utils";

/** A Möbius report loaded by the server page, plain data only. */
export type ReportView = {
  filename: string;
  /** ISO mtime from listReports. */
  mtime: string;
  content: string;
};

/** One portfolio.yaml slot, flattened server-side to plain values. */
export type SlotRow = {
  slot: number;
  name: string;
  status: string;
  /** Whole days since last_activity, null when the field is missing or unparsable. */
  daysSinceActivity: number | null;
  /** last_activity date part (YYYY-MM-DD), null when missing. */
  lastActivity: string | null;
  nextGate: string;
};

export type PortfolioHealthProps = {
  /** False when registry/portfolio.yaml could not be read. */
  portfolioReadable: boolean;
  slots: SlotRow[];
  sentinel: ReportView | null;
  drift: ReportView | null;
};

/** A slot is stalled when its last activity is older than this many days. */
const STALL_DAYS = 14;

/** Markdown styling via arbitrary variants; no prose plugin in this app. */
const MD_CLASS =
  "overflow-x-auto text-sm " +
  "[&_h1]:mt-4 [&_h1]:text-base [&_h1]:font-medium " +
  "[&_h2]:mt-4 [&_h2]:text-sm [&_h2]:font-medium " +
  "[&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-medium " +
  "[&_p]:mt-2 [&_p]:text-sm " +
  "[&_ul]:mt-2 [&_ol]:mt-2 [&_li]:ml-4 [&_li]:mt-1 " +
  "[&_ul>li]:list-disc [&_ol>li]:list-decimal " +
  "[&_code]:font-mono [&_code]:text-xs " +
  "[&_pre]:mt-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-field [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-xs " +
  "[&_blockquote]:mt-2 [&_blockquote]:border-l-2 [&_blockquote]:border-line [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground " +
  "[&_table]:mt-2 [&_table]:font-mono [&_table]:text-xs " +
  "[&_th]:border [&_th]:border-line [&_th]:px-2 [&_th]:py-1 [&_th]:text-left " +
  "[&_td]:border [&_td]:border-line [&_td]:px-2 [&_td]:py-1 " +
  "[&_a]:underline [&_strong]:font-medium [&_hr]:my-4 [&_hr]:border-line";

/** ISO mtime to "YYYY-MM-DD HH:mm" for the byline. */
function fmtMtime(iso: string): string {
  return iso.slice(0, 16).replace("T", " ");
}

function ReportCard({
  report,
  glyph = false,
}: {
  report: ReportView;
  glyph?: boolean;
}) {
  return (
    <Card className="gap-0 border-line bg-panel p-4">
      <div className="flex flex-wrap items-center gap-3">
        {glyph && <AgentShape agent="mobius" size="sm" />}
        <span className="min-w-0 break-all font-mono text-xs text-muted-foreground">
          reports/mobius/{report.filename} · {fmtMtime(report.mtime)}
        </span>
      </div>
      <Separator className="my-3 bg-line" />
      {/* Reports are the operator's own repo content, so sanitization is not required. */}
      <div
        className={MD_CLASS}
        dangerouslySetInnerHTML={{
          __html: marked.parse(report.content, { async: false }),
        }}
      />
    </Card>
  );
}

const TH_CLASS =
  "whitespace-nowrap px-3 py-2 text-left text-xs font-medium text-muted-foreground";
const TD_CLASS = "px-3 py-2 align-top font-mono text-xs";

function WipTable({
  readable,
  slots,
}: {
  readable: boolean;
  slots: SlotRow[];
}) {
  if (!readable) {
    return (
      <p className="mt-3 font-mono text-sm text-destructive">
        Cannot read registry/portfolio.yaml: file not found
      </p>
    );
  }
  return (
    <div className="mt-3 rounded-xl border border-line bg-panel">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className={TH_CLASS}>Slot</th>
              <th className={TH_CLASS}>Project</th>
              <th className={TH_CLASS}>Status</th>
              <th className={TH_CLASS}>Days since activity</th>
              <th className={TH_CLASS}>Next gate</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((s) => (
              <tr key={s.slot} className="border-b border-line last:border-b-0">
                <td className={TD_CLASS}>{s.slot}</td>
                <td className={cn(TD_CLASS, "whitespace-nowrap")}>{s.name}</td>
                <td className={TD_CLASS}>{s.status}</td>
                <td className={TD_CLASS}>{s.daysSinceActivity ?? "[GAP]"}</td>
                <td className={cn(TD_CLASS, "min-w-[220px] max-w-[420px]")}>
                  {s.nextGate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {slots.length === 0 && (
        <p className="px-3 py-2 font-mono text-xs text-muted-foreground">
          slots: [] in registry/portfolio.yaml. Nothing occupies a WIP slot
          yet.
        </p>
      )}
    </div>
  );
}

function StalledList({ slots }: { slots: SlotRow[] }) {
  const stalled = slots.filter(
    (s) => s.daysSinceActivity !== null && s.daysSinceActivity > STALL_DAYS,
  );
  if (stalled.length === 0) {
    return (
      <p className="mt-3 font-mono text-sm text-muted-foreground">
        No stalled slots.
      </p>
    );
  }
  return (
    <div className="mt-3 space-y-2">
      {stalled.map((s) => (
        <Card
          key={s.slot}
          className="flex flex-row flex-wrap items-baseline gap-x-4 gap-y-1 border-attn/60 bg-panel px-4 py-3 ring-attn/40"
        >
          <span className="text-sm font-medium text-attn">{s.name}</span>
          <span className="font-mono text-xs text-attn">
            {s.daysSinceActivity} days stalled
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            last_activity {s.lastActivity ?? "[GAP]"}
          </span>
        </Card>
      ))}
    </div>
  );
}

export function PortfolioHealth({
  portfolioReadable,
  slots,
  sentinel,
  drift,
}: PortfolioHealthProps) {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-lg font-medium">Portfolio health</h1>
        <h2 className="mt-4 text-sm font-medium text-muted-foreground">
          Weekly sentinel
        </h2>
        {sentinel ? (
          <div className="mt-3">
            <ReportCard report={sentinel} glyph />
          </div>
        ) : (
          <p className="mt-3 font-mono text-sm text-muted-foreground">
            Möbius has not produced a weekly sentinel yet. First run: Mondays
            09:00 America/Toronto when the scheduler trigger is enabled.
          </p>
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground">
          WIP status
        </h2>
        <WipTable readable={portfolioReadable} slots={slots} />
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground">Stalled</h2>
        <StalledList slots={slots} />
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground">
          Doc drift
        </h2>
        {drift ? (
          <div className="mt-3">
            <ReportCard report={drift} />
          </div>
        ) : (
          <p className="mt-3 font-mono text-sm text-muted-foreground">
            No drift report on file.
          </p>
        )}
      </section>
    </div>
  );
}
