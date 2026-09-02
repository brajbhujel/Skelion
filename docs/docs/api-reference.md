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
| `duration` | `number` | `2` (`1.8` for pulse) | Animation duration in seconds |
| `color` | `string` | `#f0f0f0` | Bone fill in light mode |
| `darkColor` | `string` | `rgba(255,255,255,0.08)` | Bone fill in dark mode |
| `shimmerColor` | `string` | — | Shimmer highlight in light mode |
| `darkShimmerColor` | `string` | — | Shimmer highlight in dark mode |
| `shimmerAngle` | `number` | `110` | Shimmer gradient angle in degrees |
| `stagger` | `number \| boolean` | `false` | Delay between bones in ms (`true` = 80) |
| `transition` | `number \| boolean` | `false` | Fade-out when loading ends (`true` = 300) |
| `fixture` | `ReactNode` | — | Mock layout measured while loading |
| `fallback` | `ReactNode` | — | Shown before bones are measured |
| `boneClass` | `string` | — | Extra class on each generated bone |
| `density` | `"low" \| "medium" \| "high"` | `"medium"` | DOM traversal depth for auto-detection |
| `variant` | `"auto" \| "text" \| "avatar" \| "card" \| "image" \| "custom"` | `"auto"` (with children) | Skeleton variant or preset |
| `ssr` | `boolean` | `false` | Enable SSR-safe rendering |
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

## `<SkeletonProvider />`

Set defaults for every skeleton below.

```tsx
import { SkeletonProvider } from "skelion";

<SkeletonProvider animation="shimmer" duration={2} color="#f0f0f0">
  <App />
</SkeletonProvider>
```

Accepts the same theming props as `<Skeleton />`: `animation`, `duration`, `density`, `color`, `darkColor`, `shimmerColor`, `darkShimmerColor`, `shimmerAngle`, `stagger`, `transition`, `rounded`.

---

## `<Skeleton.Text />`

A text-line skeleton shape. Default width is `100%`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `width` | `number \| string` | `"100%"` | Line width |
| `height` | `number \| string` | `16` | Line height |
| `lines` | `number` | `1` | Number of text lines |
| `gap` | `number` | `8` | Gap between lines (px) |
| `animation` | `AnimationVariant` | inherited / `"pulse"` | Animation style |
| `duration` | `number` | inherited / `2` | Animation duration |
| `className` | `string` | — | Custom CSS class |
| `style` | `React.CSSProperties` | — | Inline style |

---

## `<Skeleton.Circle />`

A circular skeleton shape (avatars, icons).

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number` | `48` | Diameter in pixels |
| `animation` | `AnimationVariant` | inherited / `"pulse"` | Animation style |
| `duration` | `number` | inherited / `2` | Animation duration |
| `className` | `string` | — | Custom CSS class |
| `style` | `React.CSSProperties` | — | Inline style |

---

## `<Skeleton.Block />`

A rectangular skeleton shape. Default width is `100%`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `width` | `number \| string` | `"100%"` | Block width |
| `height` | `number \| string` | `100` | Block height |
| `rounded` | `boolean` | `true` | Apply border-radius |
| `animation` | `AnimationVariant` | inherited / `"pulse"` | Animation style |
| `duration` | `number` | inherited / `2` | Animation duration |
| `className` | `string` | — | Custom CSS class |
| `style` | `React.CSSProperties` | — | Inline style |

---

## `<Skeleton.Image />`

An image placeholder skeleton with an icon.

| Prop | Type | Default | Description |
|---|---|---|---|
| `width` | `number \| string` | `"100%"` | Placeholder width |
| `height` | `number \| string` | `200` | Placeholder height |
| `animation` | `AnimationVariant` | inherited / `"pulse"` | Animation style |
| `duration` | `number` | inherited / `2` | Animation duration |
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

---

## Type Exports

```tsx
import type {
  SkeletonProps,
  SkeletonConfig,
  SkeletonProviderProps,
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
