# AGENTS.md: mission-control

Canonical rules file. CLAUDE.md is a symlink to this file. Kept lean on purpose: it loads every session.

## North star

- [HU] $5,000 MRR from an AI-powered product by end of 2026. Everything in this repo is measured against that goal (agents/_master_brief.md).

## Portfolio rules

- [HU] WIP cap is 5 total slots. Anything proposed above the cap must name what it displaces, or it is refused.
- [HU] Commercial slot cap is 3 active commercial bets at any time. Personal projects fill the remaining slots and never displace commercial bets.
- [HU] Kill early is a virtue. A dead idea killed early, a stalled bet flagged, a weak draft held back: all good outcomes (agents/_master_brief.md).

## Style rules

- [HU] No em dashes anywhere in any file. Use commas, colons, or parentheses.
- [HU] Every claim about state cites a file or is tagged [INFERRED]. A [GAP] is better than a confident fiction.
- [HU] Reports are decision-grade: answer first, cite every substantive claim, label inference vs evidence, under two pages (agents/_master_brief.md).

## Pointers

- [AI] Master brief, prepended to every agent's system prompt: agents/_master_brief.md
- [AI] Per-agent behavior contracts: agents/<shape>/OVERLAY.md (sphere, torus, prism, icosa, helix, klein, cardioid, mobius, parabola)
- [AI] Per-agent identity values, operator fills the [GAP]s: agents/<shape>/IDENTITY.md
- [AI] Portfolio state: registry/portfolio.yaml (slots), registry/projects.yaml (every project ever, including parked and killed)
- [AI] Scheduler: schedule/scheduler.yaml, all triggers disabled until the operator enables them
- [AI] Queues: queues/decisions.jsonl and queues/handoffs.jsonl, line schemas in queues/README.md
- [AI] Timezone for everything: America/Toronto
