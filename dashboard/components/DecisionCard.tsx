"use client";

import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AgentShape } from "@/components/shapes";
import { isAgentSlug } from "@/lib/agents";
import { cardClass, reduceCards, splitQueue } from "@/lib/decisions";
import type { DecisionCard as DecisionCardType } from "@/lib/types";
import { cn } from "@/lib/utils";

function AgentGlyph({ agent }: { agent: string }) {
  if (isAgentSlug(agent)) {
    return <AgentShape agent={agent} size="sm" />;
  }
  // Operator-authored or unknown-source cards get a plain marker.
  return (
    <span
      aria-hidden
      className="inline-block size-2.5 rounded-full border border-line bg-muted"
    />
  );
}

function DecisionRow({
  card,
  onResolved,
}: {
  card: DecisionCardType;
  onResolved: (resolved: DecisionCardType) => void;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = card.status === "pending";

  const resolve = useCallback(
    async (decision: string) => {
      setBusy(true);
      setError(null);
      const res = await fetch("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resolve", id: card.id, decision, note }),
      }).catch((e: Error) => ({ ok: false, statusText: e.message }) as const);
      setBusy(false);
      if (res instanceof Response && res.ok) {
        const body = (await res.json()) as { ok: true; data: DecisionCardType };
        onResolved(body.data);
      } else if (res instanceof Response) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(body?.error ?? `POST /api/decisions failed: ${res.status}`);
      } else {
        setError(`POST /api/decisions failed: ${res.statusText}`);
      }
    },
    [card.id, note, onResolved],
  );

  return (
    <Card className="gap-0 border-line bg-panel p-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <AgentGlyph agent={card.agent} />
        <Badge
          variant="outline"
          className={cn(
            "font-mono text-[10px] uppercase",
            pending && "border-attn/60 text-attn",
          )}
        >
          {cardClass(card.kind)}
        </Badge>
        <span className="min-w-0 flex-1 truncate text-sm">{card.subject}</span>
        <span className="shrink-0 font-mono text-xs text-muted-foreground">
          {pending ? card.ts : `${card.decision} · ${card.decided_ts ?? ""}`}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <Separator className="mb-3 bg-line" />
          <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
            <dt>id</dt>
            <dd>{card.id}</dd>
            <dt>kind</dt>
            <dd>{card.kind}</dd>
            <dt>agent</dt>
            <dd>{card.agent}</dd>
            <dt>raised</dt>
            <dd>{card.ts}</dd>
            {card.artifact && (
              <>
                <dt>artifact</dt>
                <dd className="break-all">{card.artifact}</dd>
              </>
            )}
            {card.options && card.options.length > 0 && (
              <>
                <dt>options</dt>
                <dd>{card.options.join(" | ")}</dd>
              </>
            )}
            {card.note && (
              <>
                <dt>note</dt>
                <dd>{card.note}</dd>
              </>
            )}
          </dl>
          {pending && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="operator note (optional)"
                className="h-8 max-w-xs border-line bg-field font-mono text-xs"
              />
              <Button
                size="sm"
                disabled={busy}
                onClick={() => resolve("go")}
                className="h-8"
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => resolve("no_go")}
                className="h-8 border-line"
              >
                Reject
              </Button>
              {error && (
                <span className="font-mono text-xs text-destructive">
                  {error}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export function DecisionsQueue({
  initial,
}: {
  initial: DecisionCardType[];
}) {
  const [lines, setLines] = useState(initial);
  const { pending, recent } = splitQueue(reduceCards(lines));

  const onResolved = useCallback((resolved: DecisionCardType) => {
    // Optimistic append; the SSE-triggered refetch confirms from disk.
    setLines((prev) => [...prev, resolved]);
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-lg font-medium">Decisions</h1>
        {pending.length === 0 ? (
          <p className="mt-4 font-mono text-sm text-muted-foreground">
            No decisions pending. Nothing to do here right now.
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {pending.map((card) => (
              <DecisionRow key={card.id} card={card} onResolved={onResolved} />
            ))}
          </div>
        )}
      </section>
      {recent.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-muted-foreground">
            Recent (last 7 days)
          </h2>
          <div className="mt-3 space-y-2 opacity-80">
            {recent.map((card) => (
              <DecisionRow key={card.id} card={card} onResolved={onResolved} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
