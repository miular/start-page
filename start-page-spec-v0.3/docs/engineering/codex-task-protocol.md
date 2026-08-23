# Codex Task Protocol

## Goal

Prevent long autonomous coding sessions from drifting away from the product specification.

## Task format

Every implementation task should contain:

```text
Goal
Context
Files likely affected
Constraints
Acceptance criteria
Tests required
Out of scope
```

## Example

```text
Goal:
Implement persistent bookmark CRUD.

Context:
See docs/engineering/data-model.md and storage.md.

Files likely affected:
features/bookmarks/
lib/storage/
types/domain.ts

Constraints:
- local-first
- no new dependency
- preserve stable bookmark IDs
- validate http/https

Acceptance:
- add persists
- edit persists
- delete persists
- reload retains state
- invalid URL rejected

Tests:
- unit validation
- component CRUD
- e2e persistence

Out of scope:
- drag/drop
- categories
- cloud sync
```

## Agent loop

```text
Read
 ↓
Plan
 ↓
Inspect
 ↓
Implement
 ↓
Test
 ↓
Review diff
 ↓
Report
```

## Stop conditions

Stop and ask for direction when:
- requirements conflict
- data migration is destructive
- a new dependency appears necessary
- architecture needs a major change
- scope crosses into a deferred roadmap item
- visual design requires a new design-system decision

## Never

Do not silently:
- rewrite the stack
- add authentication
- add backend infrastructure
- replace the design system
- introduce a state library
- add analytics
- add remote content APIs
