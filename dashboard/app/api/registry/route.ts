import { readPortfolio, readProjects } from "@/lib/fs";

export const dynamic = "force-dynamic";

export async function GET() {
  const [portfolio, projects] = await Promise.all([
    readPortfolio(),
    readProjects(),
  ]);
  if (portfolio === null) {
    return Response.json(
      { ok: false, error: "Cannot read registry/portfolio.yaml: file not found" },
      { status: 404 },
    );
  }
  if (projects === null) {
    return Response.json(
      { ok: false, error: "Cannot read registry/projects.yaml: file not found" },
      { status: 404 },
    );
  }
  return Response.json({ ok: true, data: { portfolio, projects } });
}
