import { useId } from "react";
import { cn } from "@/lib/utils";
import { AGENTS } from "@/lib/agents";
import { SIZE_PX, type ShapeProps } from "./shape-props";

/**
 * Torus, the scout. A donut seen in three-quarter perspective.
 *
 * Construction: the outer silhouette is an ellipse centered at (48, 48)
 * with rx 32, ry 20. The hole is a smaller ellipse (rx 13, ry 6.5)
 * centered at (48, 44), offset 4 units upward so the near rim reads as
 * closer to the viewer. Both are combined in one even-odd path so the
 * hole is truly transparent under the gradient fill. The inner-wall arc
 * shares the hole's endpoints but uses a larger vertical radius, tracing
 * the tube surface visible below the hole, and a ridge arc above the
 * hole follows the crest of the tube.
 */
export function Torus({
  size = "md",
  color = AGENTS.torus.cssVar,
  className,
  title = "Torus",
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
        <radialGradient id={`${id}-shade`} cx="42%" cy="32%" r="75%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
          <stop offset="55%" stopColor="currentColor" stopOpacity="0.16" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      <g className={size === "lg" ? "mc-anim-spin" : undefined}>
        {/* Ring surface: outer ellipse minus the hole, even-odd fill */}
        <path
          d="M 16 48 A 32 20 0 1 0 80 48 A 32 20 0 1 0 16 48 Z M 35 44 A 13 6.5 0 1 0 61 44 A 13 6.5 0 1 0 35 44 Z"
          fill={`url(#${id}-shade)`}
          fillRule="evenodd"
        />
        {/* Outer rim */}
        <ellipse
          cx="48"
          cy="48"
          rx="32"
          ry="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        {/* Hole rim, lifted 4 units to sell the tilt */}
        <ellipse
          cx="48"
          cy="44"
          rx="13"
          ry="6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Inner wall of the tube, dipping below the hole */}
        <path
          d="M 35 44 A 13 10 0 0 0 61 44"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.55"
        />
        {/* Ridge along the tube crest, curving away above the hole */}
        <path
          d="M 24 45 A 26 12 0 0 1 72 45"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.4"
        />
      </g>
    </svg>
  );
}
