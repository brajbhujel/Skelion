# Skelion

**Zero-config, DOM-aware, SSR-safe skeleton system for React & Next.js.**

Skelion reads your actual component layout and generates pixel-perfect skeleton placeholders automatically. No manual skeleton building needed.

## Features

- **DOM-Aware Auto Skeleton** — reads real layout via `getBoundingClientRect`
- **4 Animation Styles** — pulse (default), shimmer, wave, solid
- **SSR-Safe** — prevents hydration mismatches in Next.js
- **CSS Variables** — full theming with `--skeleton-color`, `--skeleton-radius`, etc.
- **Preset Variants** — text, avatar, card, image
- **Sub-Components** — `Skeleton.Text`, `Skeleton.Circle`, `Skeleton.Block`, `Skeleton.Image`
- **CLI Tool** — `npx skelion init` and `npx skelion generate`
- **Dark Mode** — automatic via `prefers-color-scheme`
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
    <div style={{ display: "flex", gap: 12 }}>
      <Skeleton.Circle size={48} animation="shimmer" />
      <div style={{ flex: 1 }}>
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

The `ssr` prop enables the Boneyard Pattern: server renders static markup, client hydrates identically, then animations activate after hydration. Zero hydration mismatches.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | — | Whether to show the skeleton |
| `animation` | `"pulse" \| "shimmer" \| "wave" \| "solid"` | `"pulse"` | Animation style |
| `duration` | `number` | `1.5` | Animation duration in seconds |
| `density` | `"low" \| "medium" \| "high"` | `"medium"` | DOM traversal depth |
| `variant` | `"auto" \| "text" \| "avatar" \| "card" \| "image" \| "custom"` | `"auto"` | Skeleton variant |
| `ssr` | `boolean` | `false` | Enable SSR-safe rendering |
| `width` | `number \| string` | — | Custom width |
| `height` | `number \| string` | — | Custom height |
| `rounded` | `boolean` | — | Force rounded corners |
| `className` | `string` | — | Wrapper class name |
| `as` | `React.ElementType` | `"div"` | Wrapper element type |
| `style` | `React.CSSProperties` | — | Wrapper inline style |

## CSS Variables

```css
:root {
  --skeleton-color: #e5e7eb;
  --skeleton-shimmer: rgba(255, 255, 255, 0.4);
  --skeleton-radius: 4px;
  --skeleton-duration: 1.5s;
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

## Migration from v1

If upgrading from v1, the main changes are:

- `<Skelion />` → `<Skeleton />` (old name still works with deprecation warning)
- `shimmer={true}` → `animation="shimmer"` (default is now `"pulse"`)
- CSS classes: `skelion-*` → `skeleton-*` (old classes still supported)

See the full [migration guide](docs/docs/migration-v2.md).

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
