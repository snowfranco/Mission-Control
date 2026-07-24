import { useId } from "react";
import { cn } from "@/lib/utils";
import { AGENTS } from "@/lib/agents";
import { SIZE_PX, type ShapeProps } from "./shape-props";

/**
 * Helix, the builder. A vertical DNA-style double helix: two strands
 * intertwined with rungs between them, work under construction.
 *
 * Construction: both strands follow x = 48 +/- 14*cos(pi*(y-12)/24)
 * for y in [12, 84], one and a half turns, so the strands cross at
 * y = 24, 48, 72. Each half wave is one cubic Bezier whose control
 * offsets are tuned so the midpoint slope matches the true cosine
 * slope (14*pi/24, about 1.83) at the crossings. The back strand is
 * drawn in four segments with gaps around each crossing so the
 * over-under weave reads; six rungs join the strands between crossings.
 */
export function Helix({
  size = "md",
  color = AGENTS.helix.cssVar,
  className,
  title = "Helix",
  muted = false,
}: ShapeProps) {
  const id = useId();
  const px = SIZE_PX[size];

  return (
    <svg
      role="img"
      width={px}
      height={px}
      viewBox="0 0 96 96"
      className={cn(muted && "opacity-50", className)}
      style={{ color }}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={`${id}-strand`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <g className={size === "lg" ? "mc-anim-drift" : undefined}>
        {/* Rungs: horizontal ties in the gaps between crossings */}
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.55">
          <line x1="38.1" y1="18" x2="57.9" y2="18" />
          <line x1="35.1" y1="33" x2="60.9" y2="33" />
          <line x1="35.1" y1="39" x2="60.9" y2="39" />
          <line x1="35.1" y1="57" x2="60.9" y2="57" />
          <line x1="35.1" y1="63" x2="60.9" y2="63" />
          <line x1="38.1" y1="78" x2="57.9" y2="78" />
        </g>
        {/* Back strand: x = 48 - 14*cos, broken around y = 24, 48, 72 */}
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.45"
        >
          <path d="M 34 12 C 34 14.67, 36.77 17.33, 41 20" />
          <path d="M 55 28 C 59.23 30.67, 62 33.33, 62 36 C 62 38.67, 59.23 41.33, 55 44" />
          <path d="M 41 52 C 36.77 54.67, 34 57.33, 34 60 C 34 62.67, 36.77 65.33, 41 68" />
          <path d="M 55 76 C 59.23 78.67, 62 81.33, 62 84" />
        </g>
        {/* Front strand: x = 48 + 14*cos, unbroken, one cubic per half wave */}
        <path
          d="M 62 12 C 62 20.7, 34 27.3, 34 36 C 34 44.7, 62 51.3, 62 60 C 62 68.7, 34 75.3, 34 84"
          fill="none"
          stroke={`url(#${id}-strand)`}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
