import type { DecisionCard } from "./types";

/**
 * decisions.jsonl is append-only: a resolution is a later line with the
 * same id. Reduce the log to one current line per card, newest wins.
 */
export function reduceCards(lines: DecisionCard[]): DecisionCard[] {
  const byId = new Map<string, DecisionCard>();
  for (const line of lines) {
    if (!line?.id) continue;
    const prev = byId.get(line.id);
    // Later lines override earlier ones; a decided line always beats a
    // pending one regardless of order, so a stray re-append of the
    // original card cannot resurrect a decided card.
    if (!prev || prev.status !== "decided" || line.status === "decided") {
      byId.set(line.id, line);
    }
  }
  return [...byId.values()];
}

export function splitQueue(cards: DecisionCard[]): {
  pending: DecisionCard[];
  recent: DecisionCard[];
} {
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  const pending = cards
    .filter((c) => c.status === "pending")
    .sort((a, b) => (a.ts < b.ts ? 1 : -1));
  const recent = cards
    .filter(
      (c) =>
        c.status === "decided" &&
        c.decided_ts &&
        now - new Date(c.decided_ts).getTime() < sevenDays,
    )
    .sort((a, b) => ((a.decided_ts ?? "") < (b.decided_ts ?? "") ? 1 : -1));
  return { pending, recent };
}

/** Compress a queue kind into the card class the panel shows. */
export function cardClass(kind: string): string {
  if (kind.startsWith("publish")) return "draft";
  if (kind.startsWith("watchtower") || kind === "ship_gate") return "audit";
  if (kind === "spec_review") return "spec";
  if (kind === "route_to_prism" || kind === "prism_verdict" || kind === "radar_route")
    return "bet";
  return kind;
}
