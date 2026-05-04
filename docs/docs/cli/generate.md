---
sidebar_position: 3
---

# skelion generate

Generate skeleton components from built-in templates.

## Usage

```bash
npx skelion generate <template> [options]
```

## Available Templates

| Template | Description |
|---|---|
| `card` | Card layout (image block + text lines) |
| `list` | List with avatars (configurable rows) |
| `profile` | User profile (avatar + name + bio + buttons) |
| `table` | Data table (configurable rows and columns) |

## Options

| Option | Default | Description |
|---|---|---|
| `-n, --name <name>` | Derived from template | Component name |
| `-o, --output <dir>` | `./components/skeletons` | Output directory |
| `-a, --animation <type>` | From config or `"pulse"` | Animation style |

## Examples

### Generate a card skeleton

```bash
npx skelion generate card
```

Creates `./components/skeletons/CardSkeleton.tsx`:

```tsx
import { Skeleton } from "skelion";
import "skelion/styles.css";

export function CardSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Skeleton.Block width="100%" height={160} animation="pulse" />
      <Skeleton.Text width="70%" height={18} animation="pulse" />
      <Skeleton.Text width="100%" height={14} animation="pulse" />
      <Skeleton.Text width="85%" height={14} animation="pulse" />
    </div>
  );
}
```

### Generate with custom name and animation

```bash
npx skelion generate profile --name User --animation shimmer
```

Creates `./components/skeletons/UserSkeleton.tsx` with shimmer animation.

### Generate to a custom directory

```bash
npx skelion generate table --output ./src/skeletons
```

Creates `./src/skeletons/TableSkeleton.tsx`.
