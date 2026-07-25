import { notFound } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import { AgentShape } from "@/components/shapes";
import { Separator } from "@/components/ui/separator";
import { AGENTS, isAgentSlug } from "@/lib/agents";
import {
  listReports,
  readAgentOverlay,
  readAgentStatus,
  readHandoffs,
  readReport,
} from "@/lib/fs";

export const dynamic = "force-dynamic";

const MD_STYLES =
  "font-sans text-sm [&_h1]:mt-4 [&_h1]:text-base [&_h1]:font-medium [&_h2]:mt-4 [&_h2]:text-sm [&_h2]:font-medium [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-medium [&_p]:mt-2 [&_p]:leading-relaxed [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1 [&_pre]:mt-2 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-field [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-xs [&_code]:font-mono [&_code]:text-xs [&_a]:text-agent-sphere [&_a]:underline";

/** The repo is the operator's own; its markdown is trusted, no sanitizer. */
function Markdown({ content }: { content: string }) {
  return (
    <div
      className={MD_STYLES}
      dangerouslySetInnerHTML={{ __html: marked.parse(content, { async: false }) }}
    />
  );
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isAgentSlug(slug)) notFound();

  const meta = AGENTS[slug];
  const [status, overlay, reports, handoffs] = await Promise.all([
    readAgentStatus(slug),
    readAgentOverlay(slug),
    listReports(slug),
    readHandoffs(),
  ]);

  const recentReports = await Promise.all(
    reports.slice(0, 5).map(async (r) => ({
      ...r,
      content: (await readReport(slug, r.filename)) ?? "",
    })),
  );

  const related = handoffs
    .filter((h) => h.from === slug || h.to === slug)
    .sort((a, b) => (a.ts < b.ts ? 1 : -1))
    .slice(0, 10);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-5">
        <AgentShape agent={slug} size="lg" />
        <div>
          <h1 className="text-lg font-medium">{meta.name}</h1>
          <p className="text-sm text-muted-foreground">{meta.role}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            status: {status.status}
            {status.derived ? " (derived from scheduler.yaml)" : ""}
          </p>
        </div>
        <Link
          href="/agents"
          className="ml-auto font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          back to office
        </Link>
      </div>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground">Overlay</h2>
        <Separator className="my-3 bg-line" />
        {overlay ? (
          <Markdown content={overlay} />
        ) : (
          <p className="font-mono text-sm text-destructive">
            Cannot read agents/{slug}/OVERLAY.md: file not found
          </p>
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground">
          Recent reports
        </h2>
        <Separator className="my-3 bg-line" />
        {recentReports.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">
            No reports on file in reports/{slug}/.
          </p>
        ) : (
          <div className="space-y-2">
            {recentReports.map((r) => (
              <details
                key={r.filename}
                className="rounded-md border border-line bg-panel px-4 py-3"
              >
                <summary className="cursor-pointer font-mono text-xs">
                  {r.filename}
                  <span className="ml-3 text-muted-foreground">{r.mtime}</span>
                </summary>
                <div className="mt-3">
                  <Markdown content={r.content} />
                </div>
              </details>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground">Handoffs</h2>
        <Separator className="my-3 bg-line" />
        {related.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">
            No handoffs recorded for {meta.name} in queues/handoffs.jsonl.
          </p>
        ) : (
          <div className="space-y-2">
            {related.map((h) => (
              <div
                key={`${h.id}-${h.ts}`}
                className="rounded-md border border-line bg-panel px-4 py-3 font-mono text-xs"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground">{h.ts}</span>
                  <span>
                    {h.from} to {h.to}
                  </span>
                  <span className="ml-auto text-muted-foreground">
                    {h.status}
                  </span>
                </div>
                <p className="mt-1 text-foreground/90">{h.task}</p>
                {h.note && (
                  <p className="mt-1 text-muted-foreground">{h.note}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
