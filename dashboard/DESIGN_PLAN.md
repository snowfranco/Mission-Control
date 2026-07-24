# Mission Control Dashboard: Design Plan

Date: 2026-07-24. Author: [AI] Phase 2 session. The frontend-design skill file at /mnt/skills/public/frontend-design/SKILL.md does not exist on this host [GAP]; this plan follows the two-pass process the Phase 2 brief describes (brainstorm token system, critique against the brief, then build).

## Pass 1: token system

### Color (6 named values plus 9 agent hues)

| Token | Hex | Role |
|-------|-----|------|
| `field` | `#0F1626` | Page background. Deep indigo, not near-black. The cockpit at night. |
| `panel` | `#161F33` | Raised surfaces: cards, sidebar, header. One step up from field. |
| `line` | `#293650` | Borders, separators, wireframe strokes. Visible but quiet. |
| `text` | `#E9EDF7` | Primary text. Cool white. |
| `muted` | `#93A0B8` | Secondary text, timestamps, empty states. |
| `attn` | `#F5A83B` | The one warm accent. Attention, not celebration, not alarm: MRR ribbon fill, pending decision markers, stalled flags. |

Agent hues, cyan / magenta / amber / violet family, one per shape, used consistently everywhere the agent appears:

| Agent | Hex | Note |
|-------|-----|------|
| sphere | `#6FDBEF` | Cyan. The interface itself gets the coolest, clearest hue. |
| icosa | `#5CA0F2` | Azure. |
| torus | `#8F8AF4` | Violet. |
| klein | `#B279F0` | Purple. |
| prism | `#E370E9` | Magenta. |
| cardioid | `#F1729B` | Rose. |
| parabola | `#EE8757` | Coral. |
| mobius | `#E0A63F` | Amber. Deliberate rhyme with `attn`: Möbius is the honesty ledger, and honesty is what the attention color marks. |
| helix | `#43D6A9` | Teal-mint. The builder gets the one green, the "diff added" color. |

### Type

- Display and UI: **Space Grotesk** (via next/font). Precise, geometric, slightly technical without being a terminal cosplay. Used for panel titles, agent names, nav.
- Data: **JetBrains Mono** (via next/font). All numbers, timestamps, file paths, scores, the MRR ticker text. Structural mono means the operator can trust columns to align.
- Body: Space Grotesk at 14px/1.5 for card bodies. Two families total; a third adds nothing.

### Layout

One sentence: a fixed 220px left sidebar of shape-glyph navigation, a full-width top strip whose first 6 pixels are the MRR ribbon itself, and a single scrolling content column of panels that never exceeds 1200px.

```
+------------------------------------------------------------------+
| MRR ribbon (6px fill bar, attn on line)                          |
| $0 of $5,000 target · 23 weeks remaining          MISSION CONTROL|
+----------+-------------------------------------------------------+
| ◍ Decisions |                                                    |
| ◎ Radar     |   [ Panel content: cards, boards, rooms ]          |
| ◇ Pipeline  |                                                    |
| ▣ Portfolio |   max-width 1200px, 24px gutters                   |
| ⬡ Agents    |                                                    |
| ♡ Frameshift|                                                    |
| ----------- |                                                    |
| Tasks Docs  |                                                    |
| Team        |                                                    |
+----------+-------------------------------------------------------+
```

(Glyphs above are ASCII stand-ins; the real nav uses the SVG shape components at sm size.)

### Signature

1. **The MRR ribbon.** A persistent 6px horizontal thread across the very top of every page, filling left to right from $0 to $5,000. Below it, one mono line: `$0 of $5,000 target · 23 weeks remaining`. At $0 the ribbon is a hairline of `attn` on `line`, nearly empty. That emptiness is the point; no encouraging copy ever.
2. **The shape glyph system.** Nine SVG components, each the mathematically real form (torus, icosahedron, cardioid r = 1 + cos θ, Möbius strip...), each in its agent hue, at three sizes: sm 24px (nav, card bylines), md 48px (panel headers), lg 96px (Agent Office rooms, animated). The shapes are not icons decorating labels; they are how authorship reads across the whole interface. A decision card is "from Sphere" because the sphere is on it.

## Pass 2: self-critique

First instinct was a terminal: near-black field, one acid green, everything mono. That is the second flagged AI default and it also fails the brief on its own terms: this cockpit needs nine distinguishable agent hues, and a near-black + neon scheme flattens them into noise. Moved to a deep indigo field where a cyan-to-amber family can actually separate. Second instinct was to give Möbius its own unique hue and keep `attn` reserved; kept the amber rhyme instead, deliberately, because Möbius's whole job (the honest ledger) is what the attention color means, and a tenth distinct hue was starting to look like a paint store. Third correction: the MRR ticker began as a header widget with a progress card; the brief calls that out, so it became the literal top edge of the viewport, a thread the operator cannot not see. Last cut: dropped a planned third font (a serif for report prose) because rendered Möbius markdown can carry mono headers fine, and a serif would drift the whole thing toward the magazine aesthetic the brief forbids. Body text stays Space Grotesk; data stays mono; nothing celebrates.
