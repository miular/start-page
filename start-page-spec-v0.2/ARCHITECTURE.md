# ARCHITECTURE.md

## 1. Goal

A small explicit architecture that humans and coding agents can reason about locally.

## 2. Suggested stack

Prefer:
- TypeScript
- React where justified
- Vite or equivalent
- CSS/lightweight styling
- Vitest or equivalent unit/component testing
- Playwright for e2e/visual testing

Avoid framework-specific complexity unless required.

## 3. Directory structure

```text
src/
├── app/
│   ├── App.tsx
│   └── providers/
├── features/
│   ├── search/
│   ├── bookmarks/
│   ├── quote/
│   ├── clock/
│   └── settings/
├── ui/
│   ├── glass/
│   ├── button/
│   ├── dialog/
│   ├── icon/
│   └── input/
├── data/
│   ├── default-bookmarks.ts
│   └── quotes.ts
├── lib/
│   ├── storage/
│   ├── search/
│   ├── favicon/
│   ├── date/
│   └── capabilities/
└── styles/
    ├── tokens.css
    ├── themes.css
    └── globals.css
```

## 4. Dependency direction

```text
app
 ↓
features
 ↓
ui
 ↓
lib/platform utilities
```

Low-level utilities must not import feature-specific modules.

## 5. Feature boundaries

### Search
Owns query, engine selection, shortcuts, submission.

### Bookmarks
Owns CRUD, ordering, validation, rendering.

### Quote
Owns daily selection and presentation.

### Clock
Owns time/date formatting and timer lifecycle.

### Settings
Owns configuration UI and delegates persistence.

Features do not own storage implementation or glass rendering.

## 6. UI primitives

Examples:
- `GlassSurface`
- `Button`
- `IconButton`
- `Input`
- `Dialog`
- `FocusRing`

Keep primitives reusable but explicit.

## 7. Glass architecture

```text
GlassSurface
  ↓
material configuration
  ↓
capability detection
  ↓
renderer
  ├── plain
  ├── frosted
  └── refractive
```

Potential modules:

```text
src/ui/glass/
├── GlassSurface.tsx
├── glass-types.ts
├── glass-tokens.ts
├── glass-capabilities.ts
├── glass-renderer.ts
├── frosted-renderer.ts
├── refractive-renderer.ts
└── index.ts
```

The split can be smaller if the implementation remains simple.

## 8. Capability detection

Centralize:

```ts
type GlassCapabilities = {
  backdropFilter: boolean;
  svgFilter: boolean;
  reducedMotion: boolean;
  reducedTransparency: boolean;
};
```

Do not detect the same capability separately in many components.

## 9. Storage

Use an adapter:

```ts
interface StorageAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}
```

The application should not know whether the implementation is localStorage or IndexedDB.

## 10. Storage keys

```text
start-page.settings
start-page.bookmarks
start-page.schema-version
```

Version from the beginning.

## 11. Search

```text
SearchBar
  ↓
SearchService
  ↓
SearchEngineConfig
  ↓
URL builder
```

The URL builder safely encodes query input.

## 12. URL validation

Normalize user-entered bookmark URLs and require safe schemes.

Do not silently accept unexpected protocols.

## 13. Favicon

```text
BookmarkItem
  ↓
Favicon component
  ↓
Favicon resolver
  ↓
cache/fallback
```

Favicon failure must never block navigation.

## 14. Quote

Use local data and deterministic date-based selection.

## 15. Theme

State:
```text
system | light | dark
```

DOM:
```html
<html data-theme="dark">
```

## 16. State management

Do not introduce a global state library for MVP without a demonstrated need.

Prefer:
- local state
- feature state
- context only for cross-cutting state
- storage adapter for persistence

## 17. Routing

MVP does not need routing. Settings/editing can use dialogs/overlays.

## 18. Error handling

Errors should be explicit and recoverable.

Examples:
- favicon failure → fallback
- invalid URL → validation error
- malformed storage → safe recovery
- unsupported glass → fallback renderer

## 19. Performance

Initial render should not depend on:
- remote APIs
- remote fonts
- analytics
- third-party widgets

## 20. Testing

```text
Unit
 ↓
Component
 ↓
E2E
 ↓
Visual regression
```

Use the lowest layer that gives meaningful confidence.

## 21. Architecture Decision Records

For significant architectural changes use:

```text
docs/adr/
```

Each ADR:
- context
- decision
- alternatives
- consequences
