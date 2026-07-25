/**
 * Filesystem watcher singleton. chokidar watches the repo files the
 * dashboard renders; every change broadcasts to all connected SSE
 * clients. Survives dev hot-reload via globalThis.
 */

import path from "node:path";
import chokidar, { type FSWatcher } from "chokidar";
import { REPO_ROOT } from "./fs";

export type ChangeEvent = {
  type: "change";
  /** Repo-relative path, forward slashes. */
  path: string;
  timestamp: string;
};

type Listener = (event: ChangeEvent) => void;

type WatcherState = {
  watcher: FSWatcher;
  listeners: Set<Listener>;
};

const WATCH_TARGETS = [
  "registry/portfolio.yaml",
  "registry/projects.yaml",
  "queues/decisions.jsonl",
  "queues/handoffs.jsonl",
  "reports",
  "agents",
  "schedule/scheduler.yaml",
];

declare global {
  var __mcWatcher: WatcherState | undefined;
}

function relevant(relPath: string): boolean {
  if (relPath.startsWith("registry/")) return relPath.endsWith(".yaml");
  if (relPath.startsWith("queues/")) return relPath.endsWith(".jsonl");
  if (relPath.startsWith("reports/")) return relPath.endsWith(".md");
  if (relPath.startsWith("agents/")) return relPath.endsWith("STATUS.json");
  if (relPath.startsWith("schedule/")) return relPath.endsWith(".yaml");
  return false;
}

function getState(): WatcherState {
  if (globalThis.__mcWatcher) return globalThis.__mcWatcher;

  const watcher = chokidar.watch(
    WATCH_TARGETS.map((t) => path.join(REPO_ROOT, t)),
    {
      ignoreInitial: true,
      // The dashboard's own node_modules and .next never matter here;
      // agents/ is watched as a tree but only STATUS.json is relevant.
      ignored: (p) => p.includes("node_modules") || p.includes(".next"),
    },
  );

  const listeners = new Set<Listener>();

  const emit = (absPath: string) => {
    const relPath = path.relative(REPO_ROOT, absPath).split(path.sep).join("/");
    if (!relevant(relPath)) return;
    const event: ChangeEvent = {
      type: "change",
      path: relPath,
      timestamp: new Date().toISOString(),
    };
    for (const listener of listeners) listener(event);
  };

  watcher.on("add", emit);
  watcher.on("change", emit);
  watcher.on("unlink", emit);

  globalThis.__mcWatcher = { watcher, listeners };
  return globalThis.__mcWatcher;
}

/** Subscribe to repo file changes. Returns the unsubscribe function. */
export function subscribe(listener: Listener): () => void {
  const state = getState();
  state.listeners.add(listener);
  return () => {
    state.listeners.delete(listener);
  };
}
