import { isAgentSlug, listReports, readReport } from "@/lib/fs";

export const dynamic = "force-dynamic";

/**
 * GET /api/reports/<agent>           -> latest reports, newest first,
 *                                       content included (limit 20)
 * GET /api/reports/<agent>?file=x.md -> one report's raw markdown
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ agent: string }> },
) {
  const { agent } = await params;
  if (!isAgentSlug(agent)) {
    return Response.json(
      { ok: false, error: `Unknown agent: ${agent}` },
      { status: 404 },
    );
  }

  const url = new URL(request.url);
  const file = url.searchParams.get("file");
  if (file) {
    const content = await readReport(agent, file);
    if (content === null) {
      return Response.json(
        { ok: false, error: `Cannot read reports/${agent}/${file}: file not found` },
        { status: 404 },
      );
    }
    return Response.json({ ok: true, data: { agent, filename: file, content } });
  }

  const limit = Math.min(
    Number.parseInt(url.searchParams.get("limit") ?? "20", 10) || 20,
    50,
  );
  const files = (await listReports(agent)).slice(0, limit);
  const withContent = await Promise.all(
    files.map(async (f) => ({
      ...f,
      content: (await readReport(agent, f.filename)) ?? "",
    })),
  );
  return Response.json({ ok: true, data: withContent });
}
