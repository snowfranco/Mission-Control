# ROADMAP: mission-control

Last updated: 2026-07-24

Tag legend: [HU] human-owned, [AI] authored by the assistant from the repo, [INFERRED] assistant default. Status vocabulary: ✅ shipped, 🔄 in progress, ⏳ next, 💡 planned, 🅿️ parked.

## Status Board

| Phase | What | Status | Shipped |
|-------|------|--------|---------|
| 0 | Repo scaffold: OS files, overlays, registry schemas, scheduler, queues | ✅ shipped | 2026-07-23 |
| 1 | Registry population from source repos | ✅ shipped | 2026-07-24 |
| 2 | Dashboard UI on localhost | ✅ shipped | 2026-07-24 |
| 3 | Notion mirror by Möbius | 💡 planned | - |
| 4 | Discord HITL channel | 💡 planned | - |

## Next session

- [HU] Test Mission Control under OpenClaw on the second MacBook. Concretely: clone this repo there, point OpenClaw at the repo root, have Sphere read agents/_master_brief.md, agents/sphere/OVERLAY.md, and agents/sphere/IDENTITY.md, then confirm it can read registry/portfolio.yaml (five slots) and the empty queues/. Do NOT enable any scheduler trigger yet. The dashboard is optional there: cd dashboard, npm install, npm run dev.
- [AI] Watch-out: registry repo_local values are absolute paths on this machine and will not resolve on the second MacBook (PARKING_LOT.md).

## Phase Detail

### Phase 0: Repo scaffold (✅ shipped 2026-07-23)

- [AI] What was built: the working skeleton of Mission Control. Four OS files, AGENTS.md with CLAUDE.md symlinked, the master brief, nine agent overlays, nine identity skeletons, registry schemas with example rows, the scheduler config with all triggers disabled, empty append-only queues with schemas in queues/README.md, and report directories for Torus, Möbius, and Parabola.
- [AI] Key files: PROJECT_OS.md, AGENTS.md, agents/_master_brief.md, agents/<shape>/OVERLAY.md, registry/portfolio.yaml, registry/projects.yaml, schedule/scheduler.yaml, queues/README.md.
- [AI] Decisions made: registry in-repo not in Notion, overlays versioned, shape names, AGENTS.md canonical, triggers ship disabled (DECISIONS.md).
- [AI] Open items: IDENTITY.md values are [GAP] for the operator; the OpenClaw embedder item is parked (PARKING_LOT.md).
- [AI] What it unlocks: Phase 1 has a schema to populate and agents have overlays to run against.

### Phase 1: Registry population from source repos (✅ shipped 2026-07-24)

- [HU] Walk the operator's existing project repos and derive real portfolio state into registry/portfolio.yaml and registry/projects.yaml, replacing the example rows.
- [HU] This happens in a follow-on session, not the scaffold session (registry/portfolio.yaml header comment). [AI] Satisfied: that follow-on session ran 2026-07-24 on branch phase-1-registry-populate.
- [AI] 2026-07-24: the six operator-listed repos were walked (Preflight, Watchtower, workoutapp, Sienna, Gabay, TheFrameshift). projects.yaml carries six derived rows; portfolio.yaml carries four proposed slot candidates as a leading comment block with slots left empty (registry/projects.yaml, registry/portfolio.yaml, reports/mobius/phase-1-registry-review.md).
- [AI] 2026-07-24 update: Watchtower's contents were pushed to GitHub after the walk found it empty; its row was re-derived the same day and it joins the slot proposal as a conditional candidate (registry/projects.yaml, registry/portfolio.yaml).
- [AI] 2026-07-24 update: mission-control (this repo) added to projects.yaml at the operator's request. It is the cockpit, tracked as infra but occupying no portfolio slot; projects.yaml now carries seven rows (registry/projects.yaml, DECISIONS.md 2026-07-24).
- [AI] 2026-07-24 close: the operator confirmed all five candidates into registry/portfolio.yaml slots: with the 2500/1000/1500 commercial MRR split and operator-authored next_gate values for workoutapp (fix prod build, lock MVP scope) and gabay (write validation completion criteria). notion_page and kill_conditions stay [GAP] by decision: Notion is written by Möbius in Phase 3, and kill conditions await a Prism memo (registry/portfolio.yaml, DECISIONS.md slot-assignments ADR).
- [AI] Unlocks: Torus sweeps keyed off registry/projects.yaml, Möbius reports keyed off registry/portfolio.yaml, and honest WIP slot math (agents/torus/OVERLAY.md, agents/mobius/OVERLAY.md).

### Phase 2: Dashboard UI on localhost (✅ shipped 2026-07-24)

- [HU] A localhost dashboard over the registry, queues, and reports.
- [AI] What was built: a Next.js App Router app in dashboard/ with six panels (Decisions Queue with approve/reject appending to queues/decisions.jsonl, Radar over reports/torus/, Pipeline kanban over portfolio slots, Portfolio Health over reports/mobius/, Agent Office with the nine shape glyphs as the interface signature, Frameshift Feed over reports/cardioid/), the MRR ribbon reading north_star across the top of every page, and live updates via chokidar plus Server-Sent Events (dashboard/README.md, dashboard/DESIGN_PLAN.md).
- [AI] The dashboard is a file viewer plus one append-only write path, not an agent runtime (DECISIONS.md, 2026-07-24).
- [AI] 2026-07-24: the pipeline board and the Portfolio WIP table now render all five confirmed slots from registry/portfolio.yaml, verified live in the running dashboard. The earlier empty-array blocker cleared when the operator confirmed the slots that same day.
- [AI] Unlocks: the operator's live cockpit. Notion mirror (Phase 3) and Discord HITL (Phase 4) remain unbuilt.

### Phase 3: Notion mirror by Möbius (💡 planned)

- [HU] Möbius writes the Notion portfolio mirror for cross-machine visibility (DECISIONS.md, 2026-07-23). The repo stays canonical; Notion mirrors (agents/_master_brief.md). Möbius's overlay lists the mirror as an input only today; the write responsibility gets added to the overlay when Phase 3 starts.
- [AI] Nothing writes to Notion until this phase. [GAP] on the Notion workspace and page targets.

### Phase 4: Discord HITL channel (💡 planned)

- [HU] Discord joins or replaces Telegram as the HITL channel (agents/_master_brief.md).
- [AI] Until then, every HITL gate fires via Telegram. [GAP] on server, channel, and bot details.
