# ADR 0001 — Frontend Stack

## Status

Accepted for MVP baseline

## Context

The project is a browser start page:
- static
- local-first
- highly interactive
- no server required
- visually custom
- intended for long-term maintenance
- expected to be developed substantially by Codex

## Decision

Use:
- React
- TypeScript
- Vite
- CSS-first styling
- optional Tailwind v4 for utility composition
- localStorage behind an adapter
- Vitest/Testing Library
- Playwright

## Rationale

React provides a mature component model and TypeScript support. Vite provides a lean modern build workflow and a React TypeScript template. React's current documentation also states that Create React App is deprecated.

CSS-first styling keeps the custom material system explicit. Tailwind v4 remains optional because its Vite integration is first-party, but the project should not hide material logic behind utility classes.

## Rejected

### Next.js

Not needed for a purely local browser start page. SSR/route/server features add complexity without MVP value.

### Create React App

Deprecated according to current React documentation.

### Full UI component library

Would constrain the custom glass/material language and add unnecessary surface area.

### Global state library

No demonstrated MVP need.

### Backend

No MVP requirement.

## Consequences

The repository remains small and static. Future cloud sync can be introduced behind service interfaces rather than forcing the MVP to contain a backend.
