# Liquid Glass Lab — V0.4

## Purpose

This document defines the experimental material layer.

It is intentionally separate from the product layout.

## Principle

Glass is a material, not a component category.

Use it selectively.

---

# 1. Material levels

```text
Level 0
No glass

Level 1
Frosted content

Level 2
Interactive glass

Level 3
Enhanced/refractive glass (future)
```

---

# 2. CSS baseline

The first implementation should be achievable with standard CSS.

Conceptually:

```css
background:
  color-mix(...);

backdrop-filter:
  blur(...);

border:
  1px solid ...;

box-shadow:
  ...;
```

Exact values are experimental.

---

# 3. Token groups

Create tokens for:

```text
--glass-bg
--glass-bg-hover
--glass-bg-active
--glass-border
--glass-highlight
--glass-shadow
--glass-blur
--glass-saturation
```

Do not hard-code these values in multiple components.

---

# 4. Light/dark

Glass tokens must be theme-aware.

Dark glass should not be implemented as:

```text
light glass + invert
```

Instead define independent semantic values.

---

# 5. Fallback ladder

```text
Enhanced
   ↓
Frosted
   ↓
Translucent
   ↓
Opaque
```

Every level must remain readable.

---

# 6. Capability detection

Prefer feature detection.

Do not use user-agent detection.

Potential capability:

```ts
CSS.supports("backdrop-filter", "blur(1px)")
```

Treat capability detection as an implementation detail of the glass renderer.

---

# 7. Reduced transparency

Where reduced-transparency preference is available, provide a less transparent material.

The UI must remain visually coherent without strong translucency.

---

# 8. Experimental enhancements

Do not implement in the main product until separately tested:

- SVG displacement
- lens distortion
- chromatic aberration
- WebGL refraction
- dynamic environment mapping

A prototype may be built in a separate lab page.

---

# 9. Glass Lab route/page

If a development-only lab is needed, keep it isolated from the production home screen.

Suggested experiments:

```text
Frosted
Interactive
Hover
Pressed
Light
Dark
Reduced transparency
Fallback
```

The lab should make material parameters easy to compare.

---

# 10. Acceptance principle

A glass effect is successful only if users notice the interface as polished rather than noticing the implementation as an effect.

If a material effect:
- harms readability
- increases latency
- causes visual noise
- breaks on common browsers

remove or reduce it.
