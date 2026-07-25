import Link from "next/link";
import { AgentShape } from "@/components/shapes";
import { AGENTS, type AgentSlug } from "@/lib/agents";
import type { AgentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Status hues: working green, scheduled cyan, idle muted, error red.
 * Semantic reuse of the palette, not new colors.
 */
const STATUS_COLOR: Record<AgentStatus["status"], string> = {
  active: "var(--agent-helix)",
  scheduled: "var(--agent-sphere)",
  idle: "var(--muted-foreground)",
  error: "var(--destructive)",
};

function tsOrDash(iso: string | null | undefined): string {
  return iso ?? "-";
}

/**
 * One room in the office. The shape is the worker; the room is where
 * it stands. Sphere's room is tinted: it is the interface, not a worker.
 */
export function AgentRoom({
  slug,
  status,
}: {
  slug: AgentSlug;
  status: AgentStatus;
}) {
  const meta = AGENTS[slug];
  const isSphere = slug === "sphere";

  return (
    <Link
      href={`/agents/${slug}`}
      className={cn(
        "group flex flex-col items-center gap-3 rounded-lg border bg-panel p-6 transition-colors hover:bg-accent/40",
        isSphere ? "border-agent-sphere/40" : "border-line",
      )}
    >
      <AgentShape agent={slug} size="lg" />
      <div className="text-center">
        <div className="text-sm font-medium">{meta.name}</div>
        <div className="text-xs text-muted-foreground">
          {isSphere ? `${meta.role} · the interface` : meta.role}
        </div>
      </div>
      <div className="flex items-center gap-2 font-mono text-xs">
        <span
          aria-hidden
          className="inline-block size-1.5 rounded-full"
          style={{ backgroundColor: STATUS_COLOR[status.status] }}
        />
        <span style={{ color: STATUS_COLOR[status.status] }}>
          {status.status}
        </span>
      </div>
      <dl className="grid w-full grid-cols-[max-content_1fr] gap-x-3 gap-y-0.5 font-mono text-[10px] text-muted-foreground">
        <dt>last run</dt>
        <dd className="truncate text-right">{tsOrDash(status.last_run_iso)}</dd>
        <dt>next run</dt>
        <dd className="truncate text-right">{tsOrDash(status.next_run_iso)}</dd>
      </dl>
      {status.status === "active" && status.current_task && (
        <p className="w-full truncate font-mono text-[10px] text-foreground/80">
          {status.current_task}
        </p>
      )}
    </Link>
  );
}
