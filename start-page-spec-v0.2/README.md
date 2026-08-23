# Start Page

**Version:** 0.2  
**Status:** Design/Engineering Specification for MVP  
**Design language:** Minimal Apple-inspired UI with restrained Liquid Glass  
**Primary development agent:** Codex

## Product statement

Start Page is a personal browser operating surface: a fast, calm page that appears when the browser opens and immediately provides context and access to the user's most-used destinations.

The MVP centers on:
1. Time/date
2. Daily poem/quote
3. Web search
4. Editable favorite websites
5. Appearance/settings

It is deliberately not a dashboard.

## Core principles

- Content first
- Functional glass
- Legibility before visual effects
- Minimal motion
- Instant interaction
- Progressive enhancement
- Accessible by default
- Local-first data
- User-editable configuration
- Agent-maintainable architecture
- Small dependency surface
- Strict MVP scope

## MVP included

- Responsive single-page start screen
- Light/dark/system theme
- Live clock/date
- Deterministic daily quote/poem
- Configurable search engine
- Search keyboard shortcuts
- Editable bookmarks: add/edit/delete/reorder
- Favicon with graceful fallback
- Settings overlay
- Local persistence
- Keyboard navigation
- Reduced-motion support
- Reduced-transparency support
- `GlassSurface` abstraction
- CSS frosted glass
- Optional SVG refraction enhancement
- Progressive fallback
- Unit/component/e2e tests
- Agent documentation

## Explicitly not V1

- Accounts
- Cloud sync
- Backend/database
- Weather
- Calendar
- Todo
- News/RSS
- AI assistant
- WebGL background
- Animated wallpaper
- Complex widgets
- Browser-history integration
- Social integrations

## Repository map

```text
start-page/
├── AGENTS.md
├── README.md
├── DESIGN.md
├── ARCHITECTURE.md
├── ROADMAP.md
├── docs/
│   ├── design/
│   │   ├── visual-system.md
│   │   ├── glass-system.md
│   │   ├── accessibility.md
│   │   └── responsive.md
│   └── engineering/
│       ├── data-model.md
│       ├── storage.md
│       ├── testing.md
│       ├── performance.md
│       └── mvp-implementation-plan.md
├── src/
├── tests/
└── design-lab/
```

## Definition of done

A feature is complete only when it is functional, responsive, keyboard accessible, focus-visible, usable in light/dark themes, compatible with reduced motion/transparency, tested appropriately, and consistent with the design system.

## Agent workflow

1. Read `AGENTS.md`.
2. Read relevant `DESIGN.md` sections.
3. Read relevant architecture docs.
4. Inspect existing code/tests.
5. Make the smallest coherent change.
6. Run tests.
7. Review the diff for scope creep.

## Design statement

> A fast, minimal, local-first personal browser start page where content remains lightweight and Liquid Glass is reserved for meaningful interaction.
