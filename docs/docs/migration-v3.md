---
sidebar_position: 9
---

# Migration from v2 to v3

Skelion v3 is a visual and layout overhaul. Most v2 code keeps working. Defaults changed so skeletons look like product-quality bones instead of dark gray bars.

## What you get without changing code

If you already use `<Skeleton loading={...}>`, v3 will:

- Stretch to **100% of the parent** (the measurement layer no longer shrink-wraps)
- Use a **lighter** bone color (`#f0f0f0` instead of `#e5e7eb`)
- Run shimmer at **2s linear, 110deg** (was 1.5s ease-in-out)
- Honor `.dark`, `[data-theme="dark"]`, and `prefers-reduced-motion`

## Breaking-ish defaults

| | v2 | v3 |
|---|---|---|
| Bone color | `#e5e7eb` | `#f0f0f0` |
| Dark bone color | `#374151` | `rgba(255,255,255,0.08)` |
| Duration | `1.5s` | `2s` (pulse `1.8s`) |
| Shimmer highlight | harsh white overlay | `#f7f7f7` |
| Shimmer easing | `ease-in-out` | `linear` |
| Shimmer angle | `90deg` | `110deg` |
| Radius | `4px` | `6px` |
| Wrapper width | measured px | `100%` |

To restore v2 look:

```css
:root {
  --skeleton-light-color: #e5e7eb;
  --skeleton-duration: 1.5s;
  --skeleton-radius: 4px;
}
```

Or per component:

```tsx
<Skeleton loading={loading} color="#e5e7eb" duration={1.5}>
  <Card />
</Skeleton>
```

## New props (all optional)

```tsx
<Skeleton
  loading={isLoading}
  animation="shimmer"
  color="#f0f0f0"
  darkColor="rgba(255,255,255,0.08)"
  stagger={80}
  transition={300}
  fixture={<Card data={PLACEHOLDER} />}
  fallback={<Skeleton variant="card" loading />}
>
  {data && <Card data={data} />}
</Skeleton>
```

Wrap the tree once for shared defaults:

```tsx
import { SkeletonProvider } from "skelion";

<SkeletonProvider animation="shimmer" duration={2}>
  <App />
</SkeletonProvider>
```

## CSS variables

```diff
 :root {
-  --skeleton-color: #e5e7eb;
-  --skeleton-shimmer: rgba(255, 255, 255, 0.4);
-  --skeleton-radius: 4px;
-  --skeleton-duration: 1.5s;
+  --skeleton-light-color: #f0f0f0;
+  --skeleton-dark-color: rgba(255, 255, 255, 0.08);
+  --skeleton-radius: 6px;
+  --skeleton-duration: 2s;
+  --skeleton-angle: 110deg;
 }
```

`--skeleton-color` still works; it now resolves from the light/dark pair.

## `<Skelion />`

The v1 name still works and still warns. Prefer `<Skeleton />`.
