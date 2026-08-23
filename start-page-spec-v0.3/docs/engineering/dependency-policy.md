# Dependency Policy

## Principle

Every dependency is a maintenance surface.

## Approval questions

Before adding a dependency:
1. Is the Web Platform insufficient?
2. Is the dependency actively maintained?
3. Is it small enough for a start page?
4. Does it improve reliability rather than merely convenience?
5. Does it make Codex reasoning easier or harder?
6. Can the same capability be implemented in <100 lines without reducing quality?

## Initial dependency posture

Expected:
- React
- React DOM
- TypeScript
- Vite
- test tooling
- lint/format tooling

Potential:
- Tailwind CSS v4

Avoid initially:
- animation libraries
- UI component megasuites
- state management libraries
- router
- date libraries
- icon megasuites

## Icon policy

Prefer a small curated icon set or local SVG components over a large icon package if only a handful of icons are needed.

## Glass policy

Do not install a Liquid Glass library just because it exists.

First implement:
- CSS blur
- semantic tokens
- fallback
- capability detection

Only add a specialized library after a measured prototype demonstrates a meaningful benefit.
