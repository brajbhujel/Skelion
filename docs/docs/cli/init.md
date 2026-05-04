---
sidebar_position: 2
---

# skelion init

Initialize Skelion in your project.

## Usage

```bash
npx skelion init
```

## What It Does

1. **Detects your framework** — Next.js, Vite, Create React App, or plain React
2. **Creates a config file** — `skelion.config.ts` (or `.js` with `--js`)
3. **Prints setup instructions** — CSS import location, component usage examples
4. **Tailwind detection** — If Tailwind is detected, prints CSS variable setup guide

## Options

| Option | Description |
|---|---|
| `--js` | Generate a JavaScript config file instead of TypeScript |

## Example Output

```
  Skelion - Zero-config skeleton system

  Detected framework: nextjs
  Created skelion.config.ts

  Next steps:

  1. Add the CSS import to your app entry point:

     // app/layout.tsx or pages/_app.tsx
     import "skelion/styles.css";

  2. Use the Skeleton component:

     import { Skeleton } from "skelion";

     <Skeleton loading={isLoading}>
       <YourComponent />
     </Skeleton>

  Done! Happy skeleton loading.
```

## Config File

The generated config file:

```ts title="skelion.config.ts"
import type { SkelionConfig } from "skelion";

const config: SkelionConfig = {
  // Default animation style: "pulse" | "shimmer" | "wave" | "solid"
  animation: "pulse",

  // DOM traversal depth: "low" | "medium" | "high"
  density: "medium",

  // Animation duration in seconds
  duration: 1.5,
};

export default config;
```
