import { AgentRoom } from "@/components/AgentRoom";
import { AGENT_SLUGS } from "@/lib/agents";
import { readAllAgentStatuses } from "@/lib/fs";

export const dynamic = "force-dynamic";

/**
 * The Agent Office: nine rooms, one specialist each. Sphere anchors the
 * first corner. Status comes from agents/<slug>/STATUS.json when the
 * runtime writes one, else derived from schedule/scheduler.yaml.
 */
export default async function AgentsPage() {
  const statuses = await readAllAgentStatuses();

  return (
    <div>
      <h1 className="text-lg font-medium">Agents</h1>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AGENT_SLUGS.map((slug) => (
          <AgentRoom key={slug} slug={slug} status={statuses[slug]} />
        ))}
      </div>
    </div>
  );
}
