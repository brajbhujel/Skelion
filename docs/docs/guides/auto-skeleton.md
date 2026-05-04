---
sidebar_position: 1
---

# Auto Skeleton

The auto-skeleton feature is Skelion's core differentiator. Instead of manually defining skeleton shapes, Skelion **reads the actual DOM layout** of your component and generates pixel-perfect skeleton placeholders.

## How It Works

1. When `loading={true}`, Skelion renders your children in a hidden container
2. It measures each element's position and size using `getBoundingClientRect()`
3. It classifies elements by type (text, image, button, input, etc.)
4. It generates skeleton nodes that exactly match the layout
5. A `ResizeObserver` keeps skeletons in sync if the layout changes

```tsx
<Skeleton loading={loading}>
  <YourComponent />
</Skeleton>
```

## Element Detection

Skelion automatically classifies DOM elements:

| Element Type | Tags / ARIA Roles |
|---|---|
| **Text** | `h1`-`h6`, `p`, `span`, `a`, `label`, `code`, `li`, `td`, and more |
| **Image** | `img`, `svg`, `picture`, `video`, `canvas`, `iframe` |
| **Button** | `button`, `role="button"`, `role="tab"` |
| **Input** | `input`, `textarea`, `select`, `role="checkbox"`, `role="slider"` |
| **Circle** | Any element with 1:1 aspect ratio and `border-radius: 50%` |

Elements with `role="presentation"` or `role="none"` are skipped automatically.

## Density Control

The `density` prop controls how deep Skelion walks the DOM tree:

```tsx
// Shallow scan — fast, captures top-level elements
<Skeleton loading={loading} density="low">
  <ComplexComponent />
</Skeleton>

// Default — good balance of detail and performance
<Skeleton loading={loading} density="medium">
  <ComplexComponent />
</Skeleton>

// Deep scan — captures nested elements
<Skeleton loading={loading} density="high">
  <ComplexComponent />
</Skeleton>
```

| Density | Max Depth | Best For |
|---|---|---|
| `low` | 2 levels | Simple layouts, performance-critical |
| `medium` | 4 levels | Most use cases (default) |
| `high` | 8 levels | Complex nested layouts |

## Invisible Elements

Skelion automatically skips:
- Elements with `display: none`
- Elements with `opacity: 0`
- Elements smaller than 4px
- `<script>`, `<style>`, `<template>` tags
