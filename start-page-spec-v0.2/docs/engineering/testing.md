# Testing Strategy

## Pyramid

```text
Unit
 ↓
Component
 ↓
E2E
 ↓
Visual regression
```

## Unit candidates

- search URL builder
- bookmark validation
- quote selection
- storage serialization
- schema migration
- theme resolution
- capability detection

## Component candidates

- SearchBar
- BookmarkItem
- Add/Edit dialogs
- Settings
- Glass fallback

## E2E critical paths

### Search
Open → focus → query → submit → verify URL.

### Bookmark
Add → reload → verify persistence → edit → delete.

### Theme
Open settings → light → dark → system → verify.

### Settings
Open → keyboard navigation → Escape → focus restoration.

## Accessibility

Verify keyboard navigation, focus, semantics, reduced motion/transparency.

## Visual regression

Capture:
- desktop light
- desktop dark
- mobile light
- mobile dark
- search focused
- settings open
- bookmark focus/hover

## Glass

Test fallback behavior rather than requiring refraction support.

Correctness means:
advanced effect available → enhanced visual
advanced effect unavailable → usable fallback
