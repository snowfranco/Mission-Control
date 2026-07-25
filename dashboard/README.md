# Mission Control Dashboard

The operator's cockpit view over this repo. A local Next.js app that reads the parent repo's registry, queues, and reports, renders the panels, and accepts approvals that append to the decisions queue. It is a viewer plus a small approval surface: it does not execute agents. Agents run in OpenClaw against the same files; the dashboard reads their outputs.

## Run

Dev, from the repo root:

```bash
cd dashboard && npm run dev
```

Runs on `localhost:3000`.

Production build:

```bash
cd dashboard && npm run build && npm run start
```

## Data sources

Everything rendered comes from the parent repo, resolved as `..` from the dashboard directory (override with `MC_REPO_ROOT`):

- `registry/portfolio.yaml` and `registry/projects.yaml`: the MRR ribbon, pipeline board, portfolio health.
- `queues/decisions.jsonl` and `queues/handoffs.jsonl`: the decisions queue, agent handoff history.
- `reports/torus/`, `reports/mobius/`, `reports/cardioid/`, and the rest of `reports/`: radar, portfolio health, frameshift feed, agent detail pages.
- `schedule/scheduler.yaml` and `agents/<shape>/STATUS.json`: agent office status (derived from the scheduler when no STATUS.json exists, and labeled as derived).
- `agents/<shape>/OVERLAY.md`: agent detail pages.

The dashboard writes to exactly one file: `queues/decisions.jsonl`, append-only. Operator approvals append a decided line carrying the same card id; panel actions that are themselves operator decisions (radar route or dismiss, frameshift approve, revise, reject) append cards created already decided. The `note` field and the dashboard-originated kinds (`radar_route`, `publish_approval`, `publish_revise`, `publish_reject`) extend the base line schema in `queues/README.md`; that file remains canonical for the base fields.

Real-time updates: a chokidar watcher broadcasts file changes over Server-Sent Events at `/api/stream`; each panel re-reads its own files on relevant changes, debounced 200ms.

## What it does not do

- Execute agents. OpenClaw does that, against the same repo files.
- Sync to Notion. That is Möbius's job in Phase 3.
- Send Telegram messages or host any HITL channel beyond its own approve/reject surface.
- Authenticate. Localhost only, no auth code exists.

## Troubleshooting

If panels render empty:

1. Check the files exist in the parent repo (for example `ls ../registry/portfolio.yaml`). Empty states name the exact file they looked for.
2. Check the process can read them (`cat ../registry/portfolio.yaml`).
3. Check the SSE connection is live: the network tab should show a pending `stream` request, and `curl -N http://localhost:3000/api/stream` should print `: connected` and then change events when watched files change.

If the dashboard starts but the ribbon shows an error, the error text is the file it could not read. If `slots: []` messages appear, the registry's slot array is genuinely empty: confirmed candidates live in the proposal comment block of `registry/portfolio.yaml` until the operator moves them into `slots:`.
