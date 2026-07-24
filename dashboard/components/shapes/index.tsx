import type { AgentSlug } from "@/lib/agents";
import type { ShapeProps } from "./shape-props";
import { Sphere } from "./Sphere";
import { Torus } from "./Torus";
import { Prism } from "./Prism";
import { Icosa } from "./Icosa";
import { Helix } from "./Helix";
import { Klein } from "./Klein";
import { Cardioid } from "./Cardioid";
import { Mobius } from "./Mobius";
import { Parabola } from "./Parabola";

export { Sphere, Torus, Prism, Icosa, Helix, Klein, Cardioid, Mobius, Parabola };
export { SIZE_PX } from "./shape-props";
export type { ShapeProps, ShapeSize } from "./shape-props";

const SHAPES: Record<AgentSlug, (props: ShapeProps) => React.ReactNode> = {
  sphere: Sphere,
  torus: Torus,
  prism: Prism,
  icosa: Icosa,
  helix: Helix,
  klein: Klein,
  cardioid: Cardioid,
  mobius: Mobius,
  parabola: Parabola,
};

/** Render any agent's shape by slug. The glyph is the byline. */
export function AgentShape({
  agent,
  ...props
}: ShapeProps & { agent: AgentSlug }) {
  const Shape = SHAPES[agent];
  return <Shape {...props} />;
}
