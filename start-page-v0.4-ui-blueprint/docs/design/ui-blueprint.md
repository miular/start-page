# Start Page — V0.4 UI/UX Blueprint

## Status

Proposed visual implementation baseline.

## Product principle

This is a browser start page, not a dashboard.

The visual hierarchy must be:

```text
time/date
    ↓
search
    ↓
bookmarks
    ↓
daily quote
    ↓
quiet space
```

The page should feel calm, immediate, and almost invisible during daily use.

---

# 1. Desktop composition

Target viewport:

```text
1440 × 900
```

Conceptual layout:

```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                         09:42                               │
│                    Sunday, August 23                        │
│                                                             │
│                                                             │
│              ╭────────────────────────────╮                 │
│              │  Search the web...     ⌘K │                 │
│              ╰────────────────────────────╯                 │
│                                                             │
│                                                             │
│         ◉ GitHub     ◉ ChatGPT     ◉ Gemini     ＋ Add      │
│                                                             │
│                                                             │
│                  “每日一句小诗……”                            │
│                                                             │
│                                                             │
│                                              ⚙              │
└─────────────────────────────────────────────────────────────┘
```

This is a composition guide, not a pixel-perfect implementation requirement.

---

# 2. Layout zones

Use four semantic zones:

```text
Page
├── Header / utility
├── Hero
│   ├── Clock
│   ├── Date
│   └── Search
├── Bookmark region
└── Quote / footer utility
```

Do not use excessive card containers.

The background should remain visually continuous.

---

# 3. Clock

## Role

The clock is the primary visual anchor.

## Desktop

Suggested:
- large display typography
- visually dominant
- medium/semibold weight
- tight line-height
- tabular numerals where supported

The exact font size is a token and should be tuned visually.

## Date

Placed directly below the clock.

Use a quieter semantic color.

Example:

```text
09:42
Sunday, August 23
```

Avoid unnecessary labels such as:

```text
Current Time
Today
```

---

# 4. Search

Search is the primary interaction.

## Shape

Use a large rounded pill / soft rounded rectangle.

Do not make it look like a conventional browser form.

Suggested hierarchy:

```text
search icon
placeholder
keyboard hint
```

Example:

```text
╭─────────────────────────────────────────────╮
│  ◯   Search the web...                 ⌘ K │
╰─────────────────────────────────────────────╯
```

## States

Must define:

```text
default
hover
focus
active
disabled
```

Focus should be visibly stronger than hover.

## Behavior

- `/` focuses search
- `Ctrl/Cmd + K` focuses search
- Enter submits
- Escape clears transient UI / closes overlays
- empty query should not navigate

---

# 5. Bookmark layout

## Default desktop

Use a compact horizontal collection.

The design should resemble a refined launcher rather than a card grid.

Example:

```text
GitHub    ChatGPT    Gemini    Markdown    + Add
```

Each item contains:

```text
icon
title
optional category
```

## Interaction

Hover:
- subtle lift or luminance change
- no large scale animation

Focus:
- clear keyboard outline

Active:
- short tactile visual response

## Editing

Do not put editing controls permanently on every bookmark.

Use:
- context menu
- settings/edit dialog
- or an explicit edit mode

The normal state should remain visually clean.

---

# 6. Add bookmark

The Add action should be visually secondary.

Suggested:

```text
＋ Add
```

not:

```text
+ ADD NEW WEBSITE
```

The interaction opens a small dialog/popover.

Fields:

```text
Name
URL
Icon (optional)
Category (optional, future-compatible)
```

MVP can keep category hidden or optional.

---

# 7. Quote

The quote is decorative content with emotional value.

It must never compete with search.

Suggested:

```text
“……”
```

with optional attribution below.

Rules:
- max width
- centered
- muted contrast
- comfortable line-height
- no large container card

The quote should feel like text floating in the page rather than a widget.

---

# 8. Settings

Settings should be quiet.

Suggested interaction:

```text
⚙
```

opens a compact panel/dialog.

MVP settings:

```text
Appearance
  System
  Light
  Dark

Search engine
  Google
  ...

Show daily quote
  On / Off
```

Future settings can be added without redesigning the shell.

---

# 9. Responsive behavior

## Large desktop

Use a centered content column.

Do not stretch search to the full viewport.

Suggested max content width:

```text
680–760px
```

Bookmark row may extend slightly beyond the search width.

## Laptop

Maintain the same composition.

Reduce vertical spacing before reducing typography.

## Tablet

```text
clock
search
bookmark wrap
quote
```

Allow bookmarks to wrap naturally.

## Mobile

The page becomes:

```text
clock
date
search
bookmarks
quote
settings
```

Use a single column.

Search width:

```text
calc(100% - 32px)
```

with safe horizontal padding.

Avoid horizontal scrolling.

---

# 10. Spacing system

Use semantic spacing tokens.

Suggested base:

```text
4
8
12
16
20
24
32
40
48
64
80
96
```

Do not use arbitrary values repeatedly.

The composition should have generous vertical whitespace.

---

# 11. Typography

Use the system UI stack first.

Suggested conceptual stack:

```text
-apple-system
BlinkMacSystemFont
"SF Pro Display"
"SF Pro Text"
"Segoe UI"
Roboto
sans-serif
```

Do not ship Apple's proprietary fonts as project assets.

Typography hierarchy:

```text
Clock       display
Date        body-small / muted
Search      body
Bookmark    body-small / medium
Quote       body-large / literary
Settings    body
```

---

# 12. Iconography

Icons should be:
- simple
- monochrome
- visually consistent
- approximately 1.25–1.5px stroke equivalent

Avoid mixing:
- filled icons
- outlined icons
- emoji
- multiple icon styles

Bookmark site icons may be colored by their source; UI controls should remain restrained.

---

# 13. Light theme

Light theme should not be pure white everywhere.

Conceptual layers:

```text
background
    ↓
soft surface
    ↓
glass surface
    ↓
interactive glass
```

Use very low-contrast borders.

The page should feel bright but not sterile.

---

# 14. Dark theme

Dark theme should not simply invert the light theme.

Use:

```text
near-black background
+
slightly lifted surfaces
+
controlled translucent highlights
```

Avoid pure black panels.

Avoid excessive white text.

---

# 15. Glass hierarchy

The product should use no more than three material levels:

```text
Glass 0 — background / no material
Glass 1 — content
Glass 2 — interactive
```

Optional future:

```text
Glass 3 — overlay
```

Do not make every element glass.

Recommended:

```text
Search       Glass 2
Bookmark     Glass 1 / Glass 2 on interaction
Settings     Glass 2
Quote        Glass 0
Clock        Glass 0
```

---

# 16. Glass material behavior

## Baseline

All glass components must remain readable without blur.

## Frosted

Use:
- translucent background
- backdrop blur
- subtle border
- subtle highlight
- restrained shadow

## Enhanced

Future versions may add:
- SVG displacement
- refraction
- chromatic aberration
- environment response

These are progressive enhancements, not MVP requirements.

---

# 17. Motion

Motion should be quiet.

Default transitions:

```text
120–180ms
```

Use:
- opacity
- transform
- subtle blur/luminance changes

Avoid:
- bouncing
- large spring motion
- continuous animation
- decorative particle motion

Reduced motion:

```text
prefers-reduced-motion: reduce
```

should remove or minimize non-essential transitions.

---

# 18. Background

MVP background should be static or extremely subtle.

Do not ship animated wallpapers in MVP.

Future background system may support:

```text
solid
gradient
image
video
ambient
```

but this is deferred.

---

# 19. Accessibility

Minimum requirements:

- semantic landmarks
- keyboard access
- visible focus
- adequate contrast
- screen-reader labels for icon-only buttons
- dialog focus management
- Escape closes dialogs
- reduced motion
- no interaction that depends on hover

Do not use transparency to reduce text contrast.

---

# 20. Empty / first-run state

First launch should not look broken.

Default bookmarks should exist.

Suggested defaults:

```text
GitHub
ChatGPT
Gemini
Markdown editor
```

The user can edit/delete/add them.

---

# 21. Error states

Errors should be quiet and local.

Examples:

Invalid bookmark URL:

```text
Please enter a valid http or https URL.
```

Do not display large error pages.

Search failure should normally fall back to browser navigation rather than show a blocking error.

---

# 22. Dialog design

Dialogs should be compact.

Structure:

```text
Title
Description (optional)

Field
Field

Secondary action     Primary action
```

Keyboard:

```text
Tab → fields/actions
Escape → close
Enter → submit where appropriate
```

---

# 23. Visual restraint rules

Do not:
- add cards around everything
- add gradients to every component
- add glow everywhere
- use excessive shadows
- use huge corner radii on unrelated elements
- animate every hover
- add decorative labels
- add unnecessary icons

The strongest visual feature should remain the material quality and typography.

---

# 24. Visual QA checklist

For each major visual change inspect:

```text
Desktop / Light
Desktop / Dark
Mobile / Light
Mobile / Dark
Keyboard focus
Reduced motion
Reduced transparency / unsupported blur
```

Check:
- alignment
- contrast
- whitespace
- text wrapping
- overflow
- interaction feedback

---

# 25. Design implementation order

Implement visual refinement in this order:

```text
1. layout
2. typography
3. spacing
4. theme
5. interaction states
6. baseline glass
7. responsive refinement
8. motion
9. advanced material effects
```

Do not reverse this order.
