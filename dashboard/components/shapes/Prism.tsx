import { useId } from "react";
import { cn } from "@/lib/utils";
import { AGENTS } from "@/lib/agents";
import { SIZE_PX, type ShapeProps } from "./shape-props";

/**
 * Prism, the analyst. A triangular prism splitting a beam of light.
 *
 * Construction: front face is the triangle apex (48,18), base (24,66) to
 * (72,66). The solid extrudes along the depth vector (14,-9), giving the
 * back apex (62,9) and back base corner (86,57); only the upper-right
 * quad face and its two connecting edges are visible. A beam enters at
 * the midpoint of the left edge (36,42), kinks through the glass to the
 * exit point (61.5,45) on the right edge (y=45 on the line from (48,18)
 * to (72,66)), then fans into three diverging rays at opacities
 * 0.8/0.5/0.3 over a gradient wedge, all built from currentColor.
 */
export function Prism({
  size = "md",
  color = AGENTS.prism.cssVar,
  className,
  title = "Prism",
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
        {/* Glass shading on the front face, lit from the upper left */}
        <linearGradient id={`${id}-face`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
          <stop offset="55%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.06" />
        </linearGradient>
        {/* Spectral wedge: the split beam fading as it disperses */}
        <linearGradient id={`${id}-split`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <g className={size === "lg" ? "mc-anim-drift" : undefined}>
        {/* Incoming beam, kinked at the left face then crossing the glass */}
        <path
          d="M 6 46 L 36 42 L 61.5 45"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.45"
        />
        {/* Dispersed wedge between the outermost exit rays */}
        <path
          d="M 61.5 45 L 92 30 L 92 58 Z"
          fill={`url(#${id}-split)`}
        />
        {/* Three diverging exit rays */}
        <path d="M 61.5 45 L 92 30" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8" />
        <path d="M 61.5 45 L 92 44" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        <path d="M 61.5 45 L 92 58" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
        {/* Visible upper-right quad face of the extrusion */}
        <path
          d="M 48 18 L 62 9 L 86 57 L 72 66 Z"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.7"
        />
        {/* Front triangular face */}
        <path
          d="M 48 18 L 24 66 L 72 66 Z"
          fill={`url(#${id}-face)`}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
