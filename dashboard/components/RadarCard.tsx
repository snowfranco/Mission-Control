"use client";

import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentShape } from "@/components/shapes";
import { cn } from "@/lib/utils";

/** One evidence link from a Torus card: the url plus its why sentence. */
export type RadarEvidence = {
  url: string | null;
  why: string;
};

/**
 * One opportunity card parsed out of a reports/torus/*.md file. Every
 * field except id tolerates absence: Torus writes the schema in
 * agents/torus/OVERLAY.md, but the parser never assumes it did.
 */
export type RadarOpportunity = {
  id: string;
  /** Bare filename inside reports/torus/, for the artifact path. */
  reportFilename: string;
  source: string | null;
  oneLineThesis: string | null;
  whyNow: string | null;
  noveltyScore: number | null;
  fitScore: number | null;
  relatedProjects: string[];
  cardClass: string | null;
  suggestedNext: string | null;
  evidence: RadarEvidence[];
};

const CLASS_LABELS: Record<string, string> = {
  new: "new",
  extends_existing: "extends existing",
  revive_candidate: "revive candidate",
  killed_recheck: "killed recheck",
};

const TABS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "extends_existing", label: "Extends existing" },
  { value: "revive_candidate", label: "Revive candidate" },
  { value: "killed_recheck", label: "Killed recheck" },
];

function ScoreBar({
  label,
  value,
  fillClass,
}: {
  label: string;
  value: number | null;
  fillClass: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 shrink-0 font-mono text-[10px] text-muted-foreground">
        {label}
      </span>
      <div className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-line">
        {value !== null && (
          <div
            className={cn("h-full rounded-full", fillClass)}
            style={{ width: `${value}%` }}
          />
        )}
      </div>
      <span className="w-8 shrink-0 text-right font-mono text-[10px] text-muted-foreground">
        {value !== null ? value : "n/a"}
      </span>
    </div>
  );
}

function OpportunityCard({ card }: { card: RadarOpportunity }) {
  const [showEvidence, setShowEvidence] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<"routed" | "dismissed" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const act = useCallback(
    async (route: boolean) => {
      setBusy(true);
      setError(null);
      const subjectBase = card.oneLineThesis ?? card.id;
      const res = await fetch("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          kind: "radar_route",
          agent: "torus",
          subject: (route ? "Route to Prism: " : "Dismiss: ") + subjectBase,
          artifact: `reports/torus/${card.reportFilename}`,
          decision: route ? "go" : "no_go",
        }),
      }).catch((e: Error) => ({ ok: false, statusText: e.message }) as const);
      setBusy(false);
      if (res instanceof Response && res.ok) {
        setDone(route ? "routed" : "dismissed");
      } else if (res instanceof Response) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(body?.error ?? `POST /api/decisions failed: ${res.status}`);
      } else {
        setError(`POST /api/decisions failed: ${res.statusText}`);
      }
    },
    [card.id, card.oneLineThesis, card.reportFilename],
  );

  const classLabel = card.cardClass
    ? (CLASS_LABELS[card.cardClass] ?? card.cardClass)
    : null;

  return (
    <Card className="gap-0 border-line bg-panel p-4">
      <div className="flex flex-wrap items-start gap-3">
        <AgentShape agent="torus" size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-sm">{card.oneLineThesis ?? card.id}</p>
          {card.whyNow && (
            <p className="mt-1 text-xs text-muted-foreground">
              <span className="font-mono text-[10px] uppercase">why now</span>{" "}
              {card.whyNow}
            </p>
          )}
        </div>
        {classLabel && (
          <Badge variant="outline" className="font-mono text-[10px] uppercase">
            {classLabel}
          </Badge>
        )}
      </div>

      <div className="mt-3 space-y-1.5">
        <ScoreBar
          label="novelty"
          value={card.noveltyScore}
          fillClass="bg-agent-torus/70"
        />
        <ScoreBar
          label="fit"
          value={card.fitScore}
          fillClass={
            card.fitScore !== null && card.fitScore >= 50
              ? "bg-attn"
              : "bg-muted-foreground"
          }
        />
      </div>

      {card.relatedProjects.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {card.relatedProjects.map((slug) => (
            <Badge
              key={slug}
              variant="outline"
              className="font-mono text-[10px]"
            >
              {slug}
            </Badge>
          ))}
        </div>
      )}

      <Separator className="my-3 bg-line" />

      <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
        <dt>id</dt>
        <dd className="break-all">{card.id}</dd>
        <dt>report</dt>
        <dd className="break-all">reports/torus/{card.reportFilename}</dd>
        {card.source && (
          <>
            <dt>source</dt>
            <dd className="break-all">
              <a
                href={card.source}
                target="_blank"
                rel="noreferrer"
                className="underline-offset-2 hover:text-foreground hover:underline"
              >
                {card.source}
              </a>
            </dd>
          </>
        )}
        {card.suggestedNext && (
          <>
            <dt>suggested</dt>
            <dd>{card.suggestedNext}</dd>
          </>
        )}
      </dl>

      {card.evidence.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowEvidence((v) => !v)}
            className="font-mono text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {showEvidence
              ? "hide evidence"
              : `evidence (${card.evidence.length})`}
          </button>
          {showEvidence && (
            <ul className="mt-2 space-y-1.5">
              {card.evidence.map((ev, i) => (
                <li key={i} className="ml-4 text-xs text-muted-foreground">
                  {ev.url && (
                    <a
                      href={ev.url}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all font-mono underline-offset-2 hover:text-foreground hover:underline"
                    >
                      {ev.url}
                    </a>
                  )}
                  {ev.url && ev.why && " "}
                  {ev.why}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          disabled={busy || done !== null}
          onClick={() => act(true)}
          className="h-8"
        >
          Route to Prism
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={busy || done !== null}
          onClick={() => act(false)}
          className="h-8 border-line"
        >
          Dismiss
        </Button>
        {done && (
          <span className="font-mono text-xs text-muted-foreground">
            {done}
          </span>
        )}
        {error && (
          <span className="font-mono text-xs text-destructive">{error}</span>
        )}
      </div>
    </Card>
  );
}

export function RadarPanel({ cards }: { cards: RadarOpportunity[] }) {
  const [tab, setTab] = useState("all");

  const visible =
    tab === "all" ? cards : cards.filter((c) => c.cardClass === tab);

  const countFor = (value: string) =>
    value === "all"
      ? cards.length
      : cards.filter((c) => c.cardClass === value).length;

  if (cards.length === 0) {
    return (
      <div>
        <h1 className="text-lg font-medium">Radar</h1>
        <p className="mt-4 font-mono text-sm text-muted-foreground">
          No opportunities scouted yet. Torus writes daily reports to
          reports/torus/ at 07:00 America/Toronto when the scheduler trigger
          is enabled.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-medium">Radar</h1>
      <Tabs value={tab} onValueChange={setTab} className="mt-4">
        <div className="overflow-x-auto">
          <TabsList>
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
                <span className="font-mono text-[10px] text-muted-foreground">
                  {countFor(t.value)}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
      {visible.length === 0 ? (
        <p className="mt-4 font-mono text-sm text-muted-foreground">
          No cards in this class.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {visible.map((card) => (
            <OpportunityCard
              key={`${card.reportFilename}:${card.id}`}
              card={card}
            />
          ))}
        </div>
      )}
    </div>
  );
}
