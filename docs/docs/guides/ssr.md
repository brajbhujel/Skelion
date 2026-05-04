---
sidebar_position: 3
---

# SSR & Next.js

Skelion is designed to work seamlessly with server-side rendering. The **Boneyard Pattern** ensures zero hydration mismatches in Next.js.

## The Problem

Skeleton loaders that measure the DOM break SSR because:
1. The server has no DOM to measure
2. The initial client render must match the server output
3. Layout measurement can only happen after hydration

## The Boneyard Pattern

Skelion solves this with a three-phase approach:

1. **Server render**: Static skeleton placeholder with animations disabled
2. **Client hydration**: Identical markup renders (no mismatch)
3. **Post-hydration**: `useEffect` enables animations and triggers layout measurement

## Usage

Add the `ssr` prop to enable SSR-safe rendering:

```tsx
<Skeleton loading={loading} ssr>
  <YourComponent />
</Skeleton>
```

### With Preset Variants

```tsx
<Skeleton loading={loading} variant="card" ssr>
  <CardContent />
</Skeleton>
```

### With Auto Mode

```tsx
<Skeleton loading={loading} ssr>
  <ComplexLayout />
</Skeleton>
```

In auto mode with SSR:
- Server renders a fallback skeleton placeholder
- Client hydrates the same fallback (no mismatch)
- After hydration, Skelion measures the real layout and swaps to accurate skeletons

## Next.js App Router

Skelion is fully compatible with the App Router. The library outputs include the `"use client"` directive, so it works in client components:

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

## Next.js Streaming

Skelion works with React Suspense and Next.js streaming. The SSR fallback renders immediately, and the skeleton activates after the component streams in:

```tsx title="app/page.tsx"
import { Suspense } from "react";
import { UserCard } from "./components/UserCard";

export default function Page() {
  return (
    <Suspense fallback={<Skeleton loading={true} variant="card" ssr />}>
      <UserCard />
    </Suspense>
  );
}
```

## CSS Import in Next.js

Import the CSS in your root layout:

```tsx title="app/layout.tsx"
import "skelion/styles.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```
