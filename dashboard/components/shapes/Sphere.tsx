import { useId } from "react";
import { cn } from "@/lib/utils";
import { AGENTS } from "@/lib/agents";
import { SIZE_PX, type ShapeProps } from "./shape-props";

/**
 * Sphere, the orchestrator. A shaded circle with an orbital arc for
 * depth: the one shape that holds everything else in orbit.
 */
export function Sphere({
  size = "md",
  color = AGENTS.sphere.cssVar,
  className,
  title = "Sphere",
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
        <radialGradient id={`${id}-shade`} cx="38%" cy="34%" r="72%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="55%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
        </radialGradient>
      </defs>
      <g className={size === "lg" ? "mc-anim-pulse" : undefined}>
        {/* Body */}
        <circle
          cx="48"
          cy="48"
          r="30"
          fill={`url(#${id}-shade)`}
          stroke="currentColor"
          strokeWidth="2.5"
        />
        {/* Equatorial ellipse: the hint of a third dimension */}
        <ellipse
          cx="48"
          cy="48"
          rx="30"
          ry="10.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.55"
        />
        {/* Orbital arc, tilted, passing behind then in front */}
        <path
          d="M 8 60 A 46 17 -18 0 1 88 36"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.8"
        />
        <circle cx="88" cy="36" r="3" fill="currentColor" />
      </g>
    </svg>
  );
}
