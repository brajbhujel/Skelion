---
sidebar_position: 2
---

# Animations

Skelion provides 4 animation styles. Defaults are tuned so motion feels like a load state, not a strobe: **2s linear shimmer** at **110deg**, **1.8s pulse**.

## Animation Variants

### Pulse (Default)

A gentle opacity fade. Least distracting.

```tsx
<Skeleton loading={true} animation="pulse">
  <YourComponent />
</Skeleton>
```

### Shimmer

A narrow highlight that crawls across the bones. Shared across an auto-skeleton so small text lines don't flash faster than large blocks.

```tsx
<Skeleton loading={true} animation="shimmer">
  <YourComponent />
</Skeleton>
```

### Wave

A light band sweeping via a `::after` pseudo-element.

```tsx
<Skeleton loading={true} animation="wave">
  <YourComponent />
</Skeleton>
```

### Solid

No animation — a static placeholder. Also used automatically when the user has `prefers-reduced-motion: reduce`.

```tsx
<Skeleton loading={true} animation="solid">
  <YourComponent />
</Skeleton>
```

## Custom Duration

Duration is in seconds. Default is `2`. Pulse uses `1.8` unless you override.

```tsx
<Skeleton loading={true} animation="shimmer" duration={2.4}>
  <YourComponent />
</Skeleton>
```

```css
:root {
  --skeleton-duration: 2s;
  --skeleton-angle: 110deg;
}
```

## Stagger and exit fade

```tsx
<Skeleton
  loading={loading}
  animation="shimmer"
  stagger={80}
  transition={300}
>
  <Feed />
</Skeleton>
```

- `stagger` — delay between bones (`true` = 80ms)
- `transition` — fade the skeleton out when `loading` becomes false (`true` = 300ms)

## Reduced motion

Built in. No extra CSS required:

```css
@media (prefers-reduced-motion: reduce) {
  .skeleton-animate-pulse,
  .skeleton-animate-shimmer,
  .skeleton-shine {
    animation: none !important;
  }
}
```
