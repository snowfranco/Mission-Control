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
