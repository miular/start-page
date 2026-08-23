# Performance Specification

## Principle

A start page is opened frequently; small repeated costs matter.

## Initial load

Do not block on:
- remote APIs
- remote fonts
- analytics
- third-party widgets
- unnecessary image downloads

## JavaScript

Keep initial JS small. Avoid heavyweight libraries for small utilities.

## Rendering

Avoid unnecessary:
- DOM depth
- layout measurements
- global listeners
- animation loops
- state updates

Clock updates must not cause unrelated components to rerender.

## Glass

Prefer:
- small surfaces
- restrained blur
- limited simultaneous glass
- no full-screen glass
- no continuous distortion

If refraction hurts performance, fall back to frosted.

## Network

Core UI must work without network access:
- clock
- quote
- bookmarks
- settings
- search URL generation

## Acceptance

The MVP should feel instantaneous on a normal modern desktop browser. Measure actual bundle/rendering performance during implementation rather than inventing unsupported benchmark numbers.
