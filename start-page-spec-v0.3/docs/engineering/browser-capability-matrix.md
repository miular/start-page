# Browser Capability Matrix

## Principle

Feature detection beats browser-name detection.

## Capability groups

### Baseline
- CSS custom properties
- modern JavaScript
- ES modules
- standard DOM APIs

### Glass
- `backdrop-filter`
- SVG filters
- CSS compositing features

### Accessibility
- `prefers-reduced-motion`
- reduced-transparency support where exposed

## Rules

Do not write:

```ts
if (browser === "Safari") ...
```

Prefer capability checks.

## Fallback

Every visual enhancement must have a usable baseline.

```text
enhanced
  ↓
frosted
  ↓
opaque
```

The product must remain functional at the bottom of the chain.
