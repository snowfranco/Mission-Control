"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AgentShape } from "@/components/shapes";
import { SLOT_STATUS_ORDER, type Slot } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Kanban board over registry/portfolio.yaml slots. Read-only by design:
 * status changes come from agents, not the operator, so there is no
 * drag-and-drop and no write path here.
 */

/**
 * The slot schema has no target-date field today, so this returns null
 * and the card reads "not dated". Checked defensively so a future
 * target_date field renders without a code change.
 */
function targetDate(slot: Slot): string | null {
  const raw = slot as unknown as Record<string, unknown>;
  const value = raw["target_date"] ?? raw["target"];
  return typeof value === "string" && value !== "[GAP]" ? value : null;
}

/** Whole days between an ISO timestamp and now; null when unusable. */
function daysAgo(iso?: string): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return null;
  return Math.max(0, Math.floor((Date.now() - t) / 86_400_000));
}

function LaneMark({ lane }: { lane?: string }) {
  if (lane === "helix") {
    return <AgentShape agent="helix" size="sm" />;
  }
  if (lane === "split") {
    return (
      <span className="flex shrink-0 items-center gap-1.5">
        <AgentShape agent="helix" size="sm" />
        <span className="font-mono text-[10px] text-muted-foreground">
          + claude code
        </span>
      </span>
    );
  }
  if (lane === "claude_code") {
    // Claude Code is not one of the nine agents, so no glyph: a chip only.
    return (
      <Badge
        variant="outline"
        className="shrink-0 border-line font-mono text-[10px]"
      >
        claude code lane
      </Badge>
    );
  }
  if (lane) {
    // Unknown lane value: show the literal rather than guess a glyph.
    return (
      <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
        {lane}
      </span>
    );
  }
  return null;
}

function SlotCard({ slot }: { slot: Slot }) {
  const gate = slot.next_gate ?? "[GAP]";
  const target = targetDate(slot);
  const days = daysAgo(slot.last_activity);
  return (
    <Card className="gap-0 border-line bg-panel p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[10px] text-muted-foreground">
          slot {slot.slot}
        </span>
        <LaneMark lane={slot.build_lane} />
      </div>
      <p className="mt-1 text-sm font-medium">{slot.name}</p>
      <p
        className={cn(
          "mt-2 text-xs",
          gate === "[GAP]" && "text-muted-foreground",
        )}
      >
        {gate}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
        {target ? (
          <span className="text-foreground">target {target}</span>
        ) : (
          <span>not dated</span>
        )}
        {days === null ? (
          <span>no activity data</span>
        ) : (
          <span>activity {days}d ago</span>
        )}
      </div>
    </Card>
  );
}

function Column({ status, slots }: { status: string; slots: Slot[] }) {
  return (
    <div className="min-w-[210px] flex-1">
      <div className="flex items-baseline justify-between border-b border-line pb-2">
        <span className="text-sm font-medium">{status}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {slots.length}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {slots.map((slot) => (
          <SlotCard key={`${slot.slot}-${slot.slug ?? slot.name}`} slot={slot} />
        ))}
      </div>
    </div>
  );
}

export function PipelineBoard({ slots }: { slots: Slot[] | null }) {
  if (slots === null) {
    return (
      <div className="space-y-8">
        <h1 className="text-lg font-medium">Pipeline</h1>
        <p className="font-mono text-sm text-destructive">
          Cannot read registry/portfolio.yaml: file not found
        </p>
      </div>
    );
  }

  const bySlotNumber = (a: Slot, b: Slot) => a.slot - b.slot;
  const columns = SLOT_STATUS_ORDER.map((status) => ({
    status: status as string,
    slots: slots.filter((s) => s.status === status).sort(bySlotNumber),
  }));
  const other = slots
    .filter(
      (s) => !(SLOT_STATUS_ORDER as readonly string[]).includes(s.status),
    )
    .sort(bySlotNumber);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-medium">Pipeline</h1>
      {slots.length === 0 && (
        <p className="font-mono text-sm text-muted-foreground">
          slots: [] in registry/portfolio.yaml. Confirmed candidates sit in
          the file&apos;s proposal comment block until the operator moves them
          into slots:.
        </p>
      )}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {columns.map((col) => (
          <Column key={col.status} status={col.status} slots={col.slots} />
        ))}
        {other.length > 0 && <Column status="other" slots={other} />}
      </div>
    </div>
  );
}
