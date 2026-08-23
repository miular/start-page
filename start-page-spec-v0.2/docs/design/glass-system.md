# Glass System

## Purpose

Define the Liquid Glass material boundary.

## Rule

Glass is a functional material, not universal decoration.

Primary uses:
- search
- settings
- dialogs
- overlays
- meaningful selected/active states

## Levels

### Plain
No glass. Used for content.

### Frosted
Native CSS blur/transparency. V1 baseline.

### Refractive
Optional optical enhancement using SVG displacement/refraction.

## Renderer selection

```text
if reducedTransparency
    plain/opaque
else if refraction available and enabled
    refractive
else if backdrop-filter available
    frosted
else
    translucent/opaque
```

## Restraint

Avoid:
- excessive blur
- strong RGB separation
- giant highlights
- intense glow
- animated refraction
- mouse-following lenses

## Research policy

Open-source Liquid Glass projects may be studied for:
- headless lens abstractions
- SVG displacement
- SDF geometry
- capability detection
- progressive enhancement
- design tokens
- accessibility

Borrow concepts, not architecture wholesale.

## API

```tsx
<GlassSurface variant="interactive" enhancement="auto">
  ...
</GlassSurface>
```

## Design Lab

Maintain `design-lab/glass/` for parameter experiments across light/dark/gradient/image backgrounds.

## Performance

Functional responsiveness wins over optical fidelity.
