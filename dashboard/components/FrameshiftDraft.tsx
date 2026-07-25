"use client";

import { useCallback, useState } from "react";
import { marked } from "marked";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AgentShape } from "@/components/shapes";
import type { DecisionCard } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * One staged Cardioid draft, parsed on the server (app/frameshift/page.tsx)
 * from reports/cardioid/<filename>. Missing sections arrive as null.
 */
export type ParsedDraft = {
  filename: string;
  /** ISO mtime from listReports. */
  mtime: string;
  topic: string;
  substack: string | null;
  linkedin: string | null;
  editorsNotes: string | null;
  schedule: string | null;
  metadata: string | null;
};

const MD_CLASS =
  "text-sm leading-relaxed [&>*:first-child]:mt-0 [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:mt-2 [&_blockquote]:border-l-2 [&_blockquote]:border-line [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_code]:font-mono [&_code]:text-xs [&_h1]:mt-4 [&_h1]:text-sm [&_h1]:font-medium [&_h2]:mt-4 [&_h2]:text-sm [&_h2]:font-medium [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-medium [&_hr]:my-4 [&_hr]:border-line [&_img]:max-w-full [&_li]:mt-1 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mt-2 [&_pre]:mt-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-field [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-xs [&_strong]:font-medium [&_table]:mt-2 [&_table]:block [&_table]:overflow-x-auto [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5";

function Markdown({ source }: { source: string }) {
  // Drafts are the operator's own repo content: sanitization is not required.
  const html = marked.parse(source, { async: false }) as string;
  return (
    <div className={MD_CLASS} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

function VersionTab({ body, label }: { body: string | null; label: string }) {
  if (body === null) {
    return (
      <p className="font-mono text-xs text-muted-foreground">
        Section missing: {label}
      </p>
    );
  }
  return <Markdown source={body} />;
}

function DraftCard({ draft }: { draft: ParsedDraft }) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<DecisionCard | null>(null);
  const [showMeta, setShowMeta] = useState(false);

  const act = useCallback(
    async (kind: string, decision: string, includeNote: boolean) => {
      setBusy(true);
      setError(null);
      const body: Record<string, unknown> = {
        action: "create",
        kind,
        agent: "cardioid",
        subject: `Publish: ${draft.topic}`,
        artifact: `reports/cardioid/${draft.filename}`,
        decision,
      };
      if (includeNote && note.trim()) body.note = note.trim();
      const res = await fetch("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).catch((e: Error) => ({ ok: false, statusText: e.message }) as const);
      setBusy(false);
      if (res instanceof Response && res.ok) {
        const parsed = (await res.json()) as { ok: true; data: DecisionCard };
        setDone(parsed.data);
      } else if (res instanceof Response) {
        const parsed = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(parsed?.error ?? `POST /api/decisions failed: ${res.status}`);
      } else {
        setError(`POST /api/decisions failed: ${res.statusText}`);
      }
    },
    [draft.filename, draft.topic, note],
  );

  const acted = done !== null;

  return (
    <Card className="gap-0 border-line bg-panel p-0">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <AgentShape agent="cardioid" size="sm" />
        <Badge
          variant="outline"
          className={cn(
            "font-mono text-[10px] uppercase",
            !acted && "border-attn/60 text-attn",
          )}
        >
          draft
        </Badge>
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {draft.topic}
        </span>
        <span className="max-w-full break-all font-mono text-xs text-muted-foreground">
          {draft.filename} · {draft.mtime.slice(0, 10)}
        </span>
      </div>
      <Separator className="bg-line" />
      <div className="px-4 py-4">
        <Tabs defaultValue="substack">
          <TabsList className="bg-field">
            <TabsTrigger value="substack" className="px-3">
              Substack
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="px-3">
              LinkedIn
            </TabsTrigger>
          </TabsList>
          <TabsContent value="substack" className="mt-2">
            <VersionTab body={draft.substack} label="## Substack version" />
          </TabsContent>
          <TabsContent value="linkedin" className="mt-2">
            <VersionTab body={draft.linkedin} label="## LinkedIn version" />
          </TabsContent>
        </Tabs>
        {draft.editorsNotes !== null && (
          <div className="mt-4 rounded-md border border-line bg-muted p-3">
            <h3 className="text-xs font-medium text-muted-foreground">
              {"Editor's notes"}
            </h3>
            <div className="mt-1">
              <Markdown source={draft.editorsNotes} />
            </div>
          </div>
        )}
        {draft.schedule !== null && (
          <div className="mt-4">
            <h3 className="text-xs font-medium text-muted-foreground">
              Schedule recommendation
            </h3>
            <p className="mt-1 break-words whitespace-pre-wrap font-mono text-xs">
              {draft.schedule}
            </p>
          </div>
        )}
        {draft.metadata !== null && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowMeta((v) => !v)}
              className="font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {showMeta ? "metadata: hide" : "metadata: show"}
            </button>
            {showMeta && (
              <pre className="mt-2 break-words whitespace-pre-wrap rounded-md border border-line bg-field p-3 font-mono text-xs text-muted-foreground">
                {draft.metadata}
              </pre>
            )}
          </div>
        )}
        <Separator className="my-4 bg-line" />
        <div className="space-y-2">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={busy || acted}
            placeholder="note: required for revise, optional for reject"
            className="min-h-16 border-line bg-field font-mono text-xs"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              disabled={busy || acted}
              onClick={() => act("publish_approval", "go", false)}
              className="h-8"
            >
              Approve to publish
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy || acted || !note.trim()}
              onClick={() => act("publish_revise", "revise", true)}
              className="h-8 border-line"
            >
              Revise
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy || acted}
              onClick={() => act("publish_reject", "no_go", true)}
              className="h-8 border-line"
            >
              Reject
            </Button>
            {done && (
              <span className="font-mono text-xs text-muted-foreground">
                Recorded {done.id}: {done.kind} · {done.decision}
              </span>
            )}
            {error && (
              <span className="font-mono text-xs text-destructive">
                {error}
              </span>
            )}
          </div>
          <p className="font-mono text-[10px] text-muted-foreground">
            Records for Sphere. Nothing publishes from this panel.
          </p>
        </div>
      </div>
    </Card>
  );
}

export function FrameshiftFeed({ drafts }: { drafts: ParsedDraft[] }) {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-lg font-medium">Frameshift</h1>
        {drafts.length === 0 ? (
          <p className="mt-4 font-mono text-sm text-muted-foreground">
            No drafts staged. Cardioid writes to reports/cardioid/ on ship
            events and the weekly Frameshift cadence.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {drafts.map((draft) => (
              <DraftCard key={draft.filename} draft={draft} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
