# DECISIONS: mission-control

Last updated: 2026-07-24

Tag legend: [HU] human-owned, [AI] authored by the assistant, [INFERRED] assistant default. ADR format: Context (what forced the choice), Decision (what was chosen), Consequence (what we now live with). Newest first. Supersede, never delete.

## Decisions Log (newest first)

### [2026-07-24] [AI] Watchtower is registered as infra, not personal
Context: Watchtower was empty at the Phase 1 walk; the operator pushed its contents to GitHub later the same day and the row was re-derived from a fresh clone. The repo-only reading is personal: a single-user utility with no commercial layer in v1 by design. But it is tooling that feeds the operator's Claude stack: its PROJECT_OS.md frames it as the source layer for Claude Code Routines, and mission-control's own overlays name Watchtower as the HITL approval surface (agents/helix/OVERLAY.md, agents/sphere/OVERLAY.md). The repo itself names no other operator project.
Decision: kind: infra with an [INFERRED] tag, the personal reading recorded in the row comment, and a conditional rank-5 slot proposal.
Consequence: Watchtower does not touch the commercial cap. If the operator prefers personal, only the label changes; no slot math moves. Superseded if the operator rules otherwise.

### [2026-07-24] [AI] Sienna is registered as infra, not writing
Context: The Phase 1 kind taxonomy fits Sienna two ways: it is a content pipeline (the "writing" definition) and it is tooling other projects depend on (the "infra" definition). The operator's Phase 1 instructions state Sienna is infra and a dependency of the Cardioid agent, and nothing in the Sienna repo contradicts that.
Decision: kind: infra in both registry files, with the alternative reading noted in the row comment. Sienna is proposed for a slot only conditionally.
Consequence: Sienna does not count toward the commercial cap, and Torus and Möbius treat it as tooling. If Sienna ever grows its own commercial line, the kind flips and this entry is superseded.

### [2026-07-24] [AI] TheFrameshift is marked shipped (projects.yaml) and live (portfolio vocabulary)
Context: The strict Phase 1 rule ("shipped" requires every phase done plus a live deployment reference) has no clean match: the board shows every phase shipped except 2C (planned, deliberately held until real production failure modes are observed) and 2D (cancelled), and a live deployment exists: the com.frameshift.bot.plist LaunchAgent runs watcher/bot.py with RunAtLoad and KeepAlive.
Decision: status: shipped with an [INFERRED] tag; live in the portfolio vocabulary. It occupies no slot: live projects do not.
Consequence: The registry reflects the system as deployed and running. If 2C work resumes, status flips to active and this entry is superseded.

### [2026-07-24] [AI] Preflight ranked first in the slot proposal despite the ranking rule's bucket
Context: The Phase 1 ranking rule puts commercial bets in "building or shaping" first. Preflight's derived status is shipping, which the rule does not address, yet it is the bet closest to revenue: pricing set, launch runbook prepared, most recent activity of all walked repos.
Decision: Rank Preflight 1 with an [INFERRED] tag and the reasoning in portfolio.yaml's proposal block. Nothing is hard-assigned; the operator confirms or reorders.
Consequence: The proposal reflects proximity to the $5K MRR goal rather than a literal bucket read. If the operator prefers strict rule order, workoutapp moves to rank 1.

### [2026-07-24] [AI] Phase 1 registry conventions: repo_local extension field, full ISO dates, quoted [GAP] values
Context: The Phase 1 spec asks for the local path AND the remote URL, but the schema has a single repo field; the walked clones were temporary, so local paths could only be name-matched against ~/Projects directory names. Git reports full ISO timestamps (%cI). A bare [GAP] in YAML would parse as a one-element list.
Decision: repo holds the git remote URL; a repo_local extension field holds the operator's local checkout path, tagged [INFERRED] or [GAP]. started and last_activity store full ISO commit timestamps. Every [GAP] value is a quoted string. Proposed portfolio rows also carry a slug field matching projects.yaml so slot entries and project rows join cleanly.
Consequence: The schema gains two fields (repo_local, slug) that consumers must tolerate. Timestamps are more precise than the schema examples show. Grepping for [GAP] and [INFERRED] still works.

### [2026-07-23] [AI] Queue files ship truly empty; line schemas live in queues/README.md
Context: The queues need documented line formats, but comments are not valid JSONL, so a leading comment line would break every parser.
Decision: queues/decisions.jsonl and queues/handoffs.jsonl are zero-byte files. The JSON schema of each future line is documented in queues/README.md.
Consequence: Parsers consume the .jsonl files with no special-casing. Anyone appending a line must read queues/README.md first, and schema drift between the README and real lines is a bug to watch for.

### [2026-07-23] [AI] All scheduler triggers ship disabled
Context: The scaffold session must produce the substrate without starting any automated agent runs; the operator has not yet reviewed the crew.
Decision: Every trigger in schedule/scheduler.yaml carries enabled: false. The operator flips enabled: true per trigger when ready.
Consequence: Nothing runs unprompted after this commit. The cost is one manual edit per trigger before the crew comes alive.

### [2026-07-23] [AI] DECISIONS.md is a separate file, not a section of PROJECT_OS.md
Context: The house project-os skill defaults to a Decisions Log section inside PROJECT_OS.md, but the master brief defines ProjectOS as five files including a standalone DECISIONS.md (agents/_master_brief.md).
Decision: The ADR log lives here. PROJECT_OS.md keeps a Decisions Log section that points to this file.
Consequence: PROJECT_OS.md stays calm and rarely changes. Readers follow one pointer to reach the full ADRs.

### [2026-07-23] [HU] AGENTS.md is canonical; CLAUDE.md is a symlink
Context: The rules file must stay portable across agent tools (Claude Code today, others later) without maintaining the same rules twice.
Decision: AGENTS.md is the canonical rules file. CLAUDE.md is a symlink created with ln -s AGENTS.md CLAUDE.md.
Consequence: One file to maintain. Any tool that does not follow symlinks needs a copy, which would reintroduce the duplication this avoids.

### [2026-07-23] [HU] Agents are named as shapes
Context: Nine agents need stable, memorable names that survive role tweaks and carry no misleading semantics.
Decision: Geometric names: Sphere, Torus, Prism, Icosa, Helix, Klein, Cardioid, Möbius, Parabola.
Consequence: Names never need renaming when roles evolve, but a name alone tells you nothing: roles must be read from agents/<shape>/OVERLAY.md.

### [2026-07-23] [HU] Agent overlays are versioned in this repo
Context: Agent behavior is a portfolio-level asset. Behavior changes must be auditable, diffable, and revertible, not edited live in a runtime store.
Decision: Each agent's behavior contract lives in agents/<shape>/OVERLAY.md under git.
Consequence: Every behavior change leaves history and can be reviewed or rolled back. Changing an agent requires a commit, which is friction by design.

### [2026-07-23] [HU] The registry lives in this repo, not in Notion
Context: Portfolio state needs exactly one canonical home. Notion is convenient for cross-machine visibility but is not git-versioned, diffable, or agent-native.
Decision: registry/portfolio.yaml and registry/projects.yaml in this repo are canonical for portfolio state. Notion is a mirror written by Möbius in Phase 3 (ROADMAP.md).
Consequence: State changes are versioned and reviewable. The Notion mirror can lag or drift; flagging that drift is Möbius's job, not a canonicity question.
