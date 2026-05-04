---
sidebar_position: 7
---

# Examples

## React — Product List

```tsx
import { useState, useEffect } from "react";
import { Skeleton } from "skelion";
import "skelion/styles.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {loading
        ? Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} loading={true} variant="card" />
          ))
        : products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
    </div>
  );
}
```

## React — User Profile

```tsx
import { Skeleton } from "skelion";

function UserProfile({ user, loading }) {
  return (
    <Skeleton loading={loading} animation="shimmer">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <img
          src={user?.avatar}
          alt={user?.name}
          style={{ width: 80, height: 80, borderRadius: "50%" }}
        />
        <div>
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
          <p>{user?.bio}</p>
        </div>
      </div>
    </Skeleton>
  );
}
```

## Next.js — Server Component with Suspense

```tsx title="app/users/page.tsx"
import { Suspense } from "react";
import { Skeleton } from "skelion";
import { UserList } from "./UserList";

export default function UsersPage() {
  return (
    <main>
      <h1>Users</h1>
      <Suspense
        fallback={
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} loading={true} variant="avatar" />
            ))}
          </div>
        }
      >
        <UserList />
      </Suspense>
    </main>
  );
}
```

## Next.js — Client Component with SSR

```tsx title="app/components/Dashboard.tsx"
"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "skelion";

export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  return (
    <Skeleton loading={loading} ssr>
      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Revenue</h3>
          <p className="stat-value">${stats?.revenue}</p>
        </div>
        <div className="stat-card">
          <h3>Users</h3>
          <p className="stat-value">{stats?.users}</p>
        </div>
        <div className="stat-card">
          <h3>Orders</h3>
          <p className="stat-value">{stats?.orders}</p>
        </div>
      </div>
    </Skeleton>
  );
}
```

## Manual Sub-Components

```tsx
import { Skeleton } from "skelion";

function CommentSkeleton() {
  return (
    <div style={{ display: "flex", gap: 12, padding: 16 }}>
      <Skeleton.Circle size={40} animation="shimmer" />
      <div style={{ flex: 1 }}>
        <Skeleton.Text width="30%" height={14} animation="shimmer" />
        <Skeleton.Text
          width="100%"
          height={12}
          lines={3}
          animation="shimmer"
          style={{ marginTop: 8 }}
        />
      </div>
    </div>
  );
}

function CommentList({ comments, loading }) {
  if (loading) {
    return (
      <div>
        {Array.from({ length: 3 }, (_, i) => (
          <CommentSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
```

## CLI-Generated Components

```bash
# Generate skeleton components
npx skelion generate card --name Product --animation shimmer
npx skelion generate table --name Orders
npx skelion generate profile --name User
```

Then use them:

```tsx
import { ProductSkeleton } from "./components/skeletons/ProductSkeleton";
import { OrdersSkeleton } from "./components/skeletons/OrdersSkeleton";

function App() {
  return (
    <div>
      {loading ? <ProductSkeleton /> : <ProductCard />}
      {loading ? <OrdersSkeleton /> : <OrdersTable />}
    </div>
  );
}
```
