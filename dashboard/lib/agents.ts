/**
 * The nine agents, their hues, and their roles. One source of truth for
 * every panel: the hue an agent gets here is the hue it has everywhere.
 * Palette from dashboard/DESIGN_PLAN.md.
 */

export const AGENT_SLUGS = [
  "sphere",
  "torus",
  "prism",
  "icosa",
  "helix",
  "klein",
  "cardioid",
  "mobius",
  "parabola",
] as const;

export type AgentSlug = (typeof AGENT_SLUGS)[number];

export type AgentMeta = {
  slug: AgentSlug;
  /** Display name (Möbius keeps its umlaut in display, never in the slug). */
  name: string;
  role: string;
  /** Hex hue, mirrored in globals.css as --agent-<slug>. */
  color: string;
  /** CSS variable reference, usable in inline styles. */
  cssVar: string;
};

export const AGENTS: Record<AgentSlug, AgentMeta> = {
  sphere: {
    slug: "sphere",
    name: "Sphere",
    role: "Orchestrator",
    color: "#6fdbef",
    cssVar: "var(--agent-sphere)",
  },
  torus: {
    slug: "torus",
    name: "Torus",
    role: "Scout",
    color: "#8f8af4",
    cssVar: "var(--agent-torus)",
  },
  prism: {
    slug: "prism",
    name: "Prism",
    role: "Analyst",
    color: "#e370e9",
    cssVar: "var(--agent-prism)",
  },
  icosa: {
    slug: "icosa",
    name: "Icosa",
    role: "Architect",
    color: "#5ca0f2",
    cssVar: "var(--agent-icosa)",
  },
  helix: {
    slug: "helix",
    name: "Helix",
    role: "Builder",
    color: "#43d6a9",
    cssVar: "var(--agent-helix)",
  },
  klein: {
    slug: "klein",
    name: "Klein",
    role: "Auditor",
    color: "#b279f0",
    cssVar: "var(--agent-klein)",
  },
  cardioid: {
    slug: "cardioid",
    name: "Cardioid",
    role: "Herald",
    color: "#f1729b",
    cssVar: "var(--agent-cardioid)",
  },
  mobius: {
    slug: "mobius",
    name: "Möbius",
    role: "Steward",
    color: "#e0a63f",
    cssVar: "var(--agent-mobius)",
  },
  parabola: {
    slug: "parabola",
    name: "Parabola",
    role: "Signals",
    color: "#ee8757",
    cssVar: "var(--agent-parabola)",
  },
};

export function isAgentSlug(value: string): value is AgentSlug {
  return (AGENT_SLUGS as readonly string[]).includes(value);
}
