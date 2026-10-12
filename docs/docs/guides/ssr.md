---
sidebar_position: 3
---

# SSR & Next.js

Skelion supports two SSR strategies. Pick based on whether you need zero layout shift on first paint.

## How Boneyard does SSR

Boneyard is SSR-friendly because bones are **precomputed at build time**:

1. You pass a `fixture` (mock UI) and a `name`
2. `npx boneyard-js build` runs Playwright, snapshots the real DOM, and writes `.bones.json`
3. At runtime you pass `initialBones` (or a registry) — **no `getBoundingClientRect` on the client**
4. The skeleton is in the HTML on first paint

That is why Boneyard can stream skeletons from RSC / SSG / edge with no measurement flash.

## How Skelion does SSR

Skelion’s default is **runtime DOM measure** (that’s the product difference). For SSR we still avoid hydration mismatches, then optionally upgrade to Boneyard-style first paint.

### Mode A — Safe hydrate + measure (default)

```tsx
<Skeleton loading={loading} ssr>
  <YourComponent />
</Skeleton>
```

1. **Server**: static fallback (animations off via `.skeleton-ssr`)
2. **Hydrate**: same markup (no mismatch)
3. **After paint**: measure children / `fixture` and swap to accurate bones

Use this when layouts change often and you don’t want a capture step.

### Mode B — Precomputed bones (first paint, Boneyard-style)

```tsx
import { Skeleton } from "skelion";
import bones from "./user-card.bones.json";

<Skeleton
  loading={isLoading}
  ssr
  initialBones={bones}
  fixture={<UserCard user={PLACEHOLDER} />}
>
  {user && <UserCard user={user} />}
</Skeleton>
```

When `initialBones` is set, Skelion **skips measurement** and paints those bones immediately — including on the server. Generate the JSON once from a measured layout (or hand-author it) and commit it.

`fixture` still matters when children would collapse without API data.

## Next.js App Router

Skelion ships with `"use client"`. Import it from client components:

```tsx title="app/components/UserCard.tsx"
"use client";

import { Skeleton } from "skelion";
import "skelion/styles.css";

export function UserCard({ user, loading }) {
  return (
    <Skeleton loading={loading} ssr>
      <div className="card">
        <img src={user.avatar} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.bio}</p>
      </div>
    </Skeleton>
  );
}
```

Import CSS once in the root layout:

```tsx title="app/layout.tsx"
import "skelion/styles.css";
```

## Streaming / Suspense

```tsx
import { Suspense } from "react";
import { Skeleton } from "skelion";

export default function Page() {
  return (
    <Suspense fallback={<Skeleton loading variant="card" ssr />}>
      <UserCard />
    </Suspense>
  );
}
```

## Which mode should you use?

| Need | Use |
|---|---|
| Fast iteration, layout still changing | Mode A (`ssr` + measure) |
| Marketing / dashboard first paint, no CLS | Mode B (`initialBones`) |
| Children empty while loading | Always pass `fixture` |
| RSC streaming shell | Preset `variant` or `initialBones` in the Suspense fallback |
