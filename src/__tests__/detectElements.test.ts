import { detectElements } from "../utils/detectElements";

/**
 * Helper: create a DOM tree and mock getBoundingClientRect on each element
 * so that detectElements can read real layout positions in jsdom.
 */
function mockRect(
  el: HTMLElement,
  rect: { x: number; y: number; width: number; height: number }
) {
  el.getBoundingClientRect = () =>
    ({
      x: rect.x,
      y: rect.y,
      left: rect.x,
      top: rect.y,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height,
      width: rect.width,
      height: rect.height,
      toJSON: () => {},
    } as DOMRect);
}

describe("detectElements", () => {
  let root: HTMLDivElement;

  beforeEach(() => {
    root = document.createElement("div");
    document.body.appendChild(root);
  });

  afterEach(() => {
    document.body.removeChild(root);
  });

  it("detects a paragraph as a text element with correct position", () => {
    const p = document.createElement("p");
    p.textContent = "Hello world";
    root.appendChild(p);

    mockRect(root, { x: 0, y: 0, width: 400, height: 200 });
    mockRect(p, { x: 10, y: 20, width: 380, height: 24 });

    const elements = detectElements(root);

    expect(elements).toHaveLength(1);
    expect(elements[0].type).toBe("text");
    expect(elements[0].rect).toEqual({ x: 10, y: 20, width: 380, height: 24 });
  });

  it("detects an image element", () => {
    const img = document.createElement("img");
    img.src = "test.png";
    root.appendChild(img);

    mockRect(root, { x: 0, y: 0, width: 400, height: 300 });
    mockRect(img, { x: 0, y: 0, width: 200, height: 150 });

    const elements = detectElements(root);

    expect(elements).toHaveLength(1);
    expect(elements[0].type).toBe("image");
    expect(elements[0].rect.width).toBe(200);
    expect(elements[0].rect.height).toBe(150);
  });

  it("detects a button element", () => {
    const btn = document.createElement("button");
    btn.textContent = "Click me";
    root.appendChild(btn);

    mockRect(root, { x: 0, y: 0, width: 400, height: 100 });
    mockRect(btn, { x: 50, y: 30, width: 120, height: 40 });

    const elements = detectElements(root);

    expect(elements).toHaveLength(1);
    expect(elements[0].type).toBe("button");
    expect(elements[0].rect).toEqual({ x: 50, y: 30, width: 120, height: 40 });
  });

  it("detects an input element", () => {
    const input = document.createElement("input");
    input.type = "text";
    root.appendChild(input);

    mockRect(root, { x: 0, y: 0, width: 400, height: 100 });
    mockRect(input, { x: 10, y: 10, width: 300, height: 36 });

    const elements = detectElements(root);

    expect(elements).toHaveLength(1);
    expect(elements[0].type).toBe("input");
  });

  it("detects multiple elements in a card layout", () => {
    // Simulating: avatar image + heading + paragraph + button
    const card = document.createElement("div");
    const avatar = document.createElement("img");
    const heading = document.createElement("h2");
    heading.textContent = "John Doe";
    const bio = document.createElement("p");
    bio.textContent = "Software engineer at Acme Corp";
    const followBtn = document.createElement("button");
    followBtn.textContent = "Follow";

    card.appendChild(avatar);
    card.appendChild(heading);
    card.appendChild(bio);
    card.appendChild(followBtn);
    root.appendChild(card);

    mockRect(root, { x: 0, y: 0, width: 400, height: 300 });
    mockRect(card, { x: 0, y: 0, width: 400, height: 300 });
    mockRect(avatar, { x: 20, y: 20, width: 80, height: 80 });
    mockRect(heading, { x: 20, y: 120, width: 360, height: 28 });
    mockRect(bio, { x: 20, y: 160, width: 360, height: 20 });
    mockRect(followBtn, { x: 20, y: 200, width: 100, height: 36 });

    const elements = detectElements(root);

    expect(elements).toHaveLength(4);

    const types = elements.map((e) => e.type);
    expect(types).toContain("image");
    expect(types).toContain("text");
    expect(types).toContain("button");

    // Avatar should be at its exact position
    const avatarEl = elements.find((e) => e.type === "image")!;
    expect(avatarEl.rect).toEqual({ x: 20, y: 20, width: 80, height: 80 });

    // Button should be at its exact position
    const btnEl = elements.find((e) => e.type === "button")!;
    expect(btnEl.rect).toEqual({ x: 20, y: 200, width: 100, height: 36 });
  });

  it("skips invisible elements (display: none)", () => {
    const visible = document.createElement("p");
    visible.textContent = "Visible";
    const hidden = document.createElement("p");
    hidden.textContent = "Hidden";
    hidden.style.display = "none";

    root.appendChild(visible);
    root.appendChild(hidden);

    mockRect(root, { x: 0, y: 0, width: 400, height: 100 });
    mockRect(visible, { x: 0, y: 0, width: 400, height: 20 });
    mockRect(hidden, { x: 0, y: 0, width: 0, height: 0 });

    const elements = detectElements(root);

    expect(elements).toHaveLength(1);
    expect(elements[0].type).toBe("text");
  });

  it("skips elements that are too small (< 4px)", () => {
    const tiny = document.createElement("span");
    tiny.textContent = ".";
    root.appendChild(tiny);

    mockRect(root, { x: 0, y: 0, width: 400, height: 100 });
    mockRect(tiny, { x: 0, y: 0, width: 2, height: 2 });

    const elements = detectElements(root);
    expect(elements).toHaveLength(0);
  });

  it("skips script and style tags", () => {
    const script = document.createElement("script");
    script.textContent = "console.log('test')";
    const style = document.createElement("style");
    style.textContent = "body { margin: 0 }";
    const p = document.createElement("p");
    p.textContent = "Real content";

    root.appendChild(script);
    root.appendChild(style);
    root.appendChild(p);

    mockRect(root, { x: 0, y: 0, width: 400, height: 100 });
    mockRect(p, { x: 0, y: 0, width: 400, height: 20 });

    const elements = detectElements(root);

    expect(elements).toHaveLength(1);
    expect(elements[0].type).toBe("text");
  });

  it("respects density setting - low captures fewer elements", () => {
    // Build a 3-level nested structure
    const outer = document.createElement("div");
    const middle = document.createElement("div");
    const inner = document.createElement("div");
    const deep = document.createElement("p");
    deep.textContent = "Deep text";

    inner.appendChild(deep);
    middle.appendChild(inner);
    outer.appendChild(middle);
    root.appendChild(outer);

    mockRect(root, { x: 0, y: 0, width: 400, height: 200 });
    mockRect(outer, { x: 0, y: 0, width: 400, height: 200 });
    mockRect(middle, { x: 0, y: 0, width: 400, height: 200 });
    mockRect(inner, { x: 10, y: 10, width: 380, height: 30 });
    mockRect(deep, { x: 10, y: 10, width: 380, height: 20 });

    // Low density (max depth 2) — should hit inner as max-depth container
    const lowElements = detectElements(root, "low");
    expect(lowElements.length).toBeGreaterThanOrEqual(1);

    // High density (max depth 8) — should reach the paragraph
    const highElements = detectElements(root, "high");
    const hasText = highElements.some((e) => e.type === "text");
    expect(hasText).toBe(true);
  });

  it("classifies elements by ARIA role", () => {
    const imgDiv = document.createElement("div");
    imgDiv.setAttribute("role", "img");
    imgDiv.textContent = "decorative";
    root.appendChild(imgDiv);

    mockRect(root, { x: 0, y: 0, width: 400, height: 100 });
    mockRect(imgDiv, { x: 0, y: 0, width: 100, height: 100 });

    const elements = detectElements(root);

    expect(elements).toHaveLength(1);
    expect(elements[0].type).toBe("image");
  });

  it("calculates positions relative to root container", () => {
    const p = document.createElement("p");
    p.textContent = "Offset text";
    root.appendChild(p);

    // Root is offset from viewport
    mockRect(root, { x: 100, y: 200, width: 400, height: 300 });
    // Paragraph is inside root
    mockRect(p, { x: 110, y: 220, width: 380, height: 24 });

    const elements = detectElements(root);

    expect(elements).toHaveLength(1);
    // Position should be relative: 110-100=10, 220-200=20
    expect(elements[0].rect.x).toBe(10);
    expect(elements[0].rect.y).toBe(20);
  });
});
