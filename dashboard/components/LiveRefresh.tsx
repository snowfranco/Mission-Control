"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Mounts an SSE subscription to /api/stream and refreshes the route
 * (re-running server reads) when a relevant file changes. Debounced
 * 200ms so a burst of edits produces one re-render.
 *
 * watch: repo-relative path prefixes this page cares about, e.g.
 * ["queues/decisions.jsonl"] or ["reports/torus/"].
 */
export function LiveRefresh({ watch }: { watch: string[] }) {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const source = new EventSource("/api/stream");
    source.onmessage = (message) => {
      let event: { path?: string };
      try {
        event = JSON.parse(message.data);
      } catch {
        return;
      }
      const path = event.path ?? "";
      if (!watch.some((prefix) => path.startsWith(prefix))) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => router.refresh(), 200);
    };
    return () => {
      if (timer.current) clearTimeout(timer.current);
      source.close();
    };
    // watch is a literal array per call site; joining keeps the dep stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, watch.join("|")]);

  return null;
}
