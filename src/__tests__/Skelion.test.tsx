import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Skelion } from "../components/Skelion";

// ─────────────────────────────────────────────
// Layout mock system (same as Skeleton tests)
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
// Deprecated Skelion wrapper tests
// ─────────────────────────────────────────────

describe("Skelion — deprecated wrapper", () => {
  it("logs a deprecation warning on first render", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <Skelion loading={true} variant="text">
        <p>Content</p>
      </Skelion>
    );

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("<Skelion /> is deprecated")
    );

    warnSpy.mockRestore();
  });

  it("renders children when loading=false (same as Skeleton)", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <Skelion loading={false}>
        <p>Hello world</p>
      </Skelion>
    );

    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    warnSpy.mockRestore();
  });

  it("shows loading status with aria-busy when loading", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <Skelion loading={true}>
        <p>Content</p>
      </Skelion>
    );

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-busy", "true");
    expect(status).toHaveAttribute("aria-label", "Loading content");

    warnSpy.mockRestore();
  });

  it("renders text variant preset", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const { container } = render(
      <Skelion loading={true} variant="text">
        <p>Unused children</p>
      </Skelion>
    );

    const nodes = container.querySelectorAll(".skeleton-node");
    expect(nodes.length).toBe(3);
    nodes.forEach((node) => {
      expect(node).toHaveClass("skeleton-node--rounded");
    });

    warnSpy.mockRestore();
  });

  it("provides sub-components (Text, Circle, Block, Image)", () => {
    expect(Skelion.Text).toBeDefined();
    expect(Skelion.Circle).toBeDefined();
    expect(Skelion.Block).toBeDefined();
    expect(Skelion.Image).toBeDefined();
  });

  it("Skelion.Text renders with skeleton-* classes", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const { container } = render(
      <Skelion.Text width="80%" height={18} />
    );

    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass("skeleton-node");
    expect(node).toHaveClass("skeleton-node--rounded");
    expect(node.style.width).toBe("80%");
    expect(node.style.height).toBe("18px");

    warnSpy.mockRestore();
  });

  it("generates DOM-aware skeleton nodes", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const pRect = registerRect({ x: 10, y: 20, width: 380, height: 24 });

    const { container } = render(
      <Skelion loading={true}>
        <p data-skelion-rect={pRect}>Text</p>
      </Skelion>
    );

    const wrapper = container.querySelector(".skeleton-wrapper");
    expect(wrapper).toBeInTheDocument();

    const nodes = wrapper!.querySelectorAll(".skeleton-node");
    expect(nodes.length).toBeGreaterThan(0);

    warnSpy.mockRestore();
  });
});
