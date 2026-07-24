import { DecisionsQueue } from "@/components/DecisionCard";
import { readDecisions } from "@/lib/fs";

export const dynamic = "force-dynamic";

export default async function DecisionsPage() {
  const lines = await readDecisions();
  return <DecisionsQueue initial={lines} />;
}
