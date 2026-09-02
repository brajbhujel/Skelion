---
sidebar_position: 1
---

# CLI Overview

Skelion includes a CLI tool for quick project setup and component generation.

## Commands

| Command | Description |
|---|---|
| `npx skelion init` | Initialize Skelion in your project |
| `npx skelion generate <template>` | Generate a skeleton component |
| `npx skelion --help` | Show help |
| `npx skelion --version` | Show version |

## Quick Start

```bash
# Set up Skelion in your project
npx skelion init

# Generate a card skeleton component
npx skelion generate card

# Generate with custom name and animation
npx skelion generate profile --name User --animation shimmer
```

## Configuration

The `init` command creates a `skelion.config.ts` file in your project root:

```ts title="skelion.config.ts"
import type { SkeletonConfig } from "skelion";

const config: SkeletonConfig = {
  animation: "pulse",
  density: "medium",
  duration: 2,
  color: "#f0f0f0",
  shimmerAngle: 110,
};

export default config;
```

The `generate` command reads this configuration to set default values for generated components.
