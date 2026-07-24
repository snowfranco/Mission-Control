import { useId } from "react";
import { cn } from "@/lib/utils";
import { AGENTS } from "@/lib/agents";
import { SIZE_PX, type ShapeProps } from "./shape-props";

/**
 * Mobius, the steward. A Mobius strip in three quarter perspective.
 * Construction: the band is the parametric surface
 * x = (R + v cos(u/2)) cos u, y = (R + v cos(u/2)) sin u, z = v sin(u/2)
 * with R 25 and half width 13. Its single boundary edge (v = 13, u over
 * 0 to 4pi) was sampled, turned 135 degrees, projected orthographically
 * from 35 degrees of elevation, fitted with cubic beziers, and broken
 * where the band passes behind itself. The two rim paths swap top and
 * bottom through the twist, the two sheet fills overlap at the twist to
 * show the half turn, and four rulings mark the surface direction
 * reversing along the band.
 */
export function Mobius({
  size = "md",
  color = AGENTS.mobius.cssVar,
  className,
  title = "Möbius",
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
        <linearGradient
          id={`${id}-sheet`}
          gradientUnits="userSpaceOnUse"
          x1="14"
          y1="24"
          x2="82"
          y2="72"
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.19" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.11" />
        </linearGradient>
      </defs>
      <g className={size === "lg" ? "mc-anim-spin" : undefined}>
        {/* Near sheet: the front of the band, from the flat back loop into the twist */}
        <path
          d="M15.5 29.3L13 31L10.9 32.8L9.4 34.8L8.4 36.8L8 38.9L8.2 41L8.8 43.1L10.1 45L11.8 46.9L14 48.7L16.6 50.3L19.6 51.7L22.9 52.8L26.5 53.8L30.3 54.5L34.3 55L38.3 55.2L42.4 55.2L46.4 54.9L50.4 54.4L54.2 53.7L57.8 52.8L61.2 51.7L64.3 50.4L67 49L69.5 47.5L71.6 45.9L73.3 44.3L74.7 42.7L75.7 41L79 67.2L76.4 68.6L73.7 69.7L70.9 70.6L67.9 71.3L64.9 71.7L62 71.9L59 71.8L56.2 71.6L53.5 71.1L50.9 70.4L48.5 69.5L46.3 68.5L44.3 67.4L42.5 66.1L41 64.8L39.6 63.3L38.5 61.8L37.7 60.2L37 58.6L36.5 57L36.3 55.4L36.2 53.8L36.2 52.1L36.5 50.6L36.8 49L37.3 47.4L37.9 45.9L38.6 44.5L39.4 43L40.4 41.6Z"
          fill={`url(#${id}-sheet)`}
          stroke="none"
        />
        {/* Far sheet: the return of the band; where it crosses the near sheet the fills stack, marking the half twist */}
        <path
          d="M67.9 48.5L70.5 46.8L72.6 45.1L74.2 43.3L75.4 41.5L76.2 39.7L76.6 38L76.5 36.4L76.1 34.9L75.4 33.5L74.3 32.3L73 31.3L71.4 30.4L69.7 29.8L67.9 29.3L65.9 29L63.9 28.9L61.8 29L59.8 29.3L57.7 29.7L55.7 30.3L53.8 31L51.9 31.8L50.2 32.7L48.5 33.8L46.9 34.9L45.4 36.1L44 37.4L42.7 38.8L41.5 40.2L40.4 41.6L15.5 29.3L18.9 27.7L22.7 26.3L27 25.3L31.6 24.5L36.6 24.2L41.7 24.1L46.9 24.5L52.1 25.2L57.2 26.3L62.1 27.7L66.8 29.5L71.2 31.5L75.1 33.8L78.6 36.3L81.6 39.1L84 41.9L85.9 44.8L87.2 47.8L87.9 50.8L88 53.7L87.5 56.4L86.6 59.1L85.1 61.6L83.2 63.8L80.9 65.8L78.3 67.6L75.5 69L72.4 70.2L69.2 71L66 71.6Z"
          fill={`url(#${id}-sheet)`}
          stroke="none"
        />
        {/* Rim one: boundary edge for u in 0 to 2pi, the top of the back loop sweeping into the twist */}
        <path
          d="M 20.1 27.2 C 18.7 28 14 30.1 12 31.8 C 10 33.6 8.7 35.6 8.2 37.6 C 7.7 39.6 8.1 41.7 9.1 43.6 C 10.2 45.5 12.1 47.4 14.4 49 C 16.8 50.5 20 52 23.3 53 C 26.6 54 30.5 54.7 34.3 55 C 38.2 55.3 42.3 55.3 46.2 54.9 C 50 54.6 53.9 53.9 57.2 52.9 C 60.6 52 63.8 50.7 66.4 49.4 C 69 48 71.2 46.4 72.8 44.9 C 74.4 43.3 75.5 41.6 76.1 40.1 C 76.7 38.6 76.7 37 76.4 35.7 C 76.1 34.4 75.2 33.2 74.2 32.2 C 73.2 31.2 71.7 30.5 70.2 29.9 C 68.7 29.4 66.9 29.1 65.1 29 C 63.3 28.9 61.4 29 59.7 29.3 C 57.9 29.6 56 30.1 54.4 30.7 C 52.7 31.4 51 32.2 49.5 33.1 C 48 34 46.6 35 45.3 36.1 C 44.1 37.2 42.5 39.1 41.9 39.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Rim two: boundary edge for u in 2pi to 4pi, now on the other side of the band; gaps where it passes behind the near sheet */}
        <path
          d="M 41.8 39.7 C 41.4 40.4 39.8 42.3 39.1 43.7 C 38.3 45.1 37.6 46.5 37.1 48 C 36.6 49.5 36.4 51.7 36.2 52.4 M 44.3 67.4 C 45.3 67.9 48.3 69.6 50.7 70.3 C 53 71.1 55.8 71.6 58.5 71.8 C 61.2 72 64.3 71.9 67.1 71.4 C 69.9 71 72.9 70.2 75.5 69 C 78 67.9 80.6 66.3 82.5 64.5 C 84.4 62.7 86 60.6 86.9 58.3 C 87.8 56 88.2 53.4 87.9 50.8 C 87.5 48.3 85.4 44.4 84.8 43 C 84.2 41.6 84.6 42.7 84.5 42.6 M 58 26.5 C 55.7 26.1 48.8 24.6 44.3 24.3 C 39.8 23.9 34.9 24.1 30.9 24.6 C 26.9 25.1 22 26.7 20.3 27.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Rulings: straight lines across the band width; their changing tilt shows the surface turning over */}
        <path
          d="M 36.6 57.3 L 14.4 49 M 49.7 70 L 48.5 54.7 M 87.8 54.9 L 74.8 32.8 M 71 31.4 L 59.7 29.3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>
    </svg>
  );
}
