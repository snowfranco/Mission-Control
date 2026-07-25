import { DecisionsQueue } from "@/components/DecisionCard";
import { LiveRefresh } from "@/components/LiveRefresh";
import { readDecisions } from "@/lib/fs";

export const dynamic = "force-dynamic";

export default async function DecisionsPage() {
  const lines = await readDecisions();
  return (
    <>
      <LiveRefresh watch={["queues/decisions.jsonl"]} />
      <DecisionsQueue initial={lines} />
    </>
  );
}
