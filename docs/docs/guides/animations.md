---
sidebar_position: 2
---

# Animations

Skelion provides 4 animation styles for skeleton loading states.

## Animation Variants

### Pulse (Default)

A gentle opacity fade. Industry standard, least distracting.

```tsx
<Skeleton loading={true} animation="pulse">
  <YourComponent />
</Skeleton>
```

### Shimmer

A gradient that slides across the skeleton. Classic skeleton loader effect.

```tsx
<Skeleton loading={true} animation="shimmer">
  <YourComponent />
</Skeleton>
```

### Wave

A wave of light that sweeps across using a `::after` pseudo-element.

```tsx
<Skeleton loading={true} animation="wave">
  <YourComponent />
</Skeleton>
```

### Solid

No animation — just a static placeholder. Useful for reduced-motion preferences or when you want a simple placeholder.

```tsx
<Skeleton loading={true} animation="solid">
  <YourComponent />
</Skeleton>
```

## Custom Duration

Control animation speed with the `duration` prop (in seconds):

```tsx
// Slower animation (2.5 seconds)
<Skeleton loading={true} duration={2.5}>
  <YourComponent />
</Skeleton>

// Faster animation (0.8 seconds)
<Skeleton loading={true} duration={0.8}>
  <YourComponent />
</Skeleton>
```

You can also set duration globally via CSS:

```css
:root {
  --skeleton-duration: 2s;
}
```

## Sub-Component Animations

Each sub-component also accepts the `animation` prop:

```tsx
<div style={{ display: "flex", gap: 12 }}>
  <Skeleton.Circle size={48} animation="shimmer" />
  <div>
    <Skeleton.Text width="200px" animation="shimmer" />
    <Skeleton.Text width="150px" animation="shimmer" />
  </div>
</div>
```

## Respecting Reduced Motion

For users who prefer reduced motion, you can use CSS:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --skeleton-duration: 0s;
  }
}
```

Or conditionally set the animation:

```tsx
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

<Skeleton
  loading={loading}
  animation={prefersReducedMotion ? "solid" : "pulse"}
>
  <YourComponent />
</Skeleton>
```
