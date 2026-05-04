import type { DetectedElementType } from "../types";

export type { DetectedElementType };

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

// --- Tag classification sets ---

const TEXT_TAGS = new Set([
  // Headings
  "H1", "H2", "H3", "H4", "H5", "H6",
  // Block text
  "P", "BLOCKQUOTE", "PRE", "FIGCAPTION", "CAPTION", "SUMMARY", "DT", "DD",
  // Inline text
  "SPAN", "A", "LABEL", "EM", "STRONG", "SMALL", "CITE", "TIME",
  "CODE", "MARK", "DEL", "INS", "SUB", "SUP", "ABBR", "DATA",
  "BDI", "BDO", "KBD", "SAMP", "VAR", "Q", "DFN", "S", "U", "B", "I",
  // Table cells / list items (leaf-level text containers)
  "LI", "TD", "TH",
  // Output
  "OUTPUT",
]);

const IMAGE_TAGS = new Set([
  "IMG", "SVG", "PICTURE", "VIDEO", "CANVAS",
  "AUDIO", "IFRAME", "EMBED", "OBJECT", "MAP",
]);

const BUTTON_TAGS = new Set(["BUTTON"]);

const INPUT_TAGS = new Set([
  "INPUT", "TEXTAREA", "SELECT", "PROGRESS", "METER",
]);

const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "SLOT",
  "BR", "HR", "WBR", "COL", "COLGROUP",
]);

// ARIA roles that should be skipped (decorative / presentational)
const SKIP_ROLES = new Set(["presentation", "none"]);

// --- Helpers ---

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

  // Check ARIA role first — role overrides tag semantics
  const role = el.getAttribute("role");
  if (role) {
    if (SKIP_ROLES.has(role)) return "unknown";
    if (role === "img" || role === "figure") return "image";
    if (role === "button" || role === "menuitem" || role === "tab") return "button";
    if (role === "textbox" || role === "searchbox" || role === "spinbutton") return "input";
    if (role === "checkbox" || role === "radio" || role === "switch" || role === "slider") return "input";
    if (role === "link") return "text";
    if (role === "heading") return "text";
    if (role === "separator") return "unknown";
  }

  // Tag-based classification
  if (IMAGE_TAGS.has(tag)) return "image";
  if (BUTTON_TAGS.has(tag)) return "button";
  if (INPUT_TAGS.has(tag)) return "input";
  if (TEXT_TAGS.has(tag)) return "text";

  // Structural / container — these get walked into, not classified as leaf
  return "container";
}

function isLeafNode(el: Element): boolean {
  const tag = el.tagName;

  // Media and input elements are always leaves (self-closing or atomic content)
  if (IMAGE_TAGS.has(tag) || INPUT_TAGS.has(tag) || BUTTON_TAGS.has(tag)) return true;

  // No element children → leaf
  if (el.children.length === 0) return true;

  return false;
}

function isVisible(el: Element, rect: DOMRect): boolean {
  if (rect.width < 4 || rect.height < 4) return false;
  const style = window.getComputedStyle(el);
  // Only skip display:none (removes element from layout flow).
  // visibility:hidden keeps layout intact — needed because the measurement
  // container uses visibility:hidden to hide children during measurement.
  if (style.display === "none") return false;
  if (style.opacity === "0") return false;
  return true;
}

// --- Public API ---

import type { Density } from "../types";

export type { Density };

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

    // Skip elements with presentational ARIA roles
    const role = el.getAttribute("role");
    if (role && SKIP_ROLES.has(role)) return;

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
