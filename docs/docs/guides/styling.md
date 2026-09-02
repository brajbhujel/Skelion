---
sidebar_position: 4
---

# Styling & Theming

Skelion uses CSS custom properties for theming. Defaults are light bones (`#f0f0f0`) so the placeholder feels like a wash, not a slab.

## CSS Variables

```css
:root {
  --skeleton-light-color: #f0f0f0;
  --skeleton-dark-color: rgba(255, 255, 255, 0.08);
  --skeleton-light-shimmer: #f7f7f7;
  --skeleton-dark-shimmer: rgba(255, 255, 255, 0.16);
  --skeleton-radius: 6px;
  --skeleton-duration: 2s;
  --skeleton-angle: 110deg;
}
```

`--skeleton-color` and `--skeleton-shimmer` resolve from the light/dark pair automatically.

## Dark Mode

Skelion follows, in order:

1. A `.dark` or `[data-theme="dark"]` ancestor (Tailwind / next-themes)
2. `prefers-color-scheme: dark`

```css
.dark {
  --skeleton-dark-color: rgba(255, 255, 255, 0.08);
  --skeleton-dark-shimmer: rgba(255, 255, 255, 0.16);
}
```

## Per-component colors

```tsx
<Skeleton
  loading={loading}
  color="#eee"
  darkColor="rgba(255,255,255,0.1)"
  shimmerColor="rgba(255,255,255,0.8)"
>
  <Card />
</Skeleton>
```

## Tailwind CSS Integration

```css title="globals.css"
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --skeleton-light-color: theme(colors.zinc.100);
  --skeleton-radius: theme(borderRadius.md);
}

.dark {
  --skeleton-dark-color: rgba(255, 255, 255, 0.08);
}
```

## Custom Class Names

```tsx
<Skeleton loading={true} className="my-skeleton-wrapper">
  <YourComponent />
</Skeleton>

<Skeleton.Text className="my-text-skeleton" />
```

Skip a node during auto-detect:

```html
<span data-skeleton="ignore">live badge</span>
<div data-skeleton="leaf">treat this whole block as one bone</div>
```

## Available CSS Classes

| Class | Description |
|---|---|
| `.skeleton-root` | Full-width wrapper |
| `.skeleton-measure` | Hidden in-layout measurement layer |
| `.skeleton-node` | Base skeleton element |
| `.skeleton-node--rounded` | Rounded corners |
| `.skeleton-node--circle` | Circular shape |
| `.skeleton-wrapper` | Auto-skeleton overlay |
| `.skeleton-shine` | Shared shimmer sweep |
| `.skeleton-fallback` | SSR / pre-measure placeholder |
| `.skeleton-animate-pulse` | Pulse animation |
| `.skeleton-animate-shimmer` | Shimmer animation |
| `.skeleton-animate-wave` | Wave animation |
| `.skeleton-animate-solid` | No animation |
| `.skeleton-ssr` | SSR state (animations disabled) |
