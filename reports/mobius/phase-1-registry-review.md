# Phase 1 Registry Review: population from source repos

Date: 2026-07-24. Branch: phase-1-registry-populate, pending operator review. Author: [AI] Claude Code Phase 1 session (Möbius report format; Möbius itself has not run). Updated the same day: Watchtower's contents were pushed to GitHub after the initial walk found the repo empty; its row was re-derived from a fresh clone and this report was refreshed.

## Answer first

- [AI] Six repos on the operator's list, six cloned, six walked. Watchtower was empty (zero commits) at the initial walk; the operator pushed its contents later the same day and its row is now fully derived (registry/projects.yaml). No clone failures.
- [AI] 2026-07-24 addition: mission-control (this repo) was added at the operator's request, derived from the canonical local working tree, not a clone. projects.yaml now has seven rows. mission-control is infra and occupies no slot (it is the cockpit, not a bet); see the not-slotted note in portfolio.yaml and DECISIONS.md 2026-07-24.
- [AI] portfolio.yaml carries five proposed slot candidates in a leading comment block, two conditional (sienna, watchtower); slots: is empty until the operator confirms (registry/portfolio.yaml).
- [AI] The three commercial candidates (preflight, workoutapp, gabay) exactly fill the 3-slot commercial cap; confirming all five candidates fills the WIP cap exactly. Every walked repo is pre-revenue, so current_mrr_usd stays 0.
- [AI] Operator actions: confirm slot ordering, fill mrr_target_usd and notion_page, knock out the [GAP] clusters below, and confirm watchtower's kind (infra vs personal; non-commercial either way).

## Counts

- [AI] Rows in projects.yaml: 7. The 6 walked repos plus mission-control (this repo, derived in place). By kind: commercial_bet 3 (preflight, workoutapp, gabay), infra 3 (sienna, watchtower [INFERRED], mission-control), writing 1 (theframeshift).
- [AI] By status: active 6 (preflight, watchtower, workoutapp, sienna, gabay, mission-control), shipped 1 (theframeshift).

## Proposed slot ordering (operator to confirm)

| Rank | Project | Kind, status | Rationale |
|------|---------|--------------|-----------|
| 1 | preflight | commercial_bet, shipping | Closest to the first MRR dollar: $99/$249 pricing set, launch runbook prepared, go-live pending hardening. [INFERRED] ranked above the rule's building/shaping bucket (DECISIONS.md, 2026-07-24). |
| 2 | workoutapp | commercial_bet, building | Only bet literally in the rule's first bucket. Caveats: production build broken (its PARKING_LOT.md B4), app name undecided (Q1). |
| 3 | gabay | commercial_bet, validating | Revenue model documented; demand experiment not yet run, validation criteria unwritten. |
| 4 | sienna | infra, building | CONDITIONAL: operator note says infra, Cardioid dependency, not a slot on its own. Include only if infra should hold a slot. |
| 5 | watchtower | infra, shipping | CONDITIONAL: non-commercial event hub at its real-provider validation gate (B2v). Added after the operator's push. Same question as sienna: include only if tooling should hold slots. theframeshift stays out: live projects hold no slots. |

## [GAP] fields, grouped for one pass

- [AI] notion_page: all five candidates (operator fills).
- [AI] mrr_target_usd: preflight, workoutapp, gabay (operator carves up the $5K; sienna and watchtower are null, non-commercial).
- [AI] next_gate: workoutapp (its ROADMAP Next bucket is deliberately blank), gabay (Next section blank, marked for the operator).
- [AI] kill_conditions: all five candidates. No Prism-style memo exists in any walked repo.
- [AI] name: workoutapp (app name undecided, its PARKING_LOT.md Q1; folder name used).
- [AI] repo_local: preflight, workoutapp, gabay, watchtower (see [INFERRED] name matches below).

## [INFERRED] fields, grouped for confirm-or-override

- [AI] Portfolio status (no repo uses the portfolio vocabulary): preflight shipping, workoutapp building, gabay validating, sienna building, watchtower shipping.
- [AI] projects.yaml status: theframeshift shipped (all phases done except one deliberately-held planned item and one cancelled; live LaunchAgent deployment; DECISIONS.md, 2026-07-24).
- [AI] kind: theframeshift writing (content automation for the Frameshift Instagram publication). Note sienna's kind is [HU], not inferred: the operator's Phase 1 note says infra; only the alternative "writing" reading is the inference (DECISIONS.md, 2026-07-24).
- [AI] kind: watchtower infra (its PROJECT_OS.md frames it as the source layer feeding Claude Code Routines, and mission-control's overlays name Watchtower as the HITL approval surface); the repo-only reading is personal (single-user, no commercial layer). Non-commercial either way (DECISIONS.md, 2026-07-24).
- [AI] build_lane: claude_code for preflight, gabay, sienna, watchtower (no lane stated in those repos). workoutapp's lane is [AI], not inferred: its PROJECT_OS.md states development happens in Claude Code.
- [AI] repo_local name matches, none walked: sienna to ~/Projects/sienna, gabay to ~/Projects/pinai (its own docs call the repo pinai), preflight to ~/Projects/pre-flight, watchtower to ~/Projects/watchtower. theframeshift to /Users/snow/Projects/frameshift_v2 is [AI], grounded in its com.frameshift.bot.plist.
- [AI] Slot rank 1 for preflight (DECISIONS.md, 2026-07-24).

## Found on disk, not on the candidate list (names only, NOT walked)

- [AI] From a name-only listing of ~/Projects: Snowskin, eggcrm, "frameshift intelligence", gateway, manananggame, novacrm, "novacrm 2", pmaws, sunny, zen. These may be new or unregistered projects; none were read, per guardrails.
- [AI] Apparent local checkouts of walked repos, also not walked: frameshift_v2, pinai, pre-flight, sienna, watchtower.
- [AI] missioncontrol (this repo) now has a projects.yaml row, added 2026-07-24 and derived in place (see Answer first).
- [AI] Heads-up on the operator's Slot-assignments ADR: it lists "pinai" among not-on-list directories excluded as non-active, but pinai is the local checkout of Gabay (Gabay's own docs call the repo pinai), which is an active commercial slot candidate. Worth confirming pinai is not being double-counted as a separate dead project.

## On the list, not found on disk

- [AI] None. All six clones succeeded. Watchtower was empty at the initial walk (zero commits); the operator pushed its contents later on 2026-07-24 and it was re-cloned and fully walked.

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
- [AI] watchtower: the repo's own [HU] rule says never push to GitHub, local commits only (its AGENTS.md and PROJECT_OS.md, dated 2026-07-18), yet the repo is now on GitHub with push configured. Presumably a deliberate operator reversal (the push is what enabled this walk), but the in-repo rule was never updated. No committed secrets found (.env.example is placeholders only). Operator attention.

## Notes

- [AI] Sunny: not on the list, so no row was created. No archival references to Sunny were found in any walked repo.
- [AI] Method: each repo was extracted by a dedicated agent and every extraction was adversarially verified against the clone before being written to the registry; two citation-level corrections were applied, and a second verification pass ran over the written files before commit. Clones were read-only for the whole session and are deleted before this branch's commit lands.
- [AI] Small deviations from the Phase 1 spec, made deliberately: PROJECT_OS.md was updated (two stale lines) and included in this branch's changeset alongside the prescribed files because doc drift is a bug (agents/_master_brief.md, principle 4); projects.yaml's first header line was reworded because "Not yet populated" became false the moment rows landed.
