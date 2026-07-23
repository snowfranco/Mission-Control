# Queues

- [AI] queues/decisions.jsonl and queues/handoffs.jsonl are append-only JSONL logs written by Sphere (agents/sphere/OVERLAY.md).
- [AI] Both files ship truly empty. Comments are not valid JSONL, so the line schemas live here instead of in the files (DECISIONS.md, 2026-07-23).
- [AI] One JSON object per line. Records are append-only: a state change appends a new line carrying the same id with updated fields, nothing is edited in place.

## decisions.jsonl

- [AI] One line per decision card: anything holding at a gate for the operator's go/no-go (agents/sphere/OVERLAY.md).
- [INFERRED] Line schema, proposed and not yet exercised by a live run:

    {
      "id": "dq-YYYYMMDD-NNN",
      "ts": "ISO-8601 timestamp with America/Toronto offset",
      "kind": "route_to_prism | prism_verdict | spec_review | watchtower_diff | watchtower_merge | ship_gate | publish_gate | other",
      "agent": "which agent produced the artifact: torus | prism | icosa | helix | klein | cardioid | mobius | parabola",
      "subject": "one line: what is being decided",
      "artifact": "repo-relative path or URL to the card/memo/spec/audit/draft",
      "options": ["go", "no_go", "park", "revise"],
      "status": "pending | decided",
      "decision": "null while pending, then the chosen option",
      "decided_ts": "null while pending, then ISO-8601"
    }

## handoffs.jsonl

- [AI] One line per handoff record: work routed from one agent to another, with the explicit handoff note the master brief requires (agents/_master_brief.md, principle 5).
- [INFERRED] Line schema, proposed and not yet exercised by a live run:

    {
      "id": "ho-YYYYMMDD-NNN",
      "ts": "ISO-8601 timestamp with America/Toronto offset",
      "from": "sphere | torus | prism | icosa | helix | klein | cardioid | mobius | parabola | operator",
      "to": "the agent receiving the task",
      "task": "one line: what the receiving agent must do",
      "context": ["repo-relative paths or URLs the receiver needs"],
      "note": "what was done, what was not done, what the next agent needs to decide",
      "deadline": "ISO-8601 or null",
      "status": "dispatched | accepted | returned"
    }
