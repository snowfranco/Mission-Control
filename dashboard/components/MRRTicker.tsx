import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type SlotContribution = {
  slot: number;
  name: string;
  mrrCurrentUsd: number;
  mrrTargetUsd: number | null;
};

export type MRRTickerProps = {
  currentUsd: number;
  targetUsd: number;
  /** ISO date, e.g. 2026-12-31 */
  deadline: string | null;
  slots: SlotContribution[];
};

function weeksRemaining(deadline: string | null): number | null {
  if (!deadline) return null;
  const end = new Date(`${deadline}T23:59:59-05:00`).getTime();
  const now = Date.now();
  if (Number.isNaN(end)) return null;
  return Math.max(0, Math.floor((end - now) / (7 * 24 * 60 * 60 * 1000)));
}

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/**
 * The north-star ribbon. A thin thread across the top of every page,
 * filling from $0 to the target. At $0 it is nearly empty. That is honest.
 */
export function MRRTicker({
  currentUsd,
  targetUsd,
  deadline,
  slots,
}: MRRTickerProps) {
  const pct =
    targetUsd > 0 ? Math.min(100, (currentUsd / targetUsd) * 100) : 0;
  const weeks = weeksRemaining(deadline);

  const bar = (
    <div className="h-1.5 w-full bg-line/60" aria-hidden>
      <div
        className="h-full bg-attn transition-[width] duration-700"
        style={{ width: `calc(${pct}% + 2px)` }}
      />
    </div>
  );

  return (
    <div className="w-full">
      {slots.length > 0 ? (
        <Tooltip>
          <TooltipTrigger asChild>{bar}</TooltipTrigger>
          <TooltipContent
            side="bottom"
            align="start"
            className="font-mono text-xs"
          >
            <div className="space-y-1">
              {slots.map((s) => (
                <div key={s.slot} className="flex justify-between gap-6">
                  <span>
                    slot {s.slot} {s.name}
                  </span>
                  <span>
                    {usd(s.mrrCurrentUsd)} /{" "}
                    {s.mrrTargetUsd === null ? "no target" : usd(s.mrrTargetUsd)}
                  </span>
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      ) : (
        bar
      )}
      <div className="flex items-baseline justify-between px-4 py-2 sm:px-6">
        <span className="font-mono text-xs text-muted-foreground">
          <span className="text-attn">{usd(currentUsd)}</span> of{" "}
          {usd(targetUsd)} target
          {weeks !== null ? ` · ${weeks} weeks remaining` : ""}
        </span>
        <span className="font-sans text-xs font-medium tracking-[0.25em] text-muted-foreground">
          MISSION CONTROL
        </span>
      </div>
    </div>
  );
}
