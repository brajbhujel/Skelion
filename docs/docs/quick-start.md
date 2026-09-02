---
sidebar_position: 3
---

# Quick Start

## 1. Auto Skeleton (Recommended)

The easiest way to use Skelion — wrap your component and let it auto-detect the layout:

```tsx
import { Skeleton } from "skelion";
import "skelion/styles.css";

function ProductCard({ product, loading }) {
  return (
    <Skeleton loading={loading}>
      <div className="card">
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <span>${product.price}</span>
      </div>
    </Skeleton>
  );
}
```

Skelion reads the DOM structure of your component and generates skeleton placeholders that match each element's exact position and dimensions. The wrapper is always `width: 100%` of its parent.

If children would collapse without data, pass a fixture so measurement still sees a full layout:

```tsx
<Skeleton loading={isLoading} fixture={<ProductCard product={PLACEHOLDER} />}>
  {product && <ProductCard product={product} />}
</Skeleton>
```


## 2. Preset Variants

Use built-in presets for common patterns without needing children:

```tsx
// Text skeleton (3 lines)
<Skeleton loading={loading} variant="text" />

// Avatar + name skeleton
<Skeleton loading={loading} variant="avatar" />

// Card skeleton (image + text)
<Skeleton loading={loading} variant="card" />

// Image placeholder
<Skeleton loading={loading} variant="image" />
```

## 3. Manual Sub-Components

For fine-grained control, use the sub-components directly:

```tsx
import { Skeleton } from "skelion";

function CustomSkeleton() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <Skeleton.Circle size={48} />
      <div style={{ flex: 1 }}>
        <Skeleton.Text width="60%" height={16} />
        <Skeleton.Text width="40%" height={14} style={{ marginTop: 8 }} />
      </div>
    </div>
  );
}
```

## 4. Simple Skeleton (Width/Height)

For a single skeleton shape without children:

```tsx
// A simple rectangular skeleton
<Skeleton loading={true} width={200} height={20} />

// Full-width skeleton
<Skeleton loading={true} width="100%" height={16} />
```

## 5. Custom Animation

Choose from 4 animation styles:

```tsx
<Skeleton loading={loading} animation="pulse">   {/* Default */}
  <YourComponent />
</Skeleton>

<Skeleton loading={loading} animation="shimmer"> {/* Gradient slide */}
  <YourComponent />
</Skeleton>

<Skeleton loading={loading} animation="wave">    {/* Wave effect */}
  <YourComponent />
</Skeleton>

<Skeleton loading={loading} animation="solid">   {/* No animation */}
  <YourComponent />
</Skeleton>
```
