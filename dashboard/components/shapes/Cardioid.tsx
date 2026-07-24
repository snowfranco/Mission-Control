import { cn } from "@/lib/utils";
import { AGENTS } from "@/lib/agents";
import { SIZE_PX, type ShapeProps } from "./shape-props";

/*
 * Path construction: the polar cardioid r = a(1 - cos t) with a = 29,
 * sampled at 48 uniform steps of t over [0, 2pi) and fitted with cubic
 * Beziers (Catmull-Rom, endpoints clamped so the cusp stays sharp).
 * The curve is asymmetric about its cusp: x spans [-2a, a/4] and y spans
 * +/-(3*sqrt(3)/4)a, so the cusp (the polar origin) is placed at
 * (73.375, 48), which centers the curve's bounding box (x: 15.4 to 80.6,
 * y: 10.3 to 85.7) in the 96 viewBox with roughly 10px of margin.
 * The cusp sits on the right, the round bulge on the left.
 */
const CARDIOID_PATH = `M 73.38 48
C 73.42 48.01 73.46 47.99 73.62 48.03
C 73.78 48.08 74.03 48.12 74.33 48.26
C 74.63 48.39 75.01 48.56 75.41 48.84
C 75.82 49.13 76.29 49.48 76.74 49.94
C 77.19 50.41 77.69 50.97 78.13 51.65
C 78.57 52.33 79.02 53.11 79.38 54.01
C 79.74 54.9 80.07 55.91 80.28 57
C 80.49 58.09 80.63 59.3 80.62 60.56
C 80.62 61.81 80.51 63.17 80.23 64.54
C 79.94 65.91 79.53 67.35 78.94 68.76
C 78.34 70.17 77.59 71.63 76.67 73
C 75.74 74.37 74.64 75.75 73.38 77
C 72.11 78.25 70.67 79.46 69.1 80.5
C 67.52 81.55 65.77 82.51 63.93 83.26
C 62.08 84.02 60.08 84.64 58.03 85.05
C 55.98 85.45 53.8 85.68 51.63 85.67
C 49.45 85.67 47.18 85.46 44.97 85.01
C 42.76 84.57 40.51 83.9 38.37 83.01
C 36.23 82.11 34.09 80.98 32.11 79.66
C 30.14 78.34 28.22 76.78 26.51 75.06
C 24.8 73.34 23.2 71.4 21.83 69.35
C 20.46 67.3 19.26 65.06 18.31 62.76
C 17.35 60.45 16.61 58 16.12 55.54
C 15.63 53.08 15.38 50.51 15.38 48
C 15.38 45.49 15.63 42.92 16.12 40.46
C 16.61 38 17.35 35.55 18.31 33.24
C 19.26 30.94 20.46 28.7 21.83 26.65
C 23.2 24.6 24.8 22.66 26.51 20.94
C 28.22 19.22 30.14 17.66 32.11 16.34
C 34.09 15.02 36.23 13.89 38.37 12.99
C 40.51 12.1 42.76 11.43 44.97 10.99
C 47.18 10.54 49.45 10.33 51.62 10.33
C 53.8 10.32 55.98 10.55 58.03 10.95
C 60.08 11.36 62.08 11.98 63.93 12.74
C 65.77 13.49 67.52 14.45 69.1 15.5
C 70.67 16.54 72.11 17.75 73.38 19
C 74.64 20.25 75.74 21.63 76.67 23
C 77.59 24.37 78.34 25.83 78.94 27.24
C 79.53 28.65 79.94 30.09 80.23 31.46
C 80.51 32.83 80.62 34.19 80.62 35.44
C 80.63 36.7 80.49 37.91 80.28 39
C 80.07 40.09 79.74 41.1 79.38 41.99
C 79.02 42.89 78.57 43.67 78.13 44.35
C 77.69 45.03 77.19 45.59 76.74 46.06
C 76.29 46.52 75.82 46.87 75.41 47.16
C 75.01 47.44 74.63 47.61 74.33 47.74
C 74.03 47.88 73.78 47.92 73.62 47.97
C 73.46 48.01 73.42 47.99 73.38 48
Z`;

/**
 * Cardioid, the herald. The mathematical cardioid r = a(1 - cos t):
 * heart-like but with a true cusp, the singular point every broadcast
 * radiates from, marked with a dot.
 */
export function Cardioid({
  size = "md",
  color = AGENTS.cardioid.cssVar,
  className,
  title = "Cardioid",
  muted = false,
}: ShapeProps) {
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
      <g className={size === "lg" ? "mc-anim-pulse" : undefined}>
        {/* Body: the cardioid curve, faint fill, full-hue outline */}
        <path
          d={CARDIOID_PATH}
          fill="currentColor"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* The cusp point, where r = 0 */}
        <circle cx="73.38" cy="48" r="3" fill="currentColor" />
      </g>
    </svg>
  );
}
