export type DetectedElementType =
  | "text"
  | "image"
  | "button"
  | "circle"
  | "container"
  | "input"
  | "unknown";

export interface DetectedElement {
  type: DetectedElementType;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rounded: boolean;
}

const TEXT_TAGS = new Set([
  "P",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "SPAN",
  "LABEL",
  "A",
  "LI",
  "TD",
  "TH",
  "CAPTION",
  "FIGCAPTION",
  "BLOCKQUOTE",
  "CITE",
  "EM",
  "STRONG",
  "SMALL",
  "TIME",
]);

const IMAGE_TAGS = new Set(["IMG", "SVG", "PICTURE", "VIDEO", "CANVAS"]);
const BUTTON_TAGS = new Set(["BUTTON"]);
const INPUT_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "BR", "HR"]);

function isCircular(el: Element, rect: DOMRect): boolean {
  const style = window.getComputedStyle(el);
  const borderRadius = style.borderRadius;
  const aspectRatio = rect.width / rect.height;

  if (aspectRatio > 0.8 && aspectRatio < 1.2) {
    if (borderRadius === "50%" || borderRadius === "9999px") return true;
    const radiusValue = parseFloat(borderRadius);
    if (radiusValue >= rect.width / 2) return true;
  }

  return false;
}

function hasRounding(el: Element): boolean {
  const style = window.getComputedStyle(el);
  const radius = parseFloat(style.borderRadius);
  return radius > 0;
}

function classifyElement(el: Element): DetectedElementType {
  const tag = el.tagName;

  if (SKIP_TAGS.has(tag)) return "unknown";
  if (IMAGE_TAGS.has(tag)) return "image";
  if (BUTTON_TAGS.has(tag)) return "button";
  if (INPUT_TAGS.has(tag)) return "input";
  if (TEXT_TAGS.has(tag)) return "text";

  const role = el.getAttribute("role");
  if (role === "img" || role === "figure") return "image";
  if (role === "button") return "button";
  if (role === "textbox") return "input";

  return "container";
}

function isLeafNode(el: Element): boolean {
  if (IMAGE_TAGS.has(el.tagName) || INPUT_TAGS.has(el.tagName)) return true;
  if (BUTTON_TAGS.has(el.tagName)) return true;

  const children = el.children;
  if (children.length === 0) return true;

  // Text nodes with no element children
  if (el.childNodes.length > 0 && children.length === 0) return true;

  return false;
}

function isVisible(el: Element, rect: DOMRect): boolean {
  if (rect.width < 4 || rect.height < 4) return false;
  const style = window.getComputedStyle(el);
  // Only skip display:none (removes from layout). visibility:hidden keeps layout
  // intact, which is how our measurement container works.
  if (style.display === "none") return false;
  if (style.opacity === "0") return false;
  return true;
}

export type Density = "low" | "medium" | "high";

const DENSITY_DEPTH: Record<Density, number> = {
  low: 2,
  medium: 4,
  high: 8,
};

export function detectElements(
  root: HTMLElement,
  density: Density = "medium"
): DetectedElement[] {
  const elements: DetectedElement[] = [];
  const rootRect = root.getBoundingClientRect();
  const maxDepth = DENSITY_DEPTH[density];

  function walk(el: Element, depth: number) {
    if (depth > maxDepth) return;
    if (SKIP_TAGS.has(el.tagName)) return;

    const rect = el.getBoundingClientRect();
    if (!isVisible(el, rect)) return;

    if (isLeafNode(el) || depth === maxDepth) {
      const type = classifyElement(el);
      if (type === "unknown") return;

      const circular = isCircular(el, rect);

      elements.push({
        type: circular ? "circle" : type,
        rect: {
          x: rect.left - rootRect.left,
          y: rect.top - rootRect.top,
          width: rect.width,
          height: rect.height,
        },
        rounded: circular || hasRounding(el),
      });
      return;
    }

    const children = el.children;
    if (children.length === 0 && el.textContent?.trim()) {
      elements.push({
        type: "text",
        rect: {
          x: rect.left - rootRect.left,
          y: rect.top - rootRect.top,
          width: rect.width,
          height: rect.height,
        },
        rounded: hasRounding(el),
      });
      return;
    }

    for (let i = 0; i < children.length; i++) {
      walk(children[i], depth + 1);
    }
  }

  walk(root, 0);
  return elements;
}
