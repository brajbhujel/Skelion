# Skelion

**Automatically generate skeleton UIs from your layout. Zero-config skeletons for React.**

Skelion is a lightweight React + TypeScript library that creates skeleton loaders by analyzing the rendered layout of your components. No manual skeleton design needed — just wrap your UI and go.

## Features

- **Zero-config** — wrap any component and get automatic skeletons
- **Layout-aware** — uses `getBoundingClientRect` to match your real UI structure
- **SSR-safe** — works with Next.js App Router, no hydration mismatches
- **Lightweight** — CSS-based shimmer animation, no heavy dependencies
- **Tree-shakeable** — ESM + CJS dual output
- **Dark mode** — automatic support via `prefers-color-scheme`
- **Accessible** — proper `aria-busy` and `role="status"` attributes

## Install

```bash
npm install skelion
```

## Quick Start

```tsx
import { Skelion } from "skelion";
import "skelion/styles.css";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Skelion loading={loading}>
      <YourComponent />
    </Skelion>
  );
}
```

When `loading` is `true`, Skelion renders the children in a hidden container, measures their layout, and generates matching skeleton overlays. When `loading` becomes `false`, it renders the children normally.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | — | Whether to show the skeleton |
| `shimmer` | `boolean` | `true` | Enable shimmer animation |
| `duration` | `number` | `1.5` | Shimmer animation duration in seconds |
| `density` | `"low" \| "medium" \| "high"` | `"medium"` | How deeply to analyze the DOM tree |
| `rounded` | `boolean` | — | Force rounded corners on all skeleton nodes |
| `className` | `string` | — | Class name for the wrapper |
| `as` | `React.ElementType` | `"div"` | Wrapper element type |
| `variant` | `"auto" \| "text" \| "avatar" \| "card" \| "custom"` | `"auto"` | Skeleton variant |

## Variants

### Auto (default)

Analyzes children layout and generates matching skeletons:

```tsx
<Skelion loading={isLoading}>
  <UserProfile />
</Skelion>
```

### Preset variants

Use built-in presets without needing children to measure:

```tsx
<Skelion loading variant="text" />
<Skelion loading variant="avatar" />
<Skelion loading variant="card" />
```

## Manual Skeleton Building

For full control, use the sub-components:

```tsx
import { Skelion } from "skelion";

function CustomSkeleton() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <Skelion.Circle size={48} />
      <div style={{ flex: 1 }}>
        <Skelion.Text width="60%" height={16} />
        <Skelion.Text width="100%" height={14} style={{ marginTop: 8 }} />
        <Skelion.Block width="100%" height={80} style={{ marginTop: 12 }} />
      </div>
    </div>
  );
}
```

### Sub-components

**`Skelion.Text`** — text line placeholder
- `width` (default `"100%"`)
- `height` (default `16`)

**`Skelion.Circle`** — circular avatar placeholder
- `size` (default `48`)

**`Skelion.Block`** — rectangular block placeholder
- `width` (default `"100%"`)
- `height` (default `100`)
- `rounded` (default `true`)

All sub-components accept `shimmer`, `duration`, `className`, and `style`.

## Next.js Usage

Skelion is fully compatible with Next.js App Router. The layout detection only runs client-side via `useEffect`, so there are no SSR issues. During SSR, a simple fallback skeleton is rendered until hydration completes.

```tsx
"use client";

import { Skelion } from "skelion";
import "skelion/styles.css";

export function UserCard({ user, loading }: Props) {
  return (
    <Skelion loading={loading}>
      <div className="card">
        <img src={user?.avatar} />
        <h2>{user?.name}</h2>
        <p>{user?.bio}</p>
      </div>
    </Skelion>
  );
}
```

## How It Works

1. When `loading={true}`, children are rendered in a hidden container
2. `getBoundingClientRect` measures each leaf element's position and size
3. Elements are classified (text, image, button, circle, etc.)
4. Skeleton overlays are generated with matching dimensions
5. A `ResizeObserver` re-measures on layout changes (debounced)
6. When `loading` becomes `false`, skeletons are replaced with real content

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type check
npm run typecheck

# Build
npm run build

# Dev mode (watch)
npm run dev
```

### Testing

Skelion uses **Jest** with **jsdom** and **@testing-library/react** for DOM-based testing. Tests verify that generated skeletons exactly match the layout of real React components by mocking `getBoundingClientRect` to simulate layout in jsdom.

The test suite covers:
- DOM-aware skeleton generation with exact position/size matching
- SSR safety and fallback behavior
- Shimmer animation toggle and duration
- Variant presets (text, avatar, card)
- Sub-component rendering (Skelion.Text, Circle, Block)
- Accessibility attributes (aria-busy, aria-hidden, role)
- Props and configuration

**Husky** is configured to run typecheck + tests on every commit via a pre-commit hook.

## License

MIT
