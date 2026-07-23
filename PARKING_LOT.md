# PARKING_LOT: mission-control

Last updated: 2026-07-23

Tag legend: [HU] human-owned, [AI] authored by the assistant from the repo, [INFERRED] assistant default.

## Open items

- [HU] OpenClaw embedder configuration. OpenClaw does not have public embeddings, so anything requiring embeddings (semantic matching for Torus sweeps, search over reports) needs an external provider. Needs either an OpenAI-compatible key or a switch to Gemini embeddings. Blocked on the operator choosing and provisioning a provider. [GAP] on which provider and which account.

## Deferred by design

- [AI] Instagram carousels for Cardioid: parked for a later phase; Cardioid does not touch them today (agents/cardioid/OVERLAY.md).
- [AI] MRR data wiring for Möbius (Stripe, Gumroad, or whatever payment surface a shipped bet uses): nothing to wire until a bet is live (agents/mobius/OVERLAY.md).
- [AI] Per-bet Parabola schedules: day and time are set per-bet once a bet reaches status: live; no live bets exist yet (agents/parabola/OVERLAY.md).
