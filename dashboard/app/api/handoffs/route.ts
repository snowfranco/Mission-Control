import { readHandoffs } from "@/lib/fs";

export const dynamic = "force-dynamic";

export async function GET() {
  const records = await readHandoffs();
  return Response.json({ ok: true, data: records });
}
