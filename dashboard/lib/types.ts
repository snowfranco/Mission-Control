/**
 * Types mirror the canonical schemas in the parent repo:
 * registry/portfolio.yaml, registry/projects.yaml (schema comments and
 * example rows), and queues/README.md (JSONL line schemas).
 *
 * Registry values can be the literal string "[GAP]" where the operator
 * has not filled a field; number-ish fields are typed to admit that.
 */

import type { AgentSlug } from "./agents";

export type { AgentSlug };

export type Gap = "[GAP]";

export type SlotStatus =
  | "validating"
  | "shaping"
  | "building"
  | "auditing"
  | "shipping"
  | "live"
  | "parked"
  | "killed";

export const SLOT_STATUS_ORDER: SlotStatus[] = [
  "validating",
  "shaping",
  "building",
  "auditing",
  "shipping",
  "live",
];

export type ProjectKind = "commercial_bet" | "personal" | "infra" | "writing";

export type BuildLane = "claude_code" | "helix" | "split";

export type NorthStar = {
  target_mrr_usd: number;
  deadline: string;
  current_mrr_usd: number;
};

export type Slot = {
  slot: number;
  slug?: string;
  name: string;
  aliases?: string[];
  kind: ProjectKind | string;
  status: SlotStatus | string;
  repo?: string;
  repo_local?: string | Gap;
  notion_page?: string | Gap;
  one_line?: string;
  commercial_line?: string | null;
  mrr_current_usd?: number;
  mrr_target_usd?: number | Gap | null;
  started?: string;
  last_activity?: string;
  next_gate?: string | Gap;
  kill_conditions?: string[] | Gap;
  keywords?: string[];
  build_lane?: BuildLane | string;
};

export type Portfolio = {
  version: number;
  last_updated: string;
  operator: string;
  north_star: NorthStar;
  wip_cap: number;
  commercial_slots_cap: number;
  slots: Slot[];
};

export type ProjectRow = {
  slug: string;
  name: string | Gap;
  aliases?: string[];
  status: "active" | "parked" | "killed" | "shipped" | Gap | string;
  kind: ProjectKind | Gap | string;
  repo?: string;
  repo_local?: string | Gap;
  one_line?: string | Gap;
  started?: string | Gap;
  killed?: string;
  kill_reason?: string;
  keywords?: string[];
};

export type Projects = {
  version: number;
  last_updated: string;
  projects: ProjectRow[];
};

/**
 * queues/decisions.jsonl line. Append-only: a resolution is a new line
 * carrying the same id with status "decided". The `note` field and the
 * dashboard-originated kinds (radar_route, publish_approval,
 * publish_revise, publish_reject) are dashboard extensions documented in
 * dashboard/README.md; queues/README.md remains the canonical base
 * schema.
 */
export type DecisionCard = {
  id: string;
  ts: string;
  kind: string;
  agent: AgentSlug | "operator" | string;
  subject: string;
  artifact?: string | null;
  options?: string[];
  status: "pending" | "decided";
  decision?: string | null;
  decided_ts?: string | null;
  note?: string | null;
};

/** queues/handoffs.jsonl line (queues/README.md). */
export type HandoffRecord = {
  id: string;
  ts: string;
  from: AgentSlug | "operator" | string;
  to: AgentSlug | string;
  task: string;
  context?: string[];
  note?: string;
  deadline?: string | null;
  status: "dispatched" | "accepted" | "returned" | string;
};

export type ReportFile = {
  agent: AgentSlug;
  filename: string;
  /** ISO mtime, newest first in listings. */
  mtime: string;
  content?: string;
};

/**
 * agents/<shape>/STATUS.json, written by the OpenClaw runtime when it
 * exists. When absent, status is derived from schedule/scheduler.yaml.
 */
export type AgentStatus = {
  status: "active" | "scheduled" | "idle" | "error";
  last_run_iso?: string | null;
  next_run_iso?: string | null;
  current_task?: string | null;
  /** True when derived from scheduler.yaml rather than read from STATUS.json. */
  derived?: boolean;
};

export type SchedulerTrigger = {
  id: string;
  agent: AgentSlug | string;
  cron: string;
  enabled: boolean;
  task: string;
};

export type Scheduler = {
  version: number;
  timezone: string;
  triggers: SchedulerTrigger[];
};

export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = { ok: false; error: string };
export type ApiResult<T> = ApiOk<T> | ApiErr;
