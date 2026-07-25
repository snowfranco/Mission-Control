import { subscribe } from "@/lib/watcher";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Server-Sent Events: one connection per dashboard tab. Emits a change
 * event whenever a watched repo file changes; a comment heartbeat every
 * 25 seconds keeps proxies from closing the stream.
 */
export async function GET(request: Request) {
  const encoder = new TextEncoder();

  let cleanup = () => {};
  const stream = new ReadableStream({
    start(controller) {
      const send = (chunk: string) => {
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          // Stream already closed; unsubscribe handles the rest.
        }
      };

      send(`: connected\n\n`);
      const unsubscribe = subscribe((event) => {
        send(`data: ${JSON.stringify(event)}\n\n`);
      });
      const heartbeat = setInterval(() => send(`: ping\n\n`), 25_000);

      cleanup = () => {
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // Already closed.
        }
      };

      request.signal.addEventListener("abort", cleanup);
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
