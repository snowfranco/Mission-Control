# DECISIONS: mission-control

Last updated: 2026-07-23

Tag legend: [HU] human-owned, [AI] authored by the assistant, [INFERRED] assistant default. ADR format: Context (what forced the choice), Decision (what was chosen), Consequence (what we now live with). Newest first. Supersede, never delete.

## Decisions Log (newest first)

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
