---
sidebar_position: 10
title: Compare
---

# Skelion vs Boneyard vs react-loading-skeleton

How Skelion sits next to the two libraries people usually evaluate: **Boneyard** (layout-capture) and **react-loading-skeleton** (manual primitives).

## Quick take

| | **Skelion** | **Boneyard** (`boneyard-js`) | **react-loading-skeleton** |
|---|---|---|---|
| Core idea | Measure real DOM **at runtime** (or paint from `initialBones`) | Capture real DOM **at build time** with Playwright | Hand-author lines / circles / blocks |
| Setup | `npm install` + CSS import | Install + CLI/Vite plugin + Playwright browser | `npm install` + CSS import |
| Layout drift | Low when wrapping real UI; regenerate `initialBones` if you freeze them | Lowest — re-run capture after UI changes | High — you maintain a second UI by hand |
| First paint / SSR | Mode A: safe hydrate then measure · Mode B: `initialBones` | Native — bones are static JSON | Instant primitives, but not your real layout |
| Animations | pulse, shimmer, wave, solid · 2s / 1.8s defaults | pulse, shimmer, solid | shimmer-style highlight |
| Dark mode | `.dark`, `data-theme`, system | `.dark` class | Manual colors |
| Frameworks | React / Next.js | React, Vue, Svelte, Angular, RN, … | React |
| Best when | You want auto skeletons without a capture pipeline | You want zero CLS and accept a build step | Simple cards / lists and full manual control |

## vs Boneyard

Boneyard’s strength is **build-time bones**: fixture → Playwright snapshot → `.bones.json` → first-frame SSR with no `getBoundingClientRect`.

Skelion’s strength is **runtime auto-skeleton**: wrap the real component, optional `fixture` when data is empty, measure after hydrate. For Boneyard-style first paint, pass **`initialBones`** (and use `ssr`) — see [SSR & Next.js](./guides/ssr).

Use **Boneyard** if you already want a Playwright capture CLI and multi-framework adapters.

Use **Skelion** if you want DOM-aware skeletons in React/Next with zero capture tooling, and opt into frozen bones only where you need them.

## vs react-loading-skeleton

`react-loading-skeleton` is mature and tiny. You place `<Skeleton />` primitives where content will be. That is perfect for one-off rows; it fails when dashboards keep changing and the hand-drawn skeleton drifts.

Skelion (and Boneyard) treat the **real layout** as the source of truth so loading UI stays honest.

## Feature checklist

| Feature | Skelion | Boneyard | react-loading-skeleton |
|---|:---:|:---:|:---:|
| Auto from real layout | ✅ runtime | ✅ build-time | ❌ |
| `fixture` for empty data | ✅ | ✅ | ❌ |
| Precomputed bones | ✅ `initialBones` | ✅ registry / JSON | ❌ |
| Provider / global theme | ✅ | ✅ config | Theme provider |
| Stagger / exit transition | ✅ | ✅ | Limited |
| Presets (`text` / `avatar` / `card`) | ✅ | ❌ (capture instead) | DIY |
| Subcomponents | ✅ | ❌ | ✅ primitives |
| Capture CLI | ❌ (planned) | ✅ | ❌ |

## Install

```bash
npm install skelion
```

```tsx
import { Skeleton } from "skelion";
import "skelion/styles.css";

<Skeleton loading={isLoading} animation="shimmer">
  <Dashboard />
</Skeleton>
```

Try the [Playground](/playground) or read [Quick Start](./quick-start).
