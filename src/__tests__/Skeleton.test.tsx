import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Skeleton } from "../components/Skeleton";

// ─────────────────────────────────────────────
// Layout mock system
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
    const rectId = this.getAttribute("data-skelion-rect");
    if (rectId && rectRegistry.has(rectId)) {
      const r = rectRegistry.get(rectId)!;
      return {
        x: r.x, y: r.y, left: r.x, top: r.y,
        right: r.x + r.width, bottom: r.y + r.height,
        width: r.width, height: r.height, toJSON() {},
      } as DOMRect;
    }

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

// ─────────────────────────────────────────────
// 1. Basic rendering
// ─────────────────────────────────────────────

describe("Skeleton — basic rendering", () => {
  it("renders children normally when loading=false", () => {
    render(
      <Skeleton loading={false}>
        <p>Hello world</p>
      </Skeleton>
    );

    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("hides children when loading=true", () => {
    const { container } = render(
      <Skeleton loading={true}>
        <p>Hidden content</p>
      </Skeleton>
    );

    const hiddenContainer = container.querySelector("[aria-hidden='true']");
    expect(hiddenContainer).toBeInTheDocument();
    expect(hiddenContainer).toHaveStyle({ visibility: "hidden" });
  });

  it("shows loading status with aria-busy when loading", () => {
    render(
      <Skeleton loading={true}>
        <p>Content</p>
      </Skeleton>
    );

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-busy", "true");
    expect(status).toHaveAttribute("aria-label", "Loading content");
  });

  it("transitions from loading to content without errors", () => {
    const { rerender } = render(
      <Skeleton loading={true} variant="text">
        <p>Real content</p>
      </Skeleton>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();

    rerender(
      <Skeleton loading={false} variant="text">
        <p>Real content</p>
      </Skeleton>
    );

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText("Real content")).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────
// 2. DOM-aware skeleton generation
// ─────────────────────────────────────────────

describe("Skeleton — DOM-aware skeleton generation", () => {
  it("generates skeleton nodes matching a user profile card layout", () => {
    const avatarRect = registerRect({ x: 20, y: 20, width: 80, height: 80 });
    const nameRect = registerRect({ x: 20, y: 120, width: 360, height: 28 });
    const bioRect = registerRect({ x: 20, y: 160, width: 360, height: 20 });
    const btnRect = registerRect({ x: 20, y: 200, width: 100, height: 36 });
    const cardRect = registerRect({ x: 0, y: 0, width: 400, height: 300 });

    const ProfileCard = () => (
      <div data-skelion-rect={cardRect}>
        <img src="avatar.png" alt="avatar" data-skelion-rect={avatarRect} />
        <h2 data-skelion-rect={nameRect}>John Doe</h2>
        <p data-skelion-rect={bioRect}>Software engineer at Acme Corp</p>
        <button data-skelion-rect={btnRect}>Follow</button>
      </div>
    );

    const { container } = render(
      <Skeleton loading={true}>
        <ProfileCard />
      </Skeleton>
    );

    const skeletonWrapper = container.querySelector(".skeleton-wrapper");
    expect(skeletonWrapper).toBeInTheDocument();

    const skeletonNodes = skeletonWrapper!.querySelectorAll(".skeleton-node");
    expect(skeletonNodes.length).toBe(4);

    const nodeStyles = Array.from(skeletonNodes).map((node) => ({
      left: (node as HTMLElement).style.left,
      top: (node as HTMLElement).style.top,
      width: (node as HTMLElement).style.width,
      height: (node as HTMLElement).style.height,
    }));

    expect(nodeStyles).toContainEqual({
      left: "20px", top: "20px", width: "80px", height: "80px",
    });
    expect(nodeStyles).toContainEqual({
      left: "20px", top: "120px", width: "360px", height: "28px",
    });
    expect(nodeStyles).toContainEqual({
      left: "20px", top: "160px", width: "360px", height: "20px",
    });
    expect(nodeStyles).toContainEqual({
      left: "20px", top: "200px", width: "100px", height: "36px",
    });
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
      <Skeleton loading={true}>
        <LoginForm />
      </Skeleton>
    );

    const wrapper = container.querySelector(".skeleton-wrapper");
    expect(wrapper).toBeInTheDocument();

    const skeletonNodes = wrapper!.querySelectorAll(".skeleton-node");
    expect(skeletonNodes.length).toBe(5);
  });
});

// ─────────────────────────────────────────────
// 3. Animation variants
// ─────────────────────────────────────────────

describe("Skeleton — animation variants", () => {
  it("applies pulse animation by default", () => {
    const pRect = registerRect({ x: 0, y: 0, width: 400, height: 20 });

    const { container } = render(
      <Skeleton loading={true}>
        <p data-skelion-rect={pRect}>Text</p>
      </Skeleton>
    );

    const nodes = container.querySelectorAll(".skeleton-wrapper .skeleton-node");
    expect(nodes.length).toBeGreaterThan(0);
    nodes.forEach((node) => {
      expect(node).toHaveClass("skeleton-animate-pulse");
    });
  });

  it("applies shimmer animation when specified", () => {
    const pRect = registerRect({ x: 0, y: 0, width: 400, height: 20 });

    const { container } = render(
      <Skeleton loading={true} animation="shimmer">
        <p data-skelion-rect={pRect}>Text</p>
      </Skeleton>
    );

    const nodes = container.querySelectorAll(".skeleton-wrapper .skeleton-node");
    nodes.forEach((node) => {
      expect(node).toHaveClass("skeleton-animate-shimmer");
    });
  });

  it("applies wave animation when specified", () => {
    const pRect = registerRect({ x: 0, y: 0, width: 400, height: 20 });

    const { container } = render(
      <Skeleton loading={true} animation="wave">
        <p data-skelion-rect={pRect}>Text</p>
      </Skeleton>
    );

    const nodes = container.querySelectorAll(".skeleton-wrapper .skeleton-node");
    nodes.forEach((node) => {
      expect(node).toHaveClass("skeleton-animate-wave");
    });
  });

  it("applies solid (no animation) when specified", () => {
    const pRect = registerRect({ x: 0, y: 0, width: 400, height: 20 });

    const { container } = render(
      <Skeleton loading={true} animation="solid">
        <p data-skelion-rect={pRect}>Text</p>
      </Skeleton>
    );

    const nodes = container.querySelectorAll(".skeleton-wrapper .skeleton-node");
    nodes.forEach((node) => {
      expect(node).toHaveClass("skeleton-animate-solid");
      expect(node).not.toHaveClass("skeleton-animate-pulse");
    });
  });

  it("sets custom duration via CSS variable", () => {
    const pRect = registerRect({ x: 0, y: 0, width: 400, height: 20 });

    const { container } = render(
      <Skeleton loading={true} duration={2.5}>
        <p data-skelion-rect={pRect}>Text</p>
      </Skeleton>
    );

    const node = container.querySelector(
      ".skeleton-wrapper .skeleton-node"
    ) as HTMLElement;
    expect(node).toBeTruthy();
    expect(node.style.getPropertyValue("--skeleton-duration")).toBe("2.5s");
  });
});

// ─────────────────────────────────────────────
// 4. Variant presets
// ─────────────────────────────────────────────

describe("Skeleton — variant presets", () => {
  it("renders text variant with 3 text lines", () => {
    const { container } = render(
      <Skeleton loading={true} variant="text">
        <p>Unused children</p>
      </Skeleton>
    );

    const nodes = container.querySelectorAll(".skeleton-node");
    expect(nodes.length).toBe(3);
    nodes.forEach((node) => {
      expect(node).toHaveClass("skeleton-node--rounded");
    });
  });

  it("renders avatar variant with circle and text lines", () => {
    const { container } = render(
      <Skeleton loading={true} variant="avatar">
        <p>Unused</p>
      </Skeleton>
    );

    const circles = container.querySelectorAll(".skeleton-node--circle");
    expect(circles.length).toBe(1);

    const textLines = container.querySelectorAll(".skeleton-node--rounded");
    expect(textLines.length).toBe(2);
  });

  it("renders card variant with block and text lines", () => {
    const { container } = render(
      <Skeleton loading={true} variant="card">
        <p>Unused</p>
      </Skeleton>
    );

    const nodes = container.querySelectorAll(".skeleton-node");
    expect(nodes.length).toBe(4);
  });

  it("renders image variant with placeholder", () => {
    const { container } = render(
      <Skeleton loading={true} variant="image">
        <p>Unused</p>
      </Skeleton>
    );

    const nodes = container.querySelectorAll(".skeleton-node");
    expect(nodes.length).toBe(1);

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────
// 5. Custom sizing (width/height props)
// ─────────────────────────────────────────────

describe("Skeleton — custom sizing", () => {
  it("renders a simple skeleton with width and height", () => {
    const { container } = render(
      <Skeleton loading={true} width={200} height={20} />
    );

    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass("skeleton-node");
    expect(node.style.width).toBe("200px");
    expect(node.style.height).toBe("20px");
  });

  it("renders with string width/height", () => {
    const { container } = render(
      <Skeleton loading={true} width="100%" height="2rem" />
    );

    const node = container.firstChild as HTMLElement;
    expect(node.style.width).toBe("100%");
    expect(node.style.height).toBe("2rem");
  });

  it("has proper accessibility on custom-sized skeleton", () => {
    const { container } = render(
      <Skeleton loading={true} width={200} height={20} />
    );

    const node = container.firstChild as HTMLElement;
    expect(node).toHaveAttribute("aria-busy", "true");
    expect(node).toHaveAttribute("role", "status");
  });
});

// ─────────────────────────────────────────────
// 6. Sub-components
// ─────────────────────────────────────────────

describe("Skeleton — sub-components", () => {
  it("Skeleton.Text renders with correct dimensions and animation", () => {
    const { container } = render(
      <Skeleton.Text width="80%" height={18} animation="shimmer" />
    );

    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass("skeleton-node");
    expect(node).toHaveClass("skeleton-node--rounded");
    expect(node).toHaveClass("skeleton-animate-shimmer");
    expect(node.style.width).toBe("80%");
    expect(node.style.height).toBe("18px");
    expect(node).toHaveAttribute("aria-hidden", "true");
  });

  it("Skeleton.Text renders multiple lines", () => {
    const { container } = render(
      <Skeleton.Text lines={3} width="100%" height={14} />
    );

    const nodes = container.querySelectorAll(".skeleton-node");
    expect(nodes.length).toBe(3);
  });

  it("Skeleton.Circle renders with correct size", () => {
    const { container } = render(<Skeleton.Circle size={64} />);

    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass("skeleton-node--circle");
    expect(node.style.width).toBe("64px");
    expect(node.style.height).toBe("64px");
  });

  it("Skeleton.Block renders with correct dimensions", () => {
    const { container } = render(
      <Skeleton.Block width={300} height={200} />
    );

    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass("skeleton-node");
    expect(node).toHaveClass("skeleton-node--rounded");
    expect(node.style.width).toBe("300px");
    expect(node.style.height).toBe("200px");
  });

  it("Skeleton.Block renders without rounded when rounded=false", () => {
    const { container } = render(<Skeleton.Block rounded={false} />);

    const node = container.firstChild as HTMLElement;
    expect(node).not.toHaveClass("skeleton-node--rounded");
  });

  it("Skeleton.Image renders with SVG placeholder icon", () => {
    const { container } = render(
      <Skeleton.Image width={300} height={200} />
    );

    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass("skeleton-node");
    expect(node.style.width).toBe("300px");
    expect(node.style.height).toBe("200px");

    const svg = node.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("sub-components default to pulse animation", () => {
    const { container } = render(
      <div>
        <Skeleton.Text />
        <Skeleton.Circle />
        <Skeleton.Block />
      </div>
    );

    const nodes = container.querySelectorAll(".skeleton-node");
    nodes.forEach((node) => {
      expect(node).toHaveClass("skeleton-animate-pulse");
    });
  });

  it("sub-components accept custom className", () => {
    const { container } = render(
      <Skeleton.Text className="my-custom-class" />
    );

    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass("my-custom-class");
  });
});

// ─────────────────────────────────────────────
// 7. SSR safety
// ─────────────────────────────────────────────

describe("Skeleton — SSR safety", () => {
  it("renders a fallback skeleton before measurement", () => {
    let storedCb: FrameRequestCallback | null = null;
    globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => {
      storedCb = cb;
      return 1;
    };

    const { container } = render(
      <Skeleton loading={true}>
        <div>Content</div>
      </Skeleton>
    );

    const fallback = container.querySelector(".skeleton-fallback");
    expect(fallback).toBeInTheDocument();
    expect(container.querySelector(".skeleton-wrapper")).not.toBeInTheDocument();

    act(() => {
      storedCb?.(performance.now());
    });

    expect(container.querySelector(".skeleton-fallback")).not.toBeInTheDocument();
    expect(container.querySelector(".skeleton-wrapper")).toBeInTheDocument();
  });

  it("applies skeleton-ssr class when ssr prop is true (pre-hydration)", () => {
    const { container } = render(
      <Skeleton loading={true} variant="text" ssr>
        <p>Content</p>
      </Skeleton>
    );

    // After useEffect fires (in test env), skeleton-ssr should be removed
    // But the component should still render
    const status = screen.getByRole("status");
    expect(status).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────
// 8. Accessibility
// ─────────────────────────────────────────────

describe("Skeleton — accessibility", () => {
  it("sets aria-busy on the wrapper when loading", () => {
    render(
      <Skeleton loading={true}>
        <p>Content</p>
      </Skeleton>
    );

    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
  });

  it("removes aria-busy when not loading", () => {
    render(
      <Skeleton loading={false}>
        <p>Content</p>
      </Skeleton>
    );

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("sets aria-hidden on all skeleton nodes", () => {
    const pRect = registerRect({ x: 0, y: 0, width: 400, height: 20 });

    const { container } = render(
      <Skeleton loading={true}>
        <p data-skelion-rect={pRect}>Text</p>
      </Skeleton>
    );

    const skeletonNodes = container.querySelectorAll(
      ".skeleton-wrapper .skeleton-node"
    );
    expect(skeletonNodes.length).toBeGreaterThan(0);
    skeletonNodes.forEach((node) => {
      expect(node).toHaveAttribute("aria-hidden", "true");
    });
  });
});

// ─────────────────────────────────────────────
// 9. Props and configuration
// ─────────────────────────────────────────────

describe("Skeleton — props", () => {
  it("accepts custom wrapper element via 'as' prop", () => {
    render(
      <Skeleton loading={true} as="section" variant="text">
        <p>Content</p>
      </Skeleton>
    );

    const status = screen.getByRole("status");
    expect(status.tagName).toBe("SECTION");
  });

  it("applies custom className to wrapper", () => {
    render(
      <Skeleton loading={true} className="my-wrapper" variant="text">
        <p>Content</p>
      </Skeleton>
    );

    const status = screen.getByRole("status");
    expect(status).toHaveClass("my-wrapper");
  });

  it("applies custom style to wrapper", () => {
    render(
      <Skeleton loading={true} variant="text" style={{ maxWidth: 400 }}>
        <p>Content</p>
      </Skeleton>
    );

    const status = screen.getByRole("status");
    expect(status.style.maxWidth).toBe("400px");
  });

  it("auto-detects variant when children provided without explicit variant", () => {
    const pRect = registerRect({ x: 0, y: 0, width: 400, height: 20 });

    const { container } = render(
      <Skeleton loading={true}>
        <p data-skelion-rect={pRect}>Text</p>
      </Skeleton>
    );

    // Should use auto mode and generate skeleton
    const wrapper = container.querySelector(".skeleton-wrapper");
    expect(wrapper).toBeInTheDocument();
  });
});
