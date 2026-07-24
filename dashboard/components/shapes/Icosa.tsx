import { useId } from "react";
import { cn } from "@/lib/utils";
import { AGENTS } from "@/lib/agents";
import { SIZE_PX, type ShapeProps } from "./shape-props";

/**
 * Icosa, the architect. An icosahedron projected along a 3-fold axis:
 * wireframe throughout, with the four front-facing cap faces filled so
 * the near side reads solid.
 *
 * Construction: viewed down an axis through two opposite faces, the six
 * equatorial vertices of an icosahedron project to a regular hexagon and
 * the two end faces project to triangles at radius R divided by phi
 * (phi = 1.618..., the exact ratio of this projection). With center
 * (48,48) and R = 34:
 *   hexagon, every 60 deg from the top: (48,14), (77.44,31), (77.44,65),
 *     (48,82), (18.56,65), (18.56,31), using 34*cos30 = 29.44 and
 *     34*sin30 = 17.
 *   front triangle, radius 34/phi = 21.01, apex up, aligned with
 *     alternate hexagon vertices: (48,26.99), (66.2,58.51), (29.8,58.51),
 *     using 21.01*cos30 = 18.2 and 21.01*sin30 = 10.51.
 *   back triangle, same radius, rotated 60 deg (apex down): (66.2,37.49),
 *     (48,69.01), (29.8,37.49).
 * Each end-face vertex connects to its three nearest hexagon vertices,
 * giving all 30 edges: 18 in front, 12 hidden behind.
 */
export function Icosa({
  size = "md",
  color = AGENTS.icosa.cssVar,
  className,
  title = "Icosa",
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
        {/* Volume shading across the whole solid, lit from the upper left */}
        <radialGradient id={`${id}-depth`} cx="38%" cy="34%" r="75%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.16" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.06" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
        </radialGradient>
      </defs>
      <g className={size === "lg" ? "mc-anim-spin" : undefined}>
        {/* Body: hexagonal silhouette under the depth gradient */}
        <path
          d="M 48 14 L 77.44 31 L 77.44 65 L 48 82 L 18.56 65 L 18.56 31 Z"
          fill={`url(#${id}-depth)`}
        />
        {/* Hidden edges: back triangle plus its nine spokes to the hexagon */}
        <path
          d="M 66.2 37.49 L 48 69.01 L 29.8 37.49 Z
             M 66.2 37.49 L 48 14
             M 66.2 37.49 L 77.44 31
             M 66.2 37.49 L 77.44 65
             M 48 69.01 L 77.44 65
             M 48 69.01 L 48 82
             M 48 69.01 L 18.56 65
             M 29.8 37.49 L 18.56 65
             M 29.8 37.49 L 18.56 31
             M 29.8 37.49 L 48 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.3"
        />
        {/* Front cap, four filled faces: the end face and its three neighbors */}
        <path d="M 48 26.99 L 66.2 58.51 L 29.8 58.51 Z" fill="currentColor" fillOpacity="0.25" />
        <path d="M 48 26.99 L 29.8 58.51 L 18.56 31 Z" fill="currentColor" fillOpacity="0.15" />
        <path d="M 48 26.99 L 77.44 31 L 66.2 58.51 Z" fill="currentColor" fillOpacity="0.08" />
        <path d="M 66.2 58.51 L 48 82 L 29.8 58.51 Z" fill="currentColor" fillOpacity="0.08" />
        {/* Visible edges: front triangle and its nine spokes to the hexagon */}
        <path
          d="M 48 26.99 L 66.2 58.51 L 29.8 58.51 Z
             M 48 26.99 L 48 14
             M 48 26.99 L 77.44 31
             M 48 26.99 L 18.56 31
             M 66.2 58.51 L 77.44 31
             M 66.2 58.51 L 77.44 65
             M 66.2 58.51 L 48 82
             M 29.8 58.51 L 18.56 31
             M 29.8 58.51 L 18.56 65
             M 29.8 58.51 L 48 82"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Silhouette: the six equatorial edges */}
        <path
          d="M 48 14 L 77.44 31 L 77.44 65 L 48 82 L 18.56 65 L 18.56 31 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
