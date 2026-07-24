# PROJECT_OS: mission-control

Last updated: 2026-07-24

Tag legend: [HU] human-owned (provided or confirmed by the operator), [AI] authored by the assistant from the repo, [INFERRED] a default the assistant chose rather than a deliberate operator decision. This file contains [INFERRED] entries in Stack; they are flagged inline. Unresolved items are tagged [GAP].

## Purpose

- [HU] This repo is the Mission Control substrate: the portfolio registry (registry/), the agent overlays (agents/), the scheduler config (schedule/scheduler.yaml), and the inter-agent queues (queues/).
- [HU] It is the operator's cockpit for a portfolio of zero-to-one AI bets, run by a 9-agent crew (agents/_master_brief.md). The crew runs on OpenClaw: operator-stated, see Stack. The master brief does not name the runtime.
- [HU] This repo is canonical for portfolio-level state. Individual project repos remain canonical for their own state via their ProjectOS files (agents/_master_brief.md).
- [HU] North star: $5,000 MRR from an AI-powered product by end of 2026. Operator: Snow. Timezone: America/Toronto (agents/_master_brief.md).

## Stack

- [HU] Markdown + YAML + JSONL. No runtime code in this repo yet.
- [HU] OpenClaw runs the agents against this repo as source of truth.
- [INFERRED] Git for versioning. No package manifest, no build system, no CI: nothing in the tree needs one yet.

## Architecture as it actually is

- [AI] Registry files are canonical for portfolio state: slot state in registry/portfolio.yaml, all-projects history in registry/projects.yaml. As of Phase 1 (2026-07-24), projects.yaml carries six derived rows and portfolio.yaml carries proposed slot candidates in a leading comment block, with slots empty pending operator confirmation (registry/projects.yaml, registry/portfolio.yaml, reports/mobius/phase-1-registry-review.md).
- [AI] Overlays are canonical for agent behavior. Each agent's role, trigger, inputs, outputs, decision rights, handoff target, and HITL points live in agents/<shape>/OVERLAY.md (agents/sphere/OVERLAY.md and the eight siblings).
- [AI] agents/_master_brief.md is the shared context prepended to every agent's system prompt (agents/_master_brief.md).
- [AI] agents/<shape>/IDENTITY.md files are skeletons: name, role, and signature line are filled, every other value is [GAP] pending an operator review session (agents/sphere/IDENTITY.md and the eight siblings).
- [AI] Queues are append-only logs. queues/decisions.jsonl and queues/handoffs.jsonl are truly empty today; their line schemas are documented in queues/README.md because comments are not valid JSONL (queues/README.md).
- [AI] schedule/scheduler.yaml defines the cron triggers Sphere reads on startup. Every trigger ships with enabled: false (schedule/scheduler.yaml).
- [AI] reports/torus/, reports/mobius/, and reports/parabola/ hold worker report output. They are empty except for .gitkeep files (reports/).

## Key decisions (from the code)

- [HU] The registry lives in this repo, not in Notion. Notion is a mirror written by Möbius in Phase 3 (DECISIONS.md, 2026-07-23).
- [HU] Agent overlays are versioned in git, not held in a runtime config store (DECISIONS.md, 2026-07-23).
- [HU] Agents are named as shapes: Sphere, Torus, Prism, Icosa, Helix, Klein, Cardioid, Möbius, Parabola (DECISIONS.md, 2026-07-23).
- [HU] AGENTS.md is the canonical rules file; CLAUDE.md is a symlink to it (DECISIONS.md, 2026-07-23; AGENTS.md).
- [AI] All scheduler triggers ship disabled; the operator flips enabled: true per trigger (DECISIONS.md, 2026-07-23; schedule/scheduler.yaml).

## Known constraints

- [HU] OpenClaw does not have public embeddings, so anything requiring embeddings needs an external provider: an OpenAI-compatible key or a Gemini embedding switch (see PARKING_LOT.md, OpenClaw embedder configuration).
- [HU] Every material decision requires the operator's explicit go/no-go before the next agent acts. HITL is not optional (agents/_master_brief.md).
- [HU] WIP cap is 5 total slots, at most 3 active commercial bets. Overflow parks in the backlog, no exceptions (agents/_master_brief.md, AGENTS.md).
- [HU] Telegram is the primary HITL channel today; Discord is Phase 4 (agents/_master_brief.md, ROADMAP.md).
- [HU] No em dashes anywhere in any file. Use commas, colons, or parentheses (AGENTS.md).
- [AI] portfolio.yaml slots stay empty until the operator confirms the Phase 1 proposals, so slot-math consumers (Möbius WIP status, Sphere dispatch context) still cannot run meaningfully (registry/portfolio.yaml, ROADMAP.md).

## Decisions Log

- [AI] The Decisions Log for this repo lives in DECISIONS.md (ADR format, newest first). It is a separate file rather than a section here because the master brief defines ProjectOS as five files including DECISIONS.md (agents/_master_brief.md; DECISIONS.md).
