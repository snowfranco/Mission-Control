import { PipelineBoard } from "@/components/PipelineBoard";
import { readPortfolio } from "@/lib/fs";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const portfolio = await readPortfolio();
  // null means the file itself is unreadable; a present file with an
  // empty (or yaml-null) slots key is the legitimate empty board.
  return <PipelineBoard slots={portfolio ? (portfolio.slots ?? []) : null} />;
}
