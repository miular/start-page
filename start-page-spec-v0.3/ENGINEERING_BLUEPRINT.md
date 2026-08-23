# Start Page — V0.3 Engineering Blueprint

**Status:** Proposed implementation baseline  
**Goal:** Convert V0.2 product/design decisions into an implementation contract suitable for Codex.

## 1. Recommended stack

| Layer | Decision | Reason |
|---|---|---|
| Language | TypeScript | Strong contracts and agent-readable code |
| UI | React | Small component model, mature ecosystem |
| Build | Vite | Lightweight static-app workflow |
| Styling | CSS-first + optional Tailwind utilities | Glass/material CSS needs precise control |
| State | React local state/context | MVP does not justify a state library |
| Persistence | localStorage behind adapter | Small local-first dataset |
| Unit/component tests | Vitest + Testing Library | Fast local feedback |
| E2E | Playwright | Browser-level verification |
| Formatting/lint | ESLint + Prettier | Stable agent conventions |
| Package manager | pnpm preferred | Fast, reproducible workspace tooling |

React's current docs list React 19.2 as the latest major line and document first-class TypeScript support. Vite's current guide provides a React TypeScript template and is designed for lean modern web projects. React also explicitly says Create React App is deprecated, so it is not a candidate for this project.

## 2. Styling decision

### Decision

Use **CSS-first design tokens and component styles**, with Tailwind CSS only where it improves repetitive layout composition.

Do not make Tailwind the material system.

### Why

The project has a custom visual language:
- semantic material levels
- CSS variables
- backdrop filters
- SVG filters
- theme-dependent opacity
- reduced-transparency fallbacks
- carefully controlled pseudo-elements

These are easier for both humans and agents to understand when the material implementation is explicit.

Tailwind v4 is viable with Vite and has a first-party Vite plugin, but using it for every style would make the glass implementation less explicit. Tailwind v4 also targets modern browsers, which aligns with a browser start page but should remain an explicit compatibility decision.

## 3. Runtime target

Primary:
- current Chromium
- current Safari
- current Firefox

Do not optimize MVP for obsolete browsers.

The page should degrade gracefully when specific CSS material features are unavailable.

## 4. Project structure

```text
start-page/
├── AGENTS.md
├── README.md
├── DESIGN.md
├── ARCHITECTURE.md
├── ROADMAP.md
├── ENGINEERING_BLUEPRINT.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── AppShell.tsx
│   │
│   ├── features/
│   │   ├── search/
│   │   ├── bookmarks/
│   │   ├── quote/
│   │   ├── clock/
│   │   └── settings/
│   │
│   ├── ui/
│   │   ├── glass/
│   │   ├── button/
│   │   ├── input/
│   │   ├── dialog/
│   │   └── icon/
│   │
│   ├── data/
│   │   ├── default-bookmarks.ts
│   │   ├── search-engines.ts
│   │   └── quotes.ts
│   │
│   ├── lib/
│   │   ├── storage/
│   │   ├── search/
│   │   ├── favicon/
│   │   ├── date/
│   │   └── capabilities/
│   │
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── themes.css
│   │   ├── glass.css
│   │   └── globals.css
│   │
│   └── types/
│       └── domain.ts
│
├── tests/
│   ├── unit/
│   ├── components/
│   └── e2e/
│
└── docs/
    ├── design/
    ├── engineering/
    └── adr/
```

## 5. Domain contracts

```ts
export type ThemeMode = "system" | "light" | "dark";

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category?: string;
  order: number;
};

export type SearchEngine = {
  id: string;
  name: string;
  urlTemplate: string;
};

export type Quote = {
  id: string;
  text: string;
  author?: string;
  source?: string;
};

export type Settings = {
  theme: ThemeMode;
  searchEngineId: string;
  showQuote: boolean;
};
```

## 6. Component contracts

### GlassSurface

```ts
type GlassSurfaceProps = {
  variant?: "content" | "interactive" | "overlay";
  enhancement?: "auto" | "frosted" | "plain";
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  className?: string;
};
```

The component owns material rendering. Consumers do not know whether the renderer is CSS-only or enhanced.

### SearchBar

```ts
type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
};
```

### BookmarkItem

```ts
type BookmarkItemProps = {
  bookmark: Bookmark;
  onOpen: (bookmark: Bookmark) => void;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (bookmark: Bookmark) => void;
};
```

## 7. Services

### SearchService

Responsibilities:
- encode query
- build URL
- submit navigation

Non-responsibilities:
- rendering
- search history
- network fetching

### BookmarkService

Responsibilities:
- validate URL
- normalize URL
- CRUD
- ordering

### StorageAdapter

Responsibilities:
- persistence
- parse/serialize
- safe recovery

No feature component directly accesses localStorage.

## 8. Theme architecture

Store user preference as:

```text
system | light | dark
```

Resolve effective theme separately.

Do not store `resolvedDark: boolean` as the source of truth.

## 9. Keyboard architecture

Global shortcuts belong in one feature-level hook:

```text
useGlobalShortcuts()
```

MVP:
- `/` → focus search unless user is typing in another editable control
- `Ctrl/Cmd + K` → focus search
- `Escape` → close active dialog/overlay

Do not scatter global `keydown` listeners across components.

## 10. Clock architecture

Clock owns:
- interval lifecycle
- locale formatting
- current date/time presentation

Clock updates must not rerender bookmark data or settings.

## 11. Daily quote algorithm

Use a stable date seed:

```text
YYYY-MM-DD
        ↓
hash
        ↓
index % quoteCount
```

The same user sees the same quote all day without storage or network.

## 12. Bookmark persistence

On first run:
- load stored bookmarks
- if absent, clone default bookmarks
- persist user-owned copy

Never mutate the imported default array.

## 13. URL safety

Accept normal web destinations:
- `https:`
- `http:`

Do not permit arbitrary schemes such as:
- `javascript:`
- `data:`
- other executable/custom schemes unless explicitly designed later.

## 14. Favicon strategy

MVP:
1. explicit icon if configured
2. favicon URL derived from origin where appropriate
3. initials fallback
4. generic icon

Favicon loading must not delay page interaction.

## 15. Glass renderer

```text
GlassSurface
    ↓
useGlassCapabilities()
    ↓
reduced transparency?
    ├── yes → plain
    └── no
         ↓
enhancement?
    ├── plain → plain
    ├── frosted → frosted
    └── auto → best supported renderer
```

V0.3 does not require a third-party Liquid Glass library.

## 16. CSS token layers

```text
primitive tokens
      ↓
semantic tokens
      ↓
component tokens
```

Example:

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --radius-pill: 999px;
}

[data-theme="light"] {
  --color-background: ...;
  --color-surface: ...;
}

[data-theme="dark"] {
  --color-background: ...;
  --color-surface: ...;
}
```

Exact visual values should be tuned in Design Lab rather than invented in feature components.

## 17. Agent constraints

Codex should prefer:
- explicit files
- small functions
- named types
- predictable exports
- no clever abstractions
- no hidden global state
- tests adjacent to behavior where practical

Avoid:
- barrel-file overuse
- giant components
- generic `utils.ts`
- implicit magic configuration
- one-file application architecture

## 18. Build commands

Target:

```text
pnpm dev
pnpm build
pnpm test
pnpm test:e2e
pnpm lint
pnpm format:check
```

The actual scripts are implementation details and must be established in the scaffold.

## 19. Definition of implementation readiness

The project is ready for Codex implementation when:
- V0.2 docs are present
- this blueprint is present
- package/tool versions are resolved
- repository is initialized
- agent contract is present
- first task is small and testable
