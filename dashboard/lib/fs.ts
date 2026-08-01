/**
 * File readers over the parent repo. The repo files are the database:
 * this module is the only place the dashboard touches the filesystem,
 * and appendDecision is the only write path anywhere.
 *
 * Every reader tolerates a missing file or directory (empty array or
 * null, never a throw). Callers turn null into the specific error copy
 * the panels show.
 */

import path from "node:path";
import { promises as fs } from "node:fs";
import { JSON_SCHEMA, load } from "js-yaml";
import { Cron } from "croner";
import { AGENT_SLUGS, isAgentSlug, type AgentSlug } from "./agents";
import type {
  AgentStatus,
  DecisionCard,
  HandoffRecord,
  Portfolio,
  Projects,
  ReportFile,
  Scheduler,
} from "./types";

/**
 * The dev and prod servers both run with cwd = dashboard/, a direct
 * child of the repo root. MC_REPO_ROOT overrides for anything unusual.
 */
export const REPO_ROOT = process.env.MC_REPO_ROOT
  ? path.resolve(process.env.MC_REPO_ROOT)
  : path.resolve(process.cwd(), "..");

export const repoPath = (...segments: string[]) =>
  path.join(REPO_ROOT, ...segments);

async function readTextOrNull(relPath: string): Promise<string | null> {
  try {
    return await fs.readFile(repoPath(relPath), "utf8");
  } catch {
    return null;
  }
}

/**
 * JSON_SCHEMA keeps "2026-12-31" a string instead of a Date, which is
 * what the types expect and what the UI formats.
 */
function parseYaml<T>(raw: string): T {
  return load(raw, { schema: JSON_SCHEMA }) as T;
}

export async function readPortfolio(): Promise<Portfolio | null> {
  const raw = await readTextOrNull("registry/portfolio.yaml");
  if (raw === null) return null;
  return parseYaml<Portfolio>(raw);
}

export async function readProjects(): Promise<Projects | null> {
  const raw = await readTextOrNull("registry/projects.yaml");
  if (raw === null) return null;
  return parseYaml<Projects>(raw);
}

export async function readScheduler(): Promise<Scheduler | null> {
  const raw = await readTextOrNull("schedule/scheduler.yaml");
  if (raw === null) return null;
  return parseYaml<Scheduler>(raw);
}

function parseJsonl<T>(raw: string, file: string): T[] {
  const rows: T[] = [];
  for (const [i, line] of raw.split("\n").entries()) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      rows.push(JSON.parse(trimmed) as T);
    } catch {
      // A malformed line is someone's bug, but it must not take the
      // whole queue view down with it.
      console.error(`Skipping malformed JSONL line ${i + 1} in ${file}`);
    }
  }
  return rows;
}

export async function readDecisions(): Promise<DecisionCard[]> {
  const raw = await readTextOrNull("queues/decisions.jsonl");
  if (raw === null) return [];
  return parseJsonl<DecisionCard>(raw, "queues/decisions.jsonl");
}

export async function readHandoffs(): Promise<HandoffRecord[]> {
  const raw = await readTextOrNull("queues/handoffs.jsonl");
  if (raw === null) return [];
  return parseJsonl<HandoffRecord>(raw, "queues/handoffs.jsonl");
}

export async function listReports(agent: AgentSlug): Promise<ReportFile[]> {
  const dir = repoPath("reports", agent);
  let names: string[];
  try {
    names = await fs.readdir(dir);
  } catch {
    return [];
  }
  const files: ReportFile[] = [];
  for (const filename of names) {
    if (!filename.endsWith(".md")) continue;
    try {
      const stat = await fs.stat(path.join(dir, filename));
      files.push({ agent, filename, mtime: stat.mtime.toISOString() });
    } catch {
      // File vanished between readdir and stat; skip it.
    }
  }
  files.sort((a, b) => (a.mtime < b.mtime ? 1 : -1));
  return files;
}

export async function readReport(
  agent: AgentSlug,
  filename: string,
): Promise<string | null> {
  // No traversal: a report filename is a bare name inside reports/<agent>/.
  if (filename !== path.basename(filename) || filename.startsWith(".")) {
    return null;
  }
  try {
    return await fs.readFile(repoPath("reports", agent, filename), "utf8");
  } catch {
    return null;
  }
}

/** ISO-8601 with the America/Toronto offset, per queues/README.md. */
export function torontoISO(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "longOffset",
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  const offsetRaw = get("timeZoneName"); // e.g. "GMT-04:00"
  const offset = offsetRaw.replace("GMT", "") || "-05:00";
  const hour = get("hour") === "24" ? "00" : get("hour");
  return `${get("year")}-${get("month")}-${get("day")}T${hour}:${get("minute")}:${get("second")}${offset}`;
}

/** dq-YYYYMMDD-NNN, NNN unique against every id already in the queue. */
export async function nextDecisionId(): Promise<string> {
  const today = torontoISO().slice(0, 10).replaceAll("-", "");
  const prefix = `dq-${today}-`;
  const existing = await readDecisions();
  let max = 0;
  for (const card of existing) {
    if (card.id?.startsWith(prefix)) {
      const n = Number.parseInt(card.id.slice(prefix.length), 10);
      if (Number.isFinite(n) && n > max) max = n;
    }
  }
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

export async function appendDecision(decision: DecisionCard): Promise<void> {
  const line = `${JSON.stringify(decision)}\n`;
  await fs.appendFile(repoPath("queues", "decisions.jsonl"), line, "utf8");
}

/**
 * Agent status: prefer agents/<slug>/STATUS.json when the runtime has
 * written one; otherwise derive from schedule/scheduler.yaml (any
 * enabled trigger makes the agent "scheduled", else "idle").
 */
export async function readAgentStatus(agent: AgentSlug): Promise<AgentStatus> {
  const raw = await readTextOrNull(`agents/${agent}/STATUS.json`);
  if (raw !== null) {
    try {
      return JSON.parse(raw) as AgentStatus;
    } catch {
      return {
        status: "error",
        current_task: `Cannot parse agents/${agent}/STATUS.json: invalid JSON`,
        derived: true,
      };
    }
  }
  const scheduler = await readScheduler();
  const triggers =
    scheduler?.triggers?.filter((t) => t.agent === agent && t.enabled) ?? [];
  if (triggers.length > 0) {
    const tz = scheduler?.timezone ?? "America/Toronto";
    let nextRun: string | null = null;
    for (const trigger of triggers) {
      if (!trigger.cron) continue;
      try {
        const job = new Cron(trigger.cron, { timezone: tz });
        const next = job.nextRun();
        if (next) {
          const iso = next.toISOString();
          if (!nextRun || iso < nextRun) nextRun = iso;
        }
      } catch {
        // Invalid cron expression; skip.
      }
    }
    return { status: "scheduled", next_run_iso: nextRun, derived: true };
  }
  return { status: "idle", derived: true };
}

export async function readAllAgentStatuses(): Promise<
  Record<AgentSlug, AgentStatus>
> {
  const entries = await Promise.all(
    AGENT_SLUGS.map(async (slug) => [slug, await readAgentStatus(slug)] as const),
  );
  return Object.fromEntries(entries) as Record<AgentSlug, AgentStatus>;
}

export async function readAgentOverlay(
  agent: AgentSlug,
): Promise<string | null> {
  return readTextOrNull(`agents/${agent}/OVERLAY.md`);
}

export { isAgentSlug };
