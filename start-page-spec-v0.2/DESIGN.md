# DESIGN.md — Start Page Design System v0.2

## 1. Product identity

Start Page is a personal browser operating surface, not a dashboard.

Its job is to make the start screen immediately useful without becoming visually noisy.

## 2. Principles

1. Content first
2. Functional glass
3. Legibility first
4. Minimal motion
5. Instant interaction
6. Progressive enhancement
7. Accessible by default
8. Local first
9. User editable
10. Agent maintainable

## 3. Layer model

```text
Background
  ↓
Content layer
  ↓
Functional/interaction layer
  ↓
Overlays/dialogs
```

Content:
- clock
- date
- quote/poem
- bookmarks

Functional:
- search
- settings
- dialogs
- menus
- interactive states

## 4. Visual hierarchy

1. Search
2. Clock/date
3. Bookmarks
4. Quote
5. Secondary controls

Quote is ambient content and should not compete with search.

## 5. Layout

Use responsive constraints rather than fixed desktop geometry.

Prefer:

```css
width: min(calc(100vw - 32px), 640px);
```

Use `clamp()`, `min()`, `max()`, and spacing tokens.

## 6. Search

Search is the primary interaction.

States:
- idle
- hover
- focus-visible
- active
- disabled if needed

Keyboard:
- `/`
- optionally `Ctrl/Cmd + K`

Enter submits.

Search engine config is data-driven:

```json
{
  "name": "Google",
  "urlTemplate": "https://www.google.com/search?q=%s"
}
```

## 7. Bookmarks

User operations:
- add
- edit
- delete
- reorder
- open

Model:

```ts
type Bookmark = {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category?: string;
  order: number;
};
```

Default bookmarks are seed data, not immutable data.

Suggested initial entries:
- GitHub
- ChatGPT
- Gemini
- Markdown editor

Bookmark visuals should remain light and avoid permanent heavy cards.

## 8. Favicon

Fallback chain:
1. configured icon
2. favicon resolver
3. generated initial
4. generic globe

Failure must not produce a broken-image visual or layout shift.

## 9. Settings

Settings is an overlay/dialog.

Sections:
- Appearance
- Search
- Bookmarks
- Quote
- About

Appearance:
- System
- Light
- Dark

Escape closes; focus returns to trigger.

## 10. Theme

Use:

```html
<html data-theme="system">
```

Supported values:
- `system`
- `light`
- `dark`

## 11. Typography

System-first stack:

```css
font-family:
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

Do not load a remote font for MVP without a product reason.

Roles:
- Display: clock
- Heading
- Body: quote
- Label: bookmark
- Caption

## 12. Spacing

Base scale:

```text
4 8 12 16 20 24 32 40 48 64
```

Avoid one-off arbitrary values.

## 13. Radius

Use:
- `radius-sm`
- `radius-md`
- `radius-lg`
- `radius-xl`
- `radius-pill`

Search: pill. Dialog: large radius.

## 14. Colors

Use semantic tokens:

```text
--color-background
--color-surface
--color-surface-elevated
--color-text-primary
--color-text-secondary
--color-text-tertiary
--color-border
--color-focus
--color-accent
```

## 15. Glass

Conceptual levels:
- `plain`
- `frosted`
- `refractive`

Variants:
- `content`
- `interactive`
- `overlay`

Primary use: interactive/overlay surfaces.

API:

```tsx
<GlassSurface
  variant="interactive"
  enhancement="auto"
>
  ...
</GlassSurface>
```

Feature code must not know implementation details.

## 16. Glass strategy

V1:
- CSS `backdrop-filter`

Enhanced:
- SVG displacement/refraction

Fallback:
- translucent/opaque

No WebGL for ordinary surfaces.

No mouse-following glass in MVP.

## 17. Glass visual behavior

Glass should feel:
- soft
- shallow
- calm
- functional
- integrated

Avoid:
- excessive blur
- strong RGB separation
- giant highlights
- intense glow
- heavy shadows
- elastic movement
- decorative refraction

## 18. Motion

Allowed:
- hover
- focus
- dialog entrance/exit
- restrained theme transition

Not default:
- shimmer
- particles
- animated wallpaper
- continuous distortion
- mouse-following lens

Recommended timings:
- fast: 100–150ms
- normal: 150–250ms
- slow: 250–350ms

## 19. Accessibility

Target WCAG 2.2 AA.

Required:
- keyboard access
- visible focus
- adequate contrast
- semantic HTML
- reduced motion
- reduced transparency
- accessible names
- logical focus

## 20. Quote

Local dataset:

```ts
type Quote = {
  id: string;
  text: string;
  author?: string;
  source?: string;
};
```

Selection must be deterministic by date.

Quote is plain content, not a large glass card.

## 21. Background

MVP:
- solid
- subtle gradient

Future:
- static wallpaper
- user-selected image
- wallpaper-aware material

Not MVP:
- video
- WebGL
- animated particles

## 22. Anti-patterns

Do not:
- make every element a glass card
- make every icon glow
- hide focus
- sacrifice readability for glass
- animate merely to fill space
- make the page resemble a control panel

## 23. Success criteria

A user should be able to:
- immediately know the time
- search without thinking about the UI
- open a favorite in one action
- add their own site without code
- switch theme easily
- use the interface by keyboard
- use reduced motion/transparency
- operate core features without network
