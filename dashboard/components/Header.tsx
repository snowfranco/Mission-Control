import { MRRTicker, type MRRTickerProps } from "@/components/MRRTicker";

/**
 * The top strip of every page. Its first pixels are the MRR ribbon:
 * the north star as a persistent thread, not a widget.
 */
export function Header(props: MRRTickerProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-field/95 backdrop-blur">
      <MRRTicker {...props} />
    </header>
  );
}

/** Shown when portfolio.yaml is unreadable. Specific, not soothing. */
export function HeaderError({ error }: { error: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-field/95 backdrop-blur">
      <div className="h-1.5 w-full bg-line/60" aria-hidden />
      <div className="flex items-baseline justify-between px-4 py-2 sm:px-6">
        <span className="font-mono text-xs text-destructive">{error}</span>
        <span className="font-sans text-xs font-medium tracking-[0.25em] text-muted-foreground">
          MISSION CONTROL
        </span>
      </div>
    </header>
  );
}
