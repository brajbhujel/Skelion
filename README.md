# Skelion

**Zero-config, DOM-aware, SSR-safe skeleton system for React & Next.js.**

Skelion reads your actual component layout and generates pixel-perfect skeleton placeholders automatically. No manual skeleton building needed.

## What’s new in v3

v3 is a visual and layout overhaul:

- **Full width** — the skeleton root and measurement layer are always `width: 100%`. Bones no longer shrink-wrap to text.
- **Slower shimmer** — `2s` linear sweep at **110deg**, with a narrow highlight. Default pulse is `1.8s`.
- **Lighter bones** — `#f0f0f0` in light mode, `rgba(255,255,255,0.08)` in dark. Not gray-200 slabs.
- **Dark mode** — `.dark`, `[data-theme="dark"]`, and `prefers-color-scheme`.
- **Boneyard-class DX** — `color`, `darkColor`, `shimmerColor`, `stagger`, `transition`, `fixture`, `fallback`, `boneClass`, and `<SkeletonProvider />`.
- **`prefers-reduced-motion`** — animations disable automatically.

## Features

- **DOM-Aware Auto Skeleton** — reads real layout via `getBoundingClientRect`
- **4 Animation Styles** — pulse (default), shimmer, wave, solid
- **SSR-Safe** — prevents hydration mismatches in Next.js
- **CSS Variables** — full theming with `--skeleton-color`, `--skeleton-radius`, etc.
- **Preset Variants** — text, avatar, card, image
- **Sub-Components** — `Skeleton.Text`, `Skeleton.Circle`, `Skeleton.Block`, `Skeleton.Image`
- **CLI Tool** — `npx skelion init` and `npx skelion generate`
- **Dark Mode** — `.dark` class, `data-theme`, or `prefers-color-scheme`
- **TypeScript-First** — full type safety with autocomplete-friendly props
- **Tree-Shakable** — ESM + CJS dual output, minimal dependencies

## Install

```bash
npm install skelion
```

Add the CSS import to your app entry point:

```tsx
import "skelion/styles.css";
```

Or use the CLI:

```bash
npx skelion init
```

## Quick Start

### Auto Skeleton (Recommended)

```tsx
import { Skeleton } from "skelion";
import "skelion/styles.css";

function UserProfile({ user, loading }) {
  return (
    <Skeleton loading={loading} animation="shimmer">
      <div className="profile">
        <img src={user.avatar} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.bio}</p>
      </div>
    </Skeleton>
  );
}
```

If the component collapses without data, pass a `fixture` so Skelion can still measure a full-width layout:

```tsx
<Skeleton
  loading={isLoading}
  fixture={<UserCard user={PLACEHOLDER} />}
>
  {user && <UserCard user={user} />}
</Skeleton>
```

### Global defaults

```tsx
import { Skeleton, SkeletonProvider } from "skelion";

<SkeletonProvider animation="shimmer" duration={2} color="#f0f0f0">
  <App />
</SkeletonProvider>
```

### Preset Variants

```tsx
<Skeleton loading={true} variant="text" />
<Skeleton loading={true} variant="avatar" />
<Skeleton loading={true} variant="card" />
<Skeleton loading={true} variant="image" />
```

### Custom Sizing

```tsx
<Skeleton loading={true} width={200} height={20} />
<Skeleton loading={true} width="100%" height="2rem" />
```

### Animation Styles

```tsx
<Skeleton loading={true} animation="pulse">   {/* Default */}
  <YourComponent />
</Skeleton>

<Skeleton loading={true} animation="shimmer">
  <YourComponent />
</Skeleton>

<Skeleton loading={true} animation="wave">
  <YourComponent />
</Skeleton>

<Skeleton loading={true} animation="solid">   {/* No animation */}
  <YourComponent />
</Skeleton>
```

### Sub-Components

```tsx
import { Skeleton } from "skelion";

function CustomSkeleton() {
  return (
    <div style={{ display: "flex", gap: 12, width: "100%" }}>
      <Skeleton.Circle size={48} animation="shimmer" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Skeleton.Text width="60%" height={16} animation="shimmer" />
        <Skeleton.Text width="100%" height={14} lines={2} animation="shimmer" />
      </div>
    </div>
  );
}
```

### SSR / Next.js

```tsx
<Skeleton loading={loading} ssr>
  <YourComponent />
</Skeleton>
```

The `ssr` prop enables static markup on the server. The client hydrates identically, then animations activate after hydration. Zero hydration mismatches.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | — | Whether to show the skeleton |
| `animation` | `"pulse" \| "shimmer" \| "wave" \| "solid"` | `"pulse"` | Animation style |
| `duration` | `number` | `2` (`1.8` for pulse) | Animation duration in seconds |
| `color` | `string` | `#f0f0f0` | Bone fill (light) |
| `darkColor` | `string` | `rgba(255,255,255,0.08)` | Bone fill (dark) |
| `shimmerColor` | `string` | — | Shimmer highlight (light) |
| `darkShimmerColor` | `string` | — | Shimmer highlight (dark) |
| `shimmerAngle` | `number` | `110` | Shimmer gradient angle |
| `stagger` | `number \| boolean` | `false` | Delay between bones in ms (`true` = 80) |
| `transition` | `number \| boolean` | `false` | Fade out when loading ends (`true` = 300) |
| `fixture` | `ReactNode` | — | Mock layout to measure while loading |
| `fallback` | `ReactNode` | — | Shown before bones are measured |
| `boneClass` | `string` | — | Class on each generated bone |
| `density` | `"low" \| "medium" \| "high"` | `"medium"` | DOM traversal depth |
| `variant` | `"auto" \| "text" \| "avatar" \| "card" \| "image" \| "custom"` | `"auto"` | Skeleton variant |
| `ssr` | `boolean` | `false` | Enable SSR-safe rendering |
| `width` | `number \| string` | — | Custom width |
| `height` | `number \| string` | — | Custom height |
| `rounded` | `boolean` | — | Force rounded corners |
| `className` | `string` | — | Wrapper class name |
| `as` | `React.ElementType` | `"div"` | Wrapper element type |
| `style` | `React.CSSProperties` | — | Wrapper inline style |

Skip an element during capture with `data-skeleton="ignore"`. Treat a container as one bone with `data-skeleton="leaf"`.

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

## CLI

```bash
# Initialize Skelion in your project
npx skelion init

# Generate skeleton components
npx skelion generate card
npx skelion generate profile --name User --animation shimmer
npx skelion generate table --output ./src/skeletons
```

Available templates: `card`, `list`, `profile`, `table`.

## Migration from v2

- Default bone color is now `#f0f0f0` (was `#e5e7eb`)
- Default duration is `2s` (was `1.5s`); shimmer easing is `linear`
- Wrapper is always `width: 100%`
- `<Skelion />` still works with a deprecation warning
- See the [v3 migration guide](docs/docs/migration-v3.md)

## Development

```bash
npm install          # Install dependencies
npm test             # Run tests
npm run build        # Build library + CLI
npm run typecheck    # Type check
npm run dev          # Watch mode
```

## Author

**Bishawa Raj Bhujel** — [bishawaraj.com.np](https://bishawaraj.com.np)

- GitHub: [brajbhujel/Skelion](https://github.com/brajbhujel/Skelion)
- npm: [skelion](https://www.npmjs.com/package/skelion)

## License

MIT
