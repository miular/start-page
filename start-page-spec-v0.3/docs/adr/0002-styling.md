# ADR 0002 — Styling Strategy

## Status

Accepted

## Decision

Use CSS custom properties and component CSS as the source of truth for the design system.

Tailwind CSS v4 may be used for repetitive layout utilities, but not as the abstraction boundary for GlassSurface.

## Rationale

The project depends on:
- theme variables
- backdrop-filter
- pseudo-elements
- SVG filter enhancement
- reduced-transparency behavior
- material fallbacks

Explicit CSS is easier to inspect and debug.

## Consequence

There will be slightly more CSS than a utility-only project, but the visual system is easier for both humans and coding agents to understand.
