import {
  FrameshiftFeed,
  type ParsedDraft,
} from "@/components/FrameshiftDraft";
import { listReports, readReport } from "@/lib/fs";

export const dynamic = "force-dynamic";

/**
 * Cardioid's draft format (agents/cardioid/OVERLAY.md): a title line
 * "# Cardioid Draft: <topic>", then "## Substack version",
 * "## LinkedIn version", "## Editor's notes", "## Schedule
 * recommendation", "## Metadata". Parsed tolerantly: a missing or empty
 * section stays null, unknown sections are ignored, and a missing title
 * falls back to the filename.
 */
function parseDraft(
  filename: string,
  mtime: string,
  raw: string,
): ParsedDraft {
  const topicMatch = raw.match(/^# Cardioid Draft:\s*(.+)$/m);
  const topic = topicMatch?.[1]?.trim() || filename.replace(/\.md$/, "");
  const draft: ParsedDraft = {
    filename,
    mtime,
    topic,
    substack: null,
    linkedin: null,
    editorsNotes: null,
    schedule: null,
    metadata: null,
  };
  for (const chunk of raw.split(/^## /m).slice(1)) {
    const nl = chunk.indexOf("\n");
    const heading = (nl === -1 ? chunk : chunk.slice(0, nl))
      .trim()
      .toLowerCase();
    const body = (nl === -1 ? "" : chunk.slice(nl + 1).trim()) || null;
    if (heading.startsWith("substack")) draft.substack = body;
    else if (heading.startsWith("linkedin")) draft.linkedin = body;
    else if (heading.startsWith("editor")) draft.editorsNotes = body;
    else if (heading.startsWith("schedule")) draft.schedule = body;
    else if (heading.startsWith("metadata")) draft.metadata = body;
  }
  return draft;
}

export default async function FrameshiftPage() {
  const files = await listReports("cardioid");
  const drafts: ParsedDraft[] = [];
  for (const file of files) {
    const raw = await readReport("cardioid", file.filename);
    if (raw === null) continue;
    drafts.push(parseDraft(file.filename, file.mtime, raw));
  }
  return <FrameshiftFeed drafts={drafts} />;
}
