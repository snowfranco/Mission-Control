import { useId } from "react";
import { cn } from "@/lib/utils";
import { AGENTS } from "@/lib/agents";
import { SIZE_PX, type ShapeProps } from "./shape-props";

/**
 * Klein, the auditor. The classic immersion of the Klein bottle in R3:
 * the closed non-orientable surface, drawn as cubic bezier contours in
 * a 96 unit box. A bulbous body sits low, a tapering neck rises from
 * its top, arcs over to the left, and passes through the body wall:
 * the outline breaks at the crossing (32.5, 43.5) to (28.5, 52.5), the
 * neck continues inside at reduced opacity, and re-emerges as the
 * inner mouth, a foreshortened ellipse rotated -56 degrees whose major
 * axis endpoints meet the two interior neck edges exactly.
 */
export function Klein({
  size = "md",
  color = AGENTS.klein.cssVar,
  className,
  title = "Klein",
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
        <radialGradient id={`${id}-shade`} cx="42%" cy="52%" r="62%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.03" />
        </radialGradient>
      </defs>
      <g className={size === "lg" ? "mc-anim-drift" : undefined}>
        {/* Bulb fill: closed silhouette traced on the same coordinates as the outline */}
        <path
          d="M 45 36 C 40 37.5 35.5 40.5 32.5 43.5 C 30.5 45.5 29.3 49 28.5 52.5 C 28.1 54 27.8 56 27.6 58 C 26 69 29 79 37 84.5 C 47 91 68 89 76 79 C 83.5 69 83 55 77 46 C 72 38.5 64 34.5 58 34 C 53.5 33.7 49 34.4 45 36 Z"
          fill={`url(#${id}-shade)`}
          stroke="none"
        />
        {/* Body outline, broken on the upper left shoulder where the neck passes through the wall */}
        <path
          d="M 32.5 43.5 C 35.5 40.5 40 37.5 45 36 M 58 34 C 64 34.5 72 38.5 77 46 C 83 55 83.5 69 76 79 C 68 89 47 91 37 84.5 C 29 79 26 69 27.6 58 C 27.8 56 28.1 54 28.5 52.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Neck, outer edge: up the right side, over the top, down the left, into the wall break */}
        <path
          d="M 58 34 C 61 26 61 16 55 10 C 48 3.5 34 3 26 9 C 20 13.5 17 19 17 24 C 17.5 33 20 44 28.5 52.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Neck, inner edge: the shorter parallel contour, entering at the top of the break */}
        <path
          d="M 45 36 C 47.5 29 48 22 45 16.5 C 41 10 32 10 28.5 14.5 C 26.5 17 26 19.5 26 22 C 26.2 29 27.5 37 32.5 43.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Neck segment inside the body, continuing both edges to the inner mouth */}
        <g opacity="0.4">
          <path
            d="M 28.5 52.5 C 33 56 38 60 41.5 64.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 32.5 43.5 C 37 47 43 52 46.5 57"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Inner mouth: rim of the tube where it opens into the bulb */}
          <ellipse
            cx="44"
            cy="60.8"
            rx="4.6"
            ry="2.4"
            transform="rotate(-56 44 60.8)"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </g>
      </g>
    </svg>
  );
}
