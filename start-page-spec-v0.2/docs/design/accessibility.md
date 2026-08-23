# Accessibility

## Target

WCAG 2.2 AA.

## Keyboard

All controls must be keyboard reachable.

Required where applicable:
- Tab
- Shift+Tab
- Enter
- Space
- Escape
- Arrow keys

## Focus

Every interactive element needs a visible focus indicator.

## Contrast

Follow WCAG contrast requirements. Glass must not reduce readability or state visibility.

## Reduced motion

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Reduce/disable:
- continuous animation
- elastic movement
- animated refraction
- large transitions

## Reduced transparency

When a reduced-transparency preference is available, use a more opaque material while preserving functionality.

## Semantics

Prefer native:
- button
- a
- input
- dialog
- headings
- lists

over generic clickable divs.

## Dialog

Must:
- have an accessible name
- manage focus
- close with Escape where expected
- restore focus

## Errors

Errors must be understandable, associated with the relevant control, and not conveyed by color alone.

## Verification

Test keyboard-only use, both themes, reduced motion/transparency, focus visibility, and narrow layouts.
