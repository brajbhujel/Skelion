---
sidebar_position: 1
slug: /
---

# Introduction

**Skelion** is a zero-config, DOM-aware, SSR-safe skeleton loading system for React and Next.js.

Instead of manually building skeleton screens that drift out of sync with your UI, Skelion **reads your actual component layout** and generates pixel-perfect skeleton placeholders automatically.

## What’s new in v3

- Full-width roots and measurement (`width: 100%`)
- Lighter bones (`#f0f0f0` / dark `#222222`) and slower shimmer (`2s` linear, `110deg`)
- `SkeletonProvider`, `fixture`, `stagger`, `transition`, `initialBones`
- SSR Mode A (hydrate + measure) and Mode B (precomputed bones)

See [Migration v3](./migration-v3) and [Compare vs Boneyard](./compare).

## Why Skelion?

| Problem | Skelion's Solution |
|---|---|
| Manual skeletons go stale when UI changes | **Auto-detection** reads the real DOM layout |
| Skeleton libraries require heavy setup | **Zero-config** — wrap your component and go |
| SSR causes hydration mismatches | Safe hydrate + optional `initialBones` for first paint |
| Limited to one animation style | **4 animation variants** — pulse, shimmer, wave, solid |
| Hard to customize | **CSS variables** for full theming control |

## Key Features

- **DOM-Aware Auto Skeleton** — Automatically generates skeletons matching your real layout
- **Multiple Animations** — Pulse (default), shimmer, wave, and solid
- **SSR-Safe** — Hydration-safe markup; `initialBones` for zero-measure first paint
- **Preset Variants** — Text, avatar, card, and image presets out of the box
- **Sub-Components** — `Skeleton.Text`, `Skeleton.Circle`, `Skeleton.Block`, `Skeleton.Image` for manual control
- **CLI Tool** — `npx skelion init` and `npx skelion generate` for quick setup
- **CSS Variables** — Full theming with `--skeleton-color`, `--skeleton-radius`, `--skeleton-duration`, `--skeleton-angle`
- **Dark Mode** — `.dark`, `[data-theme="dark"]`, or `prefers-color-scheme`
- **Provider** — `<SkeletonProvider />` for app-wide color, speed, and animation
- **TypeScript-First** — Full type safety with autocomplete-friendly props
- **Tree-Shakable** — Only import what you use

## Quick Example

```tsx
import { Skeleton } from "skelion";
import "skelion/styles.css";

function UserProfile({ user, loading }) {
  return (
    <Skeleton loading={loading}>
      <div className="profile">
        <img src={user.avatar} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.bio}</p>
      </div>
    </Skeleton>
  );
}
```

When `loading` is `true`, Skelion measures the layout of your component and renders skeleton placeholders that exactly match each element's position and size. When `loading` becomes `false`, your real content appears seamlessly.
