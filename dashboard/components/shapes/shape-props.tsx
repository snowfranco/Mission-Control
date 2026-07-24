export type ShapeSize = "sm" | "md" | "lg";

export const SIZE_PX: Record<ShapeSize, number> = {
  sm: 24,
  md: 48,
  lg: 96,
};

export type ShapeProps = {
  /** sm 24px (list bylines), md 48px (panel headers), lg 96px (office rooms). */
  size?: ShapeSize;
  /** Any CSS color. Defaults to the agent's hue from lib/agents.ts. */
  color?: string;
  className?: string;
  /** Accessible label. Defaults to the agent name. */
  title?: string;
  /** Dim the glyph without changing its hue (inactive nav, idle lists). */
  muted?: boolean;
};
