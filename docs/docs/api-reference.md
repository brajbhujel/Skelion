---
sidebar_position: 5
---

# API Reference

## `<Skeleton />`

The main component for skeleton loading.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `loading` | `boolean` | **required** | Whether to show the skeleton or render children |
| `children` | `ReactNode` | — | Content to measure for auto-skeleton generation |
| `animation` | `"pulse" \| "shimmer" \| "wave" \| "solid"` | `"pulse"` | Animation style |
| `duration` | `number` | `1.5` | Animation duration in seconds |
| `density` | `"low" \| "medium" \| "high"` | `"medium"` | DOM traversal depth for auto-detection |
| `variant` | `"auto" \| "text" \| "avatar" \| "card" \| "image" \| "custom"` | `"auto"` (with children) | Skeleton variant or preset |
| `ssr` | `boolean` | `false` | Enable SSR-safe Boneyard Pattern |
| `width` | `number \| string` | — | Custom width (for simple skeletons) |
| `height` | `number \| string` | — | Custom height (for simple skeletons) |
| `rounded` | `boolean` | — | Force rounded corners on all nodes |
| `className` | `string` | — | Custom CSS class for wrapper |
| `as` | `React.ElementType` | `"div"` | Wrapper element type |
| `style` | `React.CSSProperties` | — | Inline style for wrapper |

### Usage Modes

1. **Auto mode** (default with children): Reads DOM layout and generates matching skeletons
2. **Preset mode**: Use `variant` prop for built-in patterns
3. **Custom mode**: Use `width`/`height` props for simple shapes
4. **Manual mode**: Use sub-components for full control

---

## `<Skeleton.Text />`

A text-line skeleton shape.

| Prop | Type | Default | Description |
|---|---|---|---|
| `width` | `number \| string` | `"100%"` | Line width |
| `height` | `number \| string` | `16` | Line height |
| `lines` | `number` | `1` | Number of text lines |
| `gap` | `number` | `8` | Gap between lines (px) |
| `animation` | `AnimationVariant` | `"pulse"` | Animation style |
| `duration` | `number` | `1.5` | Animation duration |
| `className` | `string` | — | Custom CSS class |
| `style` | `React.CSSProperties` | — | Inline style |

---

## `<Skeleton.Circle />`

A circular skeleton shape (avatars, icons).

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number` | `48` | Diameter in pixels |
| `animation` | `AnimationVariant` | `"pulse"` | Animation style |
| `duration` | `number` | `1.5` | Animation duration |
| `className` | `string` | — | Custom CSS class |
| `style` | `React.CSSProperties` | — | Inline style |

---

## `<Skeleton.Block />`

A rectangular skeleton shape.

| Prop | Type | Default | Description |
|---|---|---|---|
| `width` | `number \| string` | `"100%"` | Block width |
| `height` | `number \| string` | `100` | Block height |
| `rounded` | `boolean` | `true` | Apply border-radius |
| `animation` | `AnimationVariant` | `"pulse"` | Animation style |
| `duration` | `number` | `1.5` | Animation duration |
| `className` | `string` | — | Custom CSS class |
| `style` | `React.CSSProperties` | — | Inline style |

---

## `<Skeleton.Image />`

An image placeholder skeleton with an icon.

| Prop | Type | Default | Description |
|---|---|---|---|
| `width` | `number \| string` | `"100%"` | Placeholder width |
| `height` | `number \| string` | `200` | Placeholder height |
| `animation` | `AnimationVariant` | `"pulse"` | Animation style |
| `duration` | `number` | `1.5` | Animation duration |
| `className` | `string` | — | Custom CSS class |
| `style` | `React.CSSProperties` | — | Inline style |

---

## `useSSRSkeleton(ssr: boolean)`

Hook for SSR-safe skeleton rendering (used internally, but available for advanced use).

```tsx
import { useSSRSkeleton } from "skelion";

const { isSSR, ssrClassName } = useSSRSkeleton(true);
```

| Return | Type | Description |
|---|---|---|
| `isSSR` | `boolean` | `true` when rendering on server or before hydration |
| `ssrClassName` | `string` | CSS class to apply during SSR (`"skeleton-ssr"` or `""`) |

---

## CSS Variables

Override these in your CSS to customize the skeleton appearance:

```css
:root {
  --skeleton-color: #e5e7eb;      /* Skeleton background color */
  --skeleton-shimmer: rgba(255, 255, 255, 0.4); /* Shimmer/wave highlight */
  --skeleton-radius: 4px;          /* Default border radius */
  --skeleton-duration: 1.5s;       /* Animation duration */
}
```

---

## Type Exports

```tsx
import type {
  SkeletonProps,
  AnimationVariant,
  Variant,
  Density,
  ShapePreset,
  SkeletonNode,
  SkeletonTextProps,
  SkeletonCircleProps,
  SkeletonBlockProps,
  SkeletonImageProps,
} from "skelion";
```
