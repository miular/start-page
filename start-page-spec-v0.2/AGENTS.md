# AGENTS.md — Coding Agent Contract

## Purpose

This is the operating contract for Codex and other coding agents working on Start Page.

Optimize for correctness, maintainability, minimal scope, accessibility, performance, and consistency.

## Mandatory reading

Before a non-trivial change:
1. `README.md`
2. `DESIGN.md`
3. `ARCHITECTURE.md`
4. Relevant `docs/`
5. Existing implementation and tests

## Scope discipline

### Do
- Solve the requested problem.
- Reuse existing primitives.
- Preserve user data.
- Preserve keyboard accessibility.
- Preserve light/dark/system behavior.
- Preserve reduced-motion/transparency behavior.
- Add tests for changed behavior.

### Do not
- Add unrelated features.
- Rewrite the UI for a small bug.
- Add dependencies without justification.
- Add backend/auth/cloud infrastructure to V1.
- Add continuous animation for decoration.
- Turn every element into a glass card.

## Architecture rules

- Feature logic: `src/features/`
- Shared UI: `src/ui/`
- Storage: `src/lib/storage/`
- Search logic: `src/lib/search/`
- Favicon logic: `src/lib/favicon/`
- Capability detection: `src/lib/capabilities/`
- Tokens: centralized under `src/styles/`
- Glass rendering: behind `GlassSurface`
- UI must not directly call browser storage APIs
- Default data must be separated from user data

## Liquid Glass rules

Use:

```tsx
<GlassSurface variant="interactive" enhancement="auto">
  ...
</GlassSurface>
```

Do not implement raw glass effects inside feature components.

Forbidden pattern:

```tsx
<div style={{ backdropFilter: "blur(18px)" }}>
```

Forbidden pattern:

```tsx
<LiquidGlass blur={17} saturation={143} aberration={0.27} />
```

Material levels:
- `plain`
- `frosted`
- `refractive`

Fallback chain:

```text
refractive → frosted → translucent/opaque
```

Advanced glass is never a functional dependency.

## Design token rules

Prefer existing semantic tokens. Do not change a global token to fix a local bug.

If a new token is required:
1. Search for an existing token.
2. Classify it as primitive or semantic.
3. Add the smallest appropriate token.
4. Explain affected components.

## Accessibility

Respect:
- keyboard navigation
- visible focus
- semantic HTML
- accessible names
- logical focus order
- `prefers-reduced-motion`
- reduced-transparency behavior
- forced colors where applicable

Dialogs must manage focus correctly.

## State coverage

Interactive components should consider:
- idle
- hover
- focus-visible
- active/pressed
- disabled where relevant
- loading/error where relevant

Never communicate important state through color alone.

## Data safety

Bookmarks and settings are user data.

Never perform destructive migrations without a migration strategy. Never silently overwrite user data.

## Dependency policy

Before adding a dependency, answer:
1. Why is it required?
2. Can the Web Platform solve it?
3. Runtime/bundle cost?
4. Maintenance cost?
5. Agent maintainability impact?
6. Is it needed for MVP?

If the justification is weak, do not add it.

## Testing

Critical flows:
- search
- bookmark open
- add/edit/delete/reorder
- persistence
- theme switching
- settings open/close
- keyboard navigation

## Visual verification

For visual changes inspect:
- light
- dark
- desktop
- narrow viewport
- keyboard focus
- reduced motion/transparency

## Performance

Avoid unnecessary:
- blocking network requests
- large assets
- animation loops
- DOM measurements
- global listeners
- rerenders

Core functionality must work without network access.

## Change summary

End meaningful implementation work with:

```text
Changed:
- ...

Tests:
- ...

Visual verification:
- ...

Potential follow-up:
- ...
```
