---
sidebar_position: 4
---

# Styling & Theming

Skelion uses CSS custom properties (variables) for full theming control. No build-time configuration needed.

## CSS Variables

Override these variables in your CSS to customize the skeleton appearance:

```css
:root {
  --skeleton-color: #e5e7eb;                    /* Background color */
  --skeleton-shimmer: rgba(255, 255, 255, 0.4); /* Shimmer highlight */
  --skeleton-radius: 4px;                        /* Border radius */
  --skeleton-duration: 1.5s;                     /* Animation speed */
}
```

## Dark Mode

Skelion automatically supports dark mode via `prefers-color-scheme`:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --skeleton-color: #374151;
    --skeleton-shimmer: rgba(255, 255, 255, 0.08);
  }
}
```

For class-based dark mode (e.g., Tailwind's `dark:` classes):

```css
.dark {
  --skeleton-color: #374151;
  --skeleton-shimmer: rgba(255, 255, 255, 0.08);
}
```

## Tailwind CSS Integration

Skelion works great with Tailwind. Override the CSS variables using Tailwind's theme values:

```css title="globals.css"
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --skeleton-color: theme(colors.gray.200);
  --skeleton-shimmer: rgba(255, 255, 255, 0.4);
  --skeleton-radius: theme(borderRadius.DEFAULT);
}

.dark {
  --skeleton-color: theme(colors.gray.700);
  --skeleton-shimmer: rgba(255, 255, 255, 0.08);
}
```

You can also use Tailwind utility classes directly on skeleton components:

```tsx
<Skeleton.Text className="rounded-lg" width="100%" height={16} />
<Skeleton.Circle className="ring-2 ring-gray-100" size={48} />
```

## Custom Colors Per Component

Override variables inline for specific skeletons:

```tsx
<div style={{ "--skeleton-color": "#dbeafe" } as React.CSSProperties}>
  <Skeleton loading={true} variant="card" />
</div>
```

## Custom Class Names

All components accept a `className` prop:

```tsx
<Skeleton loading={true} className="my-skeleton-wrapper">
  <YourComponent />
</Skeleton>

<Skeleton.Text className="my-text-skeleton" />
```

## Available CSS Classes

| Class | Description |
|---|---|
| `.skeleton-node` | Base skeleton element |
| `.skeleton-node--rounded` | Rounded corners |
| `.skeleton-node--circle` | Circular shape |
| `.skeleton-wrapper` | Auto-skeleton container |
| `.skeleton-fallback` | SSR fallback placeholder |
| `.skeleton-animate-pulse` | Pulse animation |
| `.skeleton-animate-shimmer` | Shimmer animation |
| `.skeleton-animate-wave` | Wave animation |
| `.skeleton-animate-solid` | No animation |
| `.skeleton-ssr` | SSR state (animations disabled) |
