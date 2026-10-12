---
sidebar_position: 2
---

# Installation

## Package Manager

```bash
# npm
npm install skelion

# yarn
yarn add skelion

# pnpm
pnpm add skelion
```

## Upgrading to v3

This release is a **major version** (`3.0.0`): defaults changed (full width, lighter bones, slower shimmer). Most APIs are compatible.

```bash
# bump to latest published 3.x
npm install skelion@latest

# or only within the current major once v3 is installed
npm update skelion
```

Then pull the new CSS:

```tsx
import "skelion/styles.css";
```

Read [Migration from v2 → v3](./migration-v3) if you customized colors or duration.

## CSS Import

Add the CSS import to your app's entry point:

### React (Vite)

```tsx title="src/main.tsx"
import "skelion/styles.css";
```

### Next.js (App Router)

```tsx title="app/layout.tsx"
import "skelion/styles.css";
```

### Next.js (Pages Router)

```tsx title="pages/_app.tsx"
import "skelion/styles.css";
```

### Create React App

```tsx title="src/index.tsx"
import "skelion/styles.css";
```

## CLI Setup (Optional)

You can also use the CLI to set up Skelion automatically:

```bash
npx skelion init
```

This will:
- Detect your framework (Next.js, Vite, CRA)
- Create a `skelion.config.ts` configuration file
- Print CSS import instructions

## Requirements

- React 18.0.0 or higher
- React DOM 18.0.0 or higher
- TypeScript 5.0+ (optional, but recommended)
