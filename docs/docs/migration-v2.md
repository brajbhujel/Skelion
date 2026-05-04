---
sidebar_position: 8
---

# Migration from v1 to v2

Skelion v2 introduces breaking changes. This guide will help you upgrade.

## Breaking Changes

### 1. Component Rename: `<Skelion />` to `<Skeleton />`

The primary component has been renamed for better naming consistency.

```diff
- import { Skelion } from "skelion";
+ import { Skeleton } from "skelion";

- <Skelion loading={loading}>
+ <Skeleton loading={loading}>
    <YourComponent />
- </Skelion>
+ </Skeleton>
```

**Backward compatibility**: `<Skelion />` still works but logs a deprecation warning. It will be removed in v3.

### 2. Animation Prop Replaces `shimmer`

The `shimmer` boolean prop is replaced by the `animation` string prop with 4 options.

```diff
- <Skelion loading={true} shimmer={true}>
+ <Skeleton loading={true} animation="shimmer">

- <Skelion loading={true} shimmer={false}>
+ <Skeleton loading={true} animation="solid">
```

The default animation is now `"pulse"` (was shimmer in v1).

### 3. CSS Class Names

CSS classes changed from `skelion-*` to `skeleton-*`:

| v1 | v2 |
|---|---|
| `.skelion-node` | `.skeleton-node` |
| `.skelion-shimmer` | `.skeleton-animate-shimmer` |
| `.skelion-node--rounded` | `.skeleton-node--rounded` |
| `.skelion-node--circle` | `.skeleton-node--circle` |
| `.skelion-wrapper` | `.skeleton-wrapper` |
| `.skelion-fallback` | `.skeleton-fallback` |

**Backward compatibility**: The old `skelion-*` classes are still included in the CSS for users who upgrade the package but haven't updated custom styles yet.

### 4. Skeleton Node IDs

Generated skeleton node IDs changed prefix:

```diff
- id: "skelion-0"
+ id: "skeleton-0"
```

### 5. CSS Variables

Styling is now controlled via CSS variables instead of hardcoded values:

```css
:root {
  --skeleton-color: #e5e7eb;
  --skeleton-shimmer: rgba(255, 255, 255, 0.4);
  --skeleton-radius: 4px;
  --skeleton-duration: 1.5s;
}
```

## New Features in v2

- **4 animation variants**: pulse, shimmer, wave, solid
- **`ssr` prop**: SSR-safe Boneyard Pattern for Next.js
- **`width`/`height` props**: Simple skeleton without children
- **`<Skeleton.Image />`**: New image placeholder sub-component
- **`<Skeleton.Text lines={3} />`**: Multi-line text support
- **CSS variables**: Full theming control
- **CLI tool**: `npx skelion init` and `npx skelion generate`
- **Dark mode**: Automatic via `prefers-color-scheme`

## Find-and-Replace Patterns

For a quick upgrade, use these find-and-replace patterns in your editor:

| Find | Replace |
|---|---|
| `import { Skelion }` | `import { Skeleton }` |
| `<Skelion ` | `<Skeleton ` |
| `</Skelion>` | `</Skeleton>` |
| `Skelion.Text` | `Skeleton.Text` |
| `Skelion.Circle` | `Skeleton.Circle` |
| `Skelion.Block` | `Skeleton.Block` |
| `shimmer={true}` | `animation="shimmer"` |
| `shimmer={false}` | `animation="solid"` |
| `SkelionProps` | `SkeletonProps` |

## Sub-Component Changes

Sub-components now use `animation` instead of `shimmer`:

```diff
- <Skelion.Text shimmer={true} duration={1.5} />
+ <Skeleton.Text animation="shimmer" duration={1.5} />

- <Skelion.Circle shimmer={false} />
+ <Skeleton.Circle animation="solid" />
```
