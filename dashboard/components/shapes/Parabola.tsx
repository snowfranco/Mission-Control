import { useId } from "react";
import { cn } from "@/lib/utils";
import { AGENTS } from "@/lib/agents";
import { SIZE_PX, type ShapeProps } from "./shape-props";

/**
 * Parabola, the signals agent. A true parabola with its focus marked:
 * everything that comes in parallel reflects to one point.
 *
 * Construction: the quadratic bezier M 12 24 Q 48 96 84 24 is exactly
 * the parabola y = 60 - (x - 48)^2 / 36 in SVG coordinates (a cup that
 * opens upward on screen). Coefficient a = 1/36 gives focal length
 * 1 / (4a) = 9, so the vertex is (48, 60), the focus is (48, 51), nine
 * units inside the cup along the axis, and the directrix is the
 * mirrored horizontal line y = 69.
 */
export function Parabola({
  size = "md",
  color = AGENTS.parabola.cssVar,
  className,
  title = "Parabola",
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
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.02" />
          <stop offset="70%" stopColor="currentColor" stopOpacity="0.1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      <g className={size === "lg" ? "mc-anim-pulse" : undefined}>
        {/* Axis of symmetry: x = 48 */}
        <line
          x1="48"
          y1="16"
          x2="48"
          y2="78"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 5"
          opacity="0.2"
        />
        {/* Light pooling toward the vertex, inside the cup */}
        <path d="M 12 24 Q 48 96 84 24 Z" fill={`url(#${id}-fill)`} />
        {/* The parabola itself: one quadratic bezier, vertex (48, 60) */}
        <path
          d="M 12 24 Q 48 96 84 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Directrix: y = 69, mirrored from the focus across the vertex */}
        <line
          x1="28"
          y1="69"
          x2="68"
          y2="69"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity="0.35"
        />
        {/* Focus at (48, 51): vertex (48, 60) plus focal length 9 up the axis */}
        <circle
          cx="48"
          cy="51"
          r="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <circle cx="48" cy="51" r="3" fill="currentColor" />
      </g>
    </svg>
  );
}
