import {
  RadarPanel,
  type RadarEvidence,
  type RadarOpportunity,
} from "@/components/RadarCard";
import { listReports, readReport } from "@/lib/fs";

export const dynamic = "force-dynamic";

/** How many of the newest reports/torus/ files feed the panel. */
const REPORT_LIMIT = 10;

/** The keys the Torus card schema defines (agents/torus/OVERLAY.md). */
const CARD_KEYS = new Set([
  "id",
  "source",
  "one_line_thesis",
  "why_now",
  "novelty_score",
  "fit_score",
  "related_projects",
  "card_class",
  "suggested_next",
  "evidence",
]);

const LIST_KEYS = ["related_projects", "evidence"] as const;
type ListKey = (typeof LIST_KEYS)[number];

function isListKey(key: string): key is ListKey {
  return (LIST_KEYS as readonly string[]).includes(key);
}

function toScore(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return null;
  return Math.min(100, Math.max(0, n));
}

/**
 * An evidence list item is a link with a one-sentence why. Pull the
 * first url out; whatever is left around it is the why sentence.
 */
function parseEvidence(item: string): RadarEvidence {
  const match = item.match(/https?:\/\/\S+/);
  if (!match || match.index === undefined) {
    return { url: null, why: item };
  }
  const url = match[0].replace(/[),.;:]+$/, "");
  const why = (
    item.slice(0, match.index) +
    item.slice(match.index + match[0].length)
  )
    .replace(/^[\s:,(]+/, "")
    .replace(/[\s:,)]+$/, "")
    .trim();
  return { url, why };
}

/** "[a, b]" or "a, b" or a single value; empty and "[]" give []. */
function parseInlineList(value: string): string[] {
  const inner = value.replace(/^\[/, "").replace(/\]$/, "").trim();
  if (!inner) return [];
  return inner
    .split(",")
    .map((part) => part.trim().replace(/^["']|["']$/g, ""))
    .filter((part) => part.length > 0);
}

/**
 * Tolerant parser over one report file. Cards are indented key: value
 * blocks; a block starts at a line matching /^\s*id:\s*torus-/ and runs
 * until the next one. Unknown keys and missing keys are tolerated, list
 * items (- item) attach to the last seen list key, and surrounding
 * report prose is ignored.
 */
function parseOpportunities(
  content: string,
  reportFilename: string,
): RadarOpportunity[] {
  const blocks: string[][] = [];
  let current: string[] | null = null;
  for (const line of content.split("\n")) {
    if (/^\s*id:\s*torus-/.test(line)) {
      current = [line];
      blocks.push(current);
    } else if (current) {
      current.push(line);
    }
  }

  const cards: RadarOpportunity[] = [];
  for (const block of blocks) {
    const fields: Record<string, string> = {};
    const lists: Record<ListKey, string[]> = {
      related_projects: [],
      evidence: [],
    };
    let listKey: ListKey | null = null;

    for (const line of block) {
      const kv = line.match(/^\s*([a-z_]+):\s*(.*)$/);
      if (kv && CARD_KEYS.has(kv[1])) {
        const key = kv[1];
        const value = kv[2].trim();
        if (isListKey(key)) {
          listKey = key;
          lists[key].push(...parseInlineList(value));
        } else {
          fields[key] = value;
          listKey = null;
        }
        continue;
      }
      const item = line.match(/^\s*-\s+(.*)$/);
      if (item && listKey) {
        const trimmed = item[1].trim();
        if (trimmed) lists[listKey].push(trimmed);
        continue;
      }
      // Blank lines keep the list context; any other prose line ends it.
      if (line.trim() !== "") listKey = null;
    }

    const id = fields.id;
    if (!id) continue;
    cards.push({
      id,
      reportFilename,
      source: fields.source ?? null,
      oneLineThesis: fields.one_line_thesis ?? null,
      whyNow: fields.why_now ?? null,
      noveltyScore: toScore(fields.novelty_score),
      fitScore: toScore(fields.fit_score),
      relatedProjects: lists.related_projects,
      cardClass: fields.card_class ?? null,
      suggestedNext: fields.suggested_next ?? null,
      evidence: lists.evidence.map(parseEvidence),
    });
  }
  return cards;
}

export default async function RadarPage() {
  const files = (await listReports("torus")).slice(0, REPORT_LIMIT);
  const contents = await Promise.all(
    files.map((file) => readReport("torus", file.filename)),
  );
  // Files come back newest first; cards keep document order per file.
  const cards: RadarOpportunity[] = [];
  files.forEach((file, i) => {
    const content = contents[i];
    if (content !== null) {
      cards.push(...parseOpportunities(content, file.filename));
    }
  });
  return <RadarPanel cards={cards} />;
}
