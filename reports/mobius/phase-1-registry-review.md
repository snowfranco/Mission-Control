# Phase 1 Registry Review: population from source repos

Date: 2026-07-24. Branch: phase-1-registry-populate, pending operator review. Author: [AI] Claude Code Phase 1 session (Möbius report format; Möbius itself has not run).

## Answer first

- [AI] Six repos on the operator's list, six cloned, five walked. Watchtower's GitHub repo is empty (zero commits), so its row is all [GAP] (registry/projects.yaml). No clone failures.
- [AI] projects.yaml now has six rows. portfolio.yaml carries four proposed slot candidates in a leading comment block; slots: is empty until the operator confirms (registry/portfolio.yaml).
- [AI] The three commercial candidates (preflight, workoutapp, gabay) exactly fill the 3-slot commercial cap. Nothing is displaced. Every walked repo is pre-revenue, so current_mrr_usd stays 0.
- [AI] Operator actions: confirm slot ordering, fill mrr_target_usd and notion_page, knock out the [GAP] clusters below, and say what Watchtower is.

## Counts

- [AI] Walked: 5 of 6 (Watchtower empty). By kind: commercial_bet 3 (preflight, workoutapp, gabay), infra 1 (sienna), writing 1 (theframeshift), [GAP] 1 (watchtower).
- [AI] By status: active 4 (preflight, workoutapp, sienna, gabay), shipped 1 (theframeshift), [GAP] 1 (watchtower).

## Proposed slot ordering (operator to confirm)

| Rank | Project | Kind, status | Rationale |
|------|---------|--------------|-----------|
| 1 | preflight | commercial_bet, shipping | Closest to the first MRR dollar: $99/$249 pricing set, launch runbook prepared, go-live pending hardening. [INFERRED] ranked above the rule's building/shaping bucket (DECISIONS.md, 2026-07-24). |
| 2 | workoutapp | commercial_bet, building | Only bet literally in the rule's first bucket. Caveats: production build broken (its PARKING_LOT.md B4), app name undecided (Q1). |
| 3 | gabay | commercial_bet, validating | Revenue model documented; demand experiment not yet run, validation criteria unwritten. |
| 4 | sienna | infra, building | CONDITIONAL: operator note says infra, Cardioid dependency, not a slot on its own. Include only if infra should hold a slot. |
| 5 | (none) | - | No active personal projects among walked repos; theframeshift is live and live projects hold no slots. |

## [GAP] fields, grouped for one pass

- [AI] notion_page: all four candidates (operator fills).
- [AI] mrr_target_usd: preflight, workoutapp, gabay (operator carves up the $5K; sienna is null, non-commercial).
- [AI] next_gate: workoutapp (its ROADMAP Next bucket is deliberately blank), gabay (Next section blank, marked for the operator).
- [AI] kill_conditions: all four candidates. No Prism-style memo exists in any walked repo.
- [AI] name: workoutapp (app name undecided, its PARKING_LOT.md Q1; folder name used).
- [AI] repo_local: preflight, workoutapp, gabay, watchtower (see [INFERRED] name matches below).
- [AI] watchtower row: name, status, kind, one_line, started, keywords are all [GAP] (empty repo).

## [INFERRED] fields, grouped for confirm-or-override

- [AI] Portfolio status (no repo uses the portfolio vocabulary): preflight shipping, workoutapp building, gabay validating, sienna building.
- [AI] projects.yaml status: theframeshift shipped (all phases done except one deliberately-held planned item and one cancelled; live LaunchAgent deployment; DECISIONS.md, 2026-07-24).
- [AI] kind: theframeshift writing (content automation for the Frameshift Instagram publication). Note sienna's kind is [HU], not inferred: the operator's Phase 1 note says infra; only the alternative "writing" reading is the inference (DECISIONS.md, 2026-07-24).
- [AI] kind lean for watchtower: likely infra, because mission-control's own overlays reference Watchtower as the HITL approval surface (agents/helix/OVERLAY.md, agents/sphere/OVERLAY.md); unconfirmed by the empty repo, so the registry field stays [GAP].
- [AI] build_lane: claude_code for preflight, gabay, sienna (no lane stated in those repos). workoutapp's lane is [AI], not inferred: its PROJECT_OS.md states development happens in Claude Code.
- [AI] repo_local name matches, none walked: sienna to ~/Projects/sienna, gabay to ~/Projects/pinai (its own docs call the repo pinai), preflight to ~/Projects/pre-flight, watchtower to ~/Projects/watchtower. theframeshift to /Users/snow/Projects/frameshift_v2 is [AI], grounded in its com.frameshift.bot.plist.
- [AI] Slot rank 1 for preflight (DECISIONS.md, 2026-07-24).

## Found on disk, not on the candidate list (names only, NOT walked)

- [AI] From a name-only listing of ~/Projects: Snowskin, eggcrm, "frameshift intelligence", gateway, manananggame, novacrm, "novacrm 2", pmaws, sunny, zen. These may be new or unregistered projects; none were read, per guardrails.
- [AI] Apparent local checkouts of walked repos, also not walked: frameshift_v2, pinai, pre-flight, sienna, watchtower. missioncontrol is this repo.
- [AI] Note: mission-control itself was not on the candidate list, so projects.yaml has no row for it. The operator may want one in a later run.

## On the list, not found on disk

- [AI] None. All six clones succeeded. Watchtower cloned but is empty (zero commits, no files); surfaced here rather than as a clone failure.

## Clone failures

- [AI] None.

## Slug collisions

- [AI] None among the six slugs.

## Source-repo drift observed (not fixed here; future Möbius job)

- [AI] preflight: PROJECT_OS.md still calls web/ a README-only placeholder; Phase 6 shipped a real web app (web/src/). Two stale mentions: the architecture section and the top-level areas list.
- [AI] workoutapp: replit.md is an unfilled Replit template describing an Express/Postgres stack the app does not use; flagged in-repo (its PARKING_LOT.md B7).
- [AI] sienna: docs-standardization roadmap item still marked in progress; the Sienna portion completed 2026-07-14, but the item spans other repos, so it may be deliberate.
- [AI] theframeshift: ROADMAP.md says last updated 2026-06-13 but two 2026-07-14 commits landed after (reliability audit, plist repoint); GitHub name TheFrameshift vs live path ~/Projects/frameshift_v2.
- [AI] gabay: repo docs call the repo pinai (README quickstart, CLAUDE.md); the GitHub repo is Gabay.

## Notes

- [AI] Sunny: not on the list, so no row was created. No archival references to Sunny were found in any walked repo.
- [AI] Method: each repo was extracted by a dedicated agent and every extraction was adversarially verified against the clone before being written to the registry; two citation-level corrections were applied, and a second verification pass ran over the written files before commit. Clones were read-only for the whole session and are deleted before this branch's commit lands.
- [AI] Small deviations from the Phase 1 spec, made deliberately: PROJECT_OS.md was updated (two stale lines) and included in this branch's changeset alongside the prescribed files because doc drift is a bug (agents/_master_brief.md, principle 4); projects.yaml's first header line was reworded because "Not yet populated" became false the moment rows landed.
