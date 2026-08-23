# MVP Implementation Plan

## Phase 0 — Scaffold

- initialize TypeScript project
- establish lint/format
- establish tests
- establish e2e
- create directory structure
- create token/theme files
- add agent rules

Acceptance:
- dev server starts
- production build succeeds
- tests run
- dependency list is justified

## Phase 1 — App shell

- AppShell
- background
- responsive container
- settings trigger
- typography
- theme

## Phase 2 — Core content

- Clock
- Date
- Quote
- deterministic daily selection

## Phase 3 — Search

- SearchBar
- engine config
- Enter
- `/`
- optional Ctrl/Cmd+K
- safe URL encoding

## Phase 4 — Bookmarks

- model
- seed data
- grid
- open
- favicon
- add/edit/delete/reorder
- persistence

## Phase 5 — Settings

- dialog/panel
- theme
- search engine
- bookmark management
- quote visibility

## Phase 6 — Glass

- GlassSurface
- frosted renderer
- capability detection
- fallback
- reduced-transparency
- optional refraction prototype

## Phase 7 — Quality

- unit/component tests
- e2e
- accessibility review
- visual regression
- performance review

## Phase 8 — Design freeze

- remove unused dependencies
- remove dead code
- verify tokens
- verify docs
- verify agent instructions
- freeze MVP scope
