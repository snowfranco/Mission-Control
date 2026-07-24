import {
  appendDecision,
  nextDecisionId,
  readDecisions,
  torontoISO,
} from "@/lib/fs";
import type { DecisionCard } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const cards = await readDecisions();
  return Response.json({ ok: true, data: cards });
}

type ResolveBody = {
  action: "resolve";
  id: string;
  decision: string;
  note?: string;
};

type CreateBody = {
  action: "create";
  kind: string;
  agent: string;
  subject: string;
  artifact?: string;
  options?: string[];
  note?: string;
};

/**
 * POST appends to queues/decisions.jsonl. Two actions:
 * - resolve: the operator decided a pending card. Appends a new line
 *   with the same id, status "decided", the decision, and the note.
 * - create: a panel action (radar route/dismiss, frameshift approve/
 *   revise/reject) raises a new card for the record.
 * Append-only both ways; nothing is edited in place.
 */
export async function POST(request: Request) {
  let body: ResolveBody | CreateBody;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "Request body is not valid JSON" },
      { status: 400 },
    );
  }

  if (body.action === "resolve") {
    if (!body.id || !body.decision) {
      return Response.json(
        { ok: false, error: "resolve requires id and decision" },
        { status: 400 },
      );
    }
    const cards = await readDecisions();
    const pending = cards.find((c) => c.id === body.id);
    if (!pending) {
      return Response.json(
        { ok: false, error: `No card with id ${body.id} in queues/decisions.jsonl` },
        { status: 404 },
      );
    }
    const already = cards.some(
      (c) => c.id === body.id && c.status === "decided",
    );
    if (already) {
      return Response.json(
        { ok: false, error: `Card ${body.id} is already decided` },
        { status: 409 },
      );
    }
    const now = torontoISO();
    const resolution: DecisionCard = {
      ...pending,
      ts: now,
      status: "decided",
      decision: body.decision,
      decided_ts: now,
      note: body.note?.trim() ? body.note.trim() : null,
    };
    await appendDecision(resolution);
    return Response.json({ ok: true, data: resolution });
  }

  if (body.action === "create") {
    if (!body.kind || !body.agent || !body.subject) {
      return Response.json(
        { ok: false, error: "create requires kind, agent, and subject" },
        { status: 400 },
      );
    }
    const card: DecisionCard = {
      id: await nextDecisionId(),
      ts: torontoISO(),
      kind: body.kind,
      agent: body.agent,
      subject: body.subject,
      artifact: body.artifact ?? null,
      options: body.options ?? ["go", "no_go", "park", "revise"],
      status: "pending",
      decision: null,
      decided_ts: null,
      note: body.note?.trim() ? body.note.trim() : null,
    };
    await appendDecision(card);
    return Response.json({ ok: true, data: card });
  }

  return Response.json(
    { ok: false, error: 'action must be "resolve" or "create"' },
    { status: 400 },
  );
}
