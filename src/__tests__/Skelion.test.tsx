import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Skelion } from "../components/Skelion";

// ─────────────────────────────────────────────
// Layout mock system
//
// jsdom has no layout engine, so getBoundingClientRect returns zeros.
// We mock Element.prototype.getBoundingClientRect to return rects based
// on a data-skelion-rect attribute. This lets us define layouts BEFORE
// render, so measurement during useEffect/RAF uses our mocked values.
// ─────────────────────────────────────────────

type Rect = { x: number; y: number; width: number; height: number };

const rectRegistry = new Map<string, Rect>();
let rectIdCounter = 0;

function registerRect(rect: Rect): string {
  const id = `rect-${rectIdCounter++}`;
  rectRegistry.set(id, rect);
  return id;
}

const originalGetBCR = Element.prototype.getBoundingClientRect;

beforeAll(() => {
  Element.prototype.getBoundingClientRect = function (this: Element) {
    // Check for data-skelion-rect attribute
    const rectId = this.getAttribute("data-skelion-rect");
    if (rectId && rectRegistry.has(rectId)) {
      const r = rectRegistry.get(rectId)!;
      return {
        x: r.x,
        y: r.y,
        left: r.x,
        top: r.y,
        right: r.x + r.width,
        bottom: r.y + r.height,
        width: r.width,
        height: r.height,
        toJSON() {},
      } as DOMRect;
    }

    // Check for parent with data-skelion-root (the measurement container)
    // Give measurement containers a default large rect
    if (
      this.hasAttribute("aria-hidden") &&
      (this as HTMLElement).style?.visibility === "hidden"
    ) {
      return {
        x: 0, y: 0, left: 0, top: 0, right: 800, bottom: 600,
        width: 800, height: 600, toJSON() {},
      } as DOMRect;
    }

    return originalGetBCR.call(this);
  };
});

afterAll(() => {
  Element.prototype.getBoundingClientRect = originalGetBCR;
});

afterEach(() => {
  rectRegistry.clear();
  rectIdCounter = 0;
});

// Make requestAnimationFrame fire synchronously so measurement
// happens within the same act() as render
const originalRAF = globalThis.requestAnimationFrame;
const originalCAF = globalThis.cancelAnimationFrame;

beforeEach(() => {
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => {
    cb(performance.now());
    return 0;
  };
  globalThis.cancelAnimationFrame = () => {};
});

afterEach(() => {
  globalThis.requestAnimationFrame = originalRAF;
  globalThis.cancelAnimationFrame = originalCAF;
});

/**
 * Helper to create a component with layout annotations.
 * Each element gets a data-skelion-rect attribute that our mock reads.
 */
function withRect(
  element: React.ReactElement,
  rect: Rect
): React.ReactElement {
  const id = registerRect(rect);
  return React.cloneElement(element, { "data-skelion-rect": id } as any);
}

// ─────────────────────────────────────────────
// 1. Basic rendering behavior
// ─────────────────────────────────────────────

describe("Skelion — basic rendering", () => {
  it("renders children normally when loading=false", () => {
    render(
      <Skelion loading={false}>
        <p>Hello world</p>
      </Skelion>
    );

    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("does not render children visibly when loading=true", () => {
    const { container } = render(
      <Skelion loading={true}>
        <p>Hidden content</p>
      </Skelion>
    );

    const hiddenContainer = container.querySelector(
      "[aria-hidden='true']"
    );
    expect(hiddenContainer).toBeInTheDocument();
    expect(hiddenContainer).toHaveStyle({ visibility: "hidden" });
  });

  it("shows loading status with aria-busy when loading", () => {
    render(
      <Skelion loading={true}>
        <p>Content</p>
      </Skelion>
    );

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-busy", "true");
    expect(status).toHaveAttribute("aria-label", "Loading content");
  });
});

// ─────────────────────────────────────────────
// 2. DOM-aware skeleton generation
//    Tests that skeletons EXACTLY match the
//    layout dimensions of the real components
// ─────────────────────────────────────────────

describe("Skelion — DOM-aware skeleton generation", () => {
  it("generates skeleton nodes matching a user profile card layout", () => {
    const avatarRect = registerRect({ x: 20, y: 20, width: 80, height: 80 });
    const nameRect = registerRect({ x: 20, y: 120, width: 360, height: 28 });
    const bioRect = registerRect({ x: 20, y: 160, width: 360, height: 20 });
    const btnRect = registerRect({ x: 20, y: 200, width: 100, height: 36 });
    const cardRect = registerRect({ x: 0, y: 0, width: 400, height: 300 });

    const ProfileCard = () => (
      <div data-skelion-rect={cardRect}>
        <img
          src="avatar.png"
          alt="avatar"
          data-skelion-rect={avatarRect}
        />
        <h2 data-skelion-rect={nameRect}>John Doe</h2>
        <p data-skelion-rect={bioRect}>Software engineer at Acme Corp</p>
        <button data-skelion-rect={btnRect}>Follow</button>
      </div>
    );

    const { container } = render(
      <Skelion loading={true}>
        <ProfileCard />
      </Skelion>
    );

    // Verify skeleton wrapper appeared (measurement completed)
    const skeletonWrapper = container.querySelector(".skelion-wrapper");
    expect(skeletonWrapper).toBeInTheDocument();

    // Get all generated skeleton nodes
    const skeletonNodes = skeletonWrapper!.querySelectorAll(".skelion-node");
    expect(skeletonNodes.length).toBe(4); // img, h2, p, button

    const nodeStyles = Array.from(skeletonNodes).map((node) => ({
      left: (node as HTMLElement).style.left,
      top: (node as HTMLElement).style.top,
      width: (node as HTMLElement).style.width,
      height: (node as HTMLElement).style.height,
    }));

    // Each skeleton must match the exact position/size of the real element

    // Avatar skeleton: 80x80 at (20, 20)
    expect(nodeStyles).toContainEqual({
      left: "20px",
      top: "20px",
      width: "80px",
      height: "80px",
    });

    // Name skeleton: 360x28 at (20, 120)
    expect(nodeStyles).toContainEqual({
      left: "20px",
      top: "120px",
      width: "360px",
      height: "28px",
    });

    // Bio skeleton: 360x20 at (20, 160)
    expect(nodeStyles).toContainEqual({
      left: "20px",
      top: "160px",
      width: "360px",
      height: "20px",
    });

    // Follow button skeleton: 100x36 at (20, 200)
    expect(nodeStyles).toContainEqual({
      left: "20px",
      top: "200px",
      width: "100px",
      height: "36px",
    });
  });

  it("generates skeleton nodes matching a blog post layout", () => {
    const heroRect = registerRect({ x: 0, y: 0, width: 600, height: 300 });
    const titleRect = registerRect({ x: 0, y: 310, width: 400, height: 32 });
    const excerptRect = registerRect({ x: 0, y: 352, width: 600, height: 20 });
    const bodyRect = registerRect({ x: 0, y: 382, width: 600, height: 60 });
    const articleRect = registerRect({ x: 0, y: 0, width: 600, height: 500 });

    const BlogPost = () => (
      <article data-skelion-rect={articleRect}>
        <img src="hero.jpg" alt="hero" data-skelion-rect={heroRect} />
        <h1 data-skelion-rect={titleRect}>Post Title</h1>
        <p data-skelion-rect={excerptRect}>
          This is the excerpt text for the blog post.
        </p>
        <p data-skelion-rect={bodyRect}>
          Full body text goes here with more content.
        </p>
      </article>
    );

    const { container } = render(
      <Skelion loading={true} density="high">
        <BlogPost />
      </Skelion>
    );

    const wrapper = container.querySelector(".skelion-wrapper");
    expect(wrapper).toBeInTheDocument();

    const skeletonNodes = wrapper!.querySelectorAll(".skelion-node");
    expect(skeletonNodes.length).toBe(4);

    // Hero image skeleton: 600x300 at (0, 0)
    const heroSkeleton = Array.from(skeletonNodes).find(
      (n) =>
        (n as HTMLElement).style.width === "600px" &&
        (n as HTMLElement).style.height === "300px"
    );
    expect(heroSkeleton).toBeTruthy();

    // Title skeleton at y=310
    const titleSkeleton = Array.from(skeletonNodes).find(
      (n) => (n as HTMLElement).style.top === "310px"
    );
    expect(titleSkeleton).toBeTruthy();
    expect((titleSkeleton as HTMLElement).style.width).toBe("400px");
    expect((titleSkeleton as HTMLElement).style.height).toBe("32px");
  });

  it("generates skeleton matching a form layout with inputs", () => {
    const emailLabelRect = registerRect({ x: 0, y: 0, width: 60, height: 16 });
    const emailInputRect = registerRect({ x: 0, y: 24, width: 320, height: 40 });
    const passLabelRect = registerRect({ x: 0, y: 80, width: 80, height: 16 });
    const passInputRect = registerRect({ x: 0, y: 104, width: 320, height: 40 });
    const submitRect = registerRect({ x: 0, y: 160, width: 320, height: 44 });
    const formRect = registerRect({ x: 0, y: 0, width: 320, height: 300 });

    const LoginForm = () => (
      <form data-skelion-rect={formRect}>
        <label data-skelion-rect={emailLabelRect}>Email</label>
        <input type="email" data-skelion-rect={emailInputRect} />
        <label data-skelion-rect={passLabelRect}>Password</label>
        <input type="password" data-skelion-rect={passInputRect} />
        <button data-skelion-rect={submitRect}>Sign In</button>
      </form>
    );

    const { container } = render(
      <Skelion loading={true}>
        <LoginForm />
      </Skelion>
    );

    const wrapper = container.querySelector(".skelion-wrapper");
    expect(wrapper).toBeInTheDocument();

    const skeletonNodes = wrapper!.querySelectorAll(".skelion-node");
    expect(skeletonNodes.length).toBe(5);

    // Submit button skeleton at y=160, 320x44
    const btnSkeleton = Array.from(skeletonNodes).find(
      (n) => (n as HTMLElement).style.top === "160px"
    );
    expect(btnSkeleton).toBeTruthy();
    expect((btnSkeleton as HTMLElement).style.width).toBe("320px");
    expect((btnSkeleton as HTMLElement).style.height).toBe("44px");
  });

  it("generates skeletons with positions relative to root container", () => {
    // Root container is offset from viewport origin
    const pRect = registerRect({ x: 110, y: 220, width: 380, height: 24 });

    const { container } = render(
      <Skelion loading={true}>
        <p data-skelion-rect={pRect}>Offset text</p>
      </Skelion>
    );

    const wrapper = container.querySelector(".skelion-wrapper");
    expect(wrapper).toBeInTheDocument();

    const node = wrapper!.querySelector(".skelion-node") as HTMLElement;
    expect(node).toBeTruthy();
    // Position should be relative to the measurement container (800x600 at 0,0)
    expect(node.style.left).toBe("110px");
    expect(node.style.top).toBe("220px");
    expect(node.style.width).toBe("380px");
    expect(node.style.height).toBe("24px");
  });
});

// ─────────────────────────────────────────────
// 3. SSR safety
// ─────────────────────────────────────────────

describe("Skelion — SSR safety", () => {
  it("renders a fallback skeleton before measurement (deferred RAF)", () => {
    // Override RAF to NOT fire immediately, simulating SSR/pre-hydration
    let storedCb: FrameRequestCallback | null = null;
    globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => {
      storedCb = cb;
      return 1;
    };

    const { container } = render(
      <Skelion loading={true}>
        <div>Content</div>
      </Skelion>
    );

    // Before RAF fires → fallback skeleton
    const fallback = container.querySelector(".skelion-fallback");
    expect(fallback).toBeInTheDocument();
    expect(container.querySelector(".skelion-wrapper")).not.toBeInTheDocument();

    // Now fire RAF
    act(() => {
      storedCb?.(performance.now());
    });

    // After measurement → real skeleton wrapper replaces fallback
    expect(container.querySelector(".skelion-fallback")).not.toBeInTheDocument();
    expect(container.querySelector(".skelion-wrapper")).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────
// 4. Shimmer animation
// ─────────────────────────────────────────────

describe("Skelion — shimmer animation", () => {
  it("applies shimmer class to skeleton nodes by default", () => {
    const pRect = registerRect({ x: 0, y: 0, width: 400, height: 20 });

    const { container } = render(
      <Skelion loading={true}>
        <p data-skelion-rect={pRect}>Text</p>
      </Skelion>
    );

    const nodes = container.querySelectorAll(
      ".skelion-wrapper .skelion-node"
    );
    expect(nodes.length).toBeGreaterThan(0);
    nodes.forEach((node) => {
      expect(node).toHaveClass("skelion-shimmer");
    });
  });

  it("does not apply shimmer class when shimmer=false", () => {
    const pRect = registerRect({ x: 0, y: 0, width: 400, height: 20 });

    const { container } = render(
      <Skelion loading={true} shimmer={false}>
        <p data-skelion-rect={pRect}>Text</p>
      </Skelion>
    );

    const nodes = container.querySelectorAll(
      ".skelion-wrapper .skelion-node"
    );
    expect(nodes.length).toBeGreaterThan(0);
    nodes.forEach((node) => {
      expect(node).not.toHaveClass("skelion-shimmer");
    });
  });

  it("applies custom animation duration", () => {
    const pRect = registerRect({ x: 0, y: 0, width: 400, height: 20 });

    const { container } = render(
      <Skelion loading={true} duration={2.5}>
        <p data-skelion-rect={pRect}>Text</p>
      </Skelion>
    );

    const node = container.querySelector(
      ".skelion-wrapper .skelion-node"
    ) as HTMLElement;
    expect(node).toBeTruthy();
    expect(node.style.animationDuration).toBe("2.5s");
  });
});

// ─────────────────────────────────────────────
// 5. Variant presets
// ─────────────────────────────────────────────

describe("Skelion — variant presets", () => {
  it("renders text variant with 3 text lines", () => {
    const { container } = render(
      <Skelion loading={true} variant="text">
        <p>Unused children</p>
      </Skelion>
    );

    const nodes = container.querySelectorAll(".skelion-node");
    expect(nodes.length).toBe(3);
    nodes.forEach((node) => {
      expect(node).toHaveClass("skelion-node--rounded");
    });
  });

  it("renders avatar variant with circle and text lines", () => {
    const { container } = render(
      <Skelion loading={true} variant="avatar">
        <p>Unused</p>
      </Skelion>
    );

    const circles = container.querySelectorAll(".skelion-node--circle");
    expect(circles.length).toBe(1);

    const textLines = container.querySelectorAll(".skelion-node--rounded");
    expect(textLines.length).toBe(2);
  });

  it("renders card variant with block and text lines", () => {
    const { container } = render(
      <Skelion loading={true} variant="card">
        <p>Unused</p>
      </Skelion>
    );

    const nodes = container.querySelectorAll(".skelion-node");
    expect(nodes.length).toBe(4); // 1 block + 3 text lines
  });
});

// ─────────────────────────────────────────────
// 6. Sub-components (manual skeleton building)
// ─────────────────────────────────────────────

describe("Skelion — sub-components", () => {
  it("Skelion.Text renders with correct dimensions", () => {
    const { container } = render(
      <Skelion.Text width="80%" height={18} />
    );

    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass("skelion-node");
    expect(node).toHaveClass("skelion-node--rounded");
    expect(node).toHaveClass("skelion-shimmer");
    expect(node.style.width).toBe("80%");
    expect(node.style.height).toBe("18px");
    expect(node).toHaveAttribute("aria-hidden", "true");
  });

  it("Skelion.Circle renders with correct size", () => {
    const { container } = render(<Skelion.Circle size={64} />);

    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass("skelion-node--circle");
    expect(node.style.width).toBe("64px");
    expect(node.style.height).toBe("64px");
  });

  it("Skelion.Block renders with correct dimensions", () => {
    const { container } = render(
      <Skelion.Block width={300} height={200} />
    );

    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass("skelion-node");
    expect(node).toHaveClass("skelion-node--rounded");
    expect(node.style.width).toBe("300px");
    expect(node.style.height).toBe("200px");
  });

  it("Skelion.Block renders without rounded when rounded=false", () => {
    const { container } = render(<Skelion.Block rounded={false} />);

    const node = container.firstChild as HTMLElement;
    expect(node).not.toHaveClass("skelion-node--rounded");
  });

  it("sub-components respect shimmer=false", () => {
    const { container } = render(
      <div>
        <Skelion.Text shimmer={false} />
        <Skelion.Circle shimmer={false} />
        <Skelion.Block shimmer={false} />
      </div>
    );

    const nodes = container.querySelectorAll(".skelion-node");
    nodes.forEach((node) => {
      expect(node).not.toHaveClass("skelion-shimmer");
    });
  });

  it("sub-components accept custom className", () => {
    const { container } = render(
      <Skelion.Text className="my-custom-class" />
    );

    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass("my-custom-class");
  });
});

// ─────────────────────────────────────────────
// 7. Accessibility
// ─────────────────────────────────────────────

describe("Skelion — accessibility", () => {
  it("sets aria-busy on the wrapper when loading", () => {
    render(
      <Skelion loading={true}>
        <p>Content</p>
      </Skelion>
    );

    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
  });

  it("removes aria-busy when not loading", () => {
    render(
      <Skelion loading={false}>
        <p>Content</p>
      </Skelion>
    );

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("sets aria-hidden on all skeleton nodes", () => {
    const pRect = registerRect({ x: 0, y: 0, width: 400, height: 20 });

    const { container } = render(
      <Skelion loading={true}>
        <p data-skelion-rect={pRect}>Text</p>
      </Skelion>
    );

    const skeletonNodes = container.querySelectorAll(
      ".skelion-wrapper .skelion-node"
    );
    expect(skeletonNodes.length).toBeGreaterThan(0);
    skeletonNodes.forEach((node) => {
      expect(node).toHaveAttribute("aria-hidden", "true");
    });
  });
});

// ─────────────────────────────────────────────
// 8. Props and configuration
// ─────────────────────────────────────────────

describe("Skelion — props", () => {
  it('accepts custom wrapper element via "as" prop', () => {
    render(
      <Skelion loading={true} as="section" variant="text">
        <p>Content</p>
      </Skelion>
    );

    const status = screen.getByRole("status");
    expect(status.tagName).toBe("SECTION");
  });

  it("applies custom className to wrapper", () => {
    render(
      <Skelion loading={true} className="my-wrapper" variant="text">
        <p>Content</p>
      </Skelion>
    );

    const status = screen.getByRole("status");
    expect(status).toHaveClass("my-wrapper");
  });

  it("transitions from loading to content without errors", () => {
    const { rerender } = render(
      <Skelion loading={true} variant="text">
        <p>Real content</p>
      </Skelion>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();

    rerender(
      <Skelion loading={false} variant="text">
        <p>Real content</p>
      </Skelion>
    );

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText("Real content")).toBeInTheDocument();
  });
});
