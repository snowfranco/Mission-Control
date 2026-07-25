# PARKING_LOT: mission-control

Last updated: 2026-07-24

Tag legend: [HU] human-owned, [AI] authored by the assistant from the repo, [INFERRED] assistant default.

## Open items

- [HU] OpenClaw embedder configuration. OpenClaw does not have public embeddings, so anything requiring embeddings (semantic matching for Torus sweeps, search over reports) needs an external provider. Needs either an OpenAI-compatible key or a switch to Gemini embeddings. Blocked on the operator choosing and provisioning a provider. [GAP] on which provider and which account.

## Deferred by design

- [AI] Instagram carousels for Cardioid: parked; Cardioid does not touch them today (agents/cardioid/OVERLAY.md). [INFERRED] The overlay's "Phase 2" refers to Cardioid's own distribution phasing, not this repo's ROADMAP phase numbering.
- [AI] Klein scheduled sweep: agents/klein/OVERLAY.md includes a scheduled sweep of any repo with status: shipping, but the starter scheduler has no Klein trigger (schedule/scheduler.yaml). Add a disabled trigger when the first repo approaches status: shipping. [GAP] on cadence.
- [AI] MRR data wiring for Möbius (Stripe, Gumroad, or whatever payment surface a shipped bet uses): nothing to wire until a bet is live (agents/mobius/OVERLAY.md).
- [AI] Per-bet Parabola schedules: day and time are set per-bet once a bet reaches status: live; no live bets exist yet (agents/parabola/OVERLAY.md).
- [2026-07-24] Registry repo_local paths are absolute and machine-specific (/Users/snow/Projects/...). On the second MacBook they will not resolve, and workoutapp has no local checkout at all (repo_local: [GAP]). The real version: make repo_local machine-aware (per-machine config, or store a repo-root-relative hint) before any agent consumes it across machines. Until then, treat repo_local as advisory on this laptop only; repo (the git remote URL) is the portable identifier.
- [2026-07-24] notion_page is [GAP] on all five slots, deferred by the operator. Fills when the Phase 3 Notion mirror is built (Möbius writes it); no action until then.
- [2026-07-24] kill_conditions is [GAP] on all five slots. These come from a Prism validation memo, which has not run for any bet yet. Backfill each slot's kill_conditions when its Prism memo lands.
