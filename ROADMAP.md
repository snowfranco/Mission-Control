# ROADMAP: mission-control

Last updated: 2026-07-23

Tag legend: [HU] human-owned, [AI] authored by the assistant from the repo, [INFERRED] assistant default. Status vocabulary: ✅ shipped, 🔄 in progress, ⏳ next, 💡 planned, 🅿️ parked.

## Status Board

| Phase | What | Status | Shipped |
|-------|------|--------|---------|
| 0 | Repo scaffold: OS files, overlays, registry schemas, scheduler, queues | ✅ shipped | 2026-07-23 |
| 1 | Registry population from source repos | ⏳ next | - |
| 2 | Dashboard UI on localhost | 💡 planned | - |
| 3 | Notion mirror by Möbius | 💡 planned | - |
| 4 | Discord HITL channel | 💡 planned | - |

## Phase Detail

### Phase 0: Repo scaffold (✅ shipped 2026-07-23)

- [AI] What was built: the working skeleton of Mission Control. Four OS files, AGENTS.md with CLAUDE.md symlinked, the master brief, nine agent overlays, nine identity skeletons, registry schemas with example rows, the scheduler config with all triggers disabled, empty append-only queues with schemas in queues/README.md, and report directories for Torus, Möbius, and Parabola.
- [AI] Key files: PROJECT_OS.md, AGENTS.md, agents/_master_brief.md, agents/<shape>/OVERLAY.md, registry/portfolio.yaml, registry/projects.yaml, schedule/scheduler.yaml, queues/README.md.
- [AI] Decisions made: registry in-repo not in Notion, overlays versioned, shape names, AGENTS.md canonical, triggers ship disabled (DECISIONS.md).
- [AI] Open items: IDENTITY.md values are [GAP] for the operator; the OpenClaw embedder item is parked (PARKING_LOT.md).
- [AI] What it unlocks: Phase 1 has a schema to populate and agents have overlays to run against.

### Phase 1: Registry population from source repos (⏳ next)

- [HU] Walk the operator's existing project repos and derive real portfolio state into registry/portfolio.yaml and registry/projects.yaml, replacing the example rows.
- [HU] This happens in a follow-on session, not the scaffold session (registry/portfolio.yaml header comment).
- [AI] Unlocks: Torus sweeps keyed off registry/projects.yaml, Möbius reports keyed off registry/portfolio.yaml, and honest WIP slot math (agents/torus/OVERLAY.md, agents/mobius/OVERLAY.md).

### Phase 2: Dashboard UI on localhost (💡 planned)

- [HU] A localhost dashboard over the registry, queues, and reports.
- [AI] Scope, stack, and lane are undefined until an Icosa spec exists. [GAP]

### Phase 3: Notion mirror by Möbius (💡 planned)

- [HU] Möbius writes the Notion portfolio mirror for cross-machine visibility. The repo stays canonical; Notion mirrors (agents/_master_brief.md, agents/mobius/OVERLAY.md).
- [AI] Nothing writes to Notion until this phase. [GAP] on the Notion workspace and page targets.

### Phase 4: Discord HITL channel (💡 planned)

- [HU] Discord joins or replaces Telegram as the HITL channel (agents/_master_brief.md).
- [AI] Until then, every HITL gate fires via Telegram. [GAP] on server, channel, and bot details.
