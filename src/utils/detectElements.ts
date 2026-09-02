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
  radius?: string;
}

// --- Tag classification sets ---

const TEXT_TAGS = new Set([
  "H1", "H2", "H3", "H4", "H5", "H6",
  "P", "BLOCKQUOTE", "PRE", "FIGCAPTION", "CAPTION", "SUMMARY", "DT", "DD",
  "SPAN", "A", "LABEL", "EM", "STRONG", "SMALL", "CITE", "TIME",
  "CODE", "MARK", "DEL", "INS", "SUB", "SUP", "ABBR", "DATA",
  "BDI", "BDO", "KBD", "SAMP", "VAR", "Q", "DFN", "S", "U", "B", "I",
  "LI", "TD", "TH",
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

const SKIP_ROLES = new Set(["presentation", "none"]);

const BLOCK_TEXT_TAGS = new Set([
  "H1", "H2", "H3", "H4", "H5", "H6",
  "P", "BLOCKQUOTE", "PRE", "LI", "DD", "DT", "FIGCAPTION", "LABEL",
]);

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

function readRadius(el: Element): string | undefined {
  const style = window.getComputedStyle(el);
  const radius = style.borderRadius;
  if (!radius || radius === "0px" || radius === "0") return undefined;
  return radius;
}

function hasRounding(el: Element): boolean {
  return Boolean(readRadius(el));
}

function classifyElement(el: Element): DetectedElementType {
  const tag = el.tagName;

  if (SKIP_TAGS.has(tag)) return "unknown";

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

  if (IMAGE_TAGS.has(tag)) return "image";
  if (BUTTON_TAGS.has(tag)) return "button";
  if (INPUT_TAGS.has(tag)) return "input";
  if (TEXT_TAGS.has(tag)) return "text";

  return "container";
}

function isForcedLeaf(el: Element): boolean {
  const attr = el.getAttribute("data-skeleton") ?? el.getAttribute("data-skelion");
  return attr === "leaf" || attr === "bone";
}

function isIgnored(el: Element): boolean {
  const attr = el.getAttribute("data-skeleton") ?? el.getAttribute("data-skelion");
  if (attr === "ignore" || attr === "skip") return true;
  return el.hasAttribute("data-skeleton-ignore") || el.hasAttribute("data-skelion-ignore");
}

function isLeafNode(el: Element): boolean {
  const tag = el.tagName;

  if (isForcedLeaf(el)) return true;
  if (IMAGE_TAGS.has(tag) || INPUT_TAGS.has(tag) || BUTTON_TAGS.has(tag)) return true;
  if (el.children.length === 0) return true;

  return false;
}

function isVisible(el: Element, rect: DOMRect): boolean {
  if (rect.width < 4 || rect.height < 4) return false;
  const style = window.getComputedStyle(el);
  if (style.display === "none") return false;
  if (style.opacity === "0") return false;
  return true;
}

function pushBone(
  elements: DetectedElement[],
  el: Element,
  type: DetectedElementType,
  rect: DOMRect,
  rootRect: DOMRect
) {
  const circular = type === "circle" || isCircular(el, rect);
  const radius = circular ? "50%" : readRadius(el);

  elements.push({
    type: circular ? "circle" : type,
    rect: {
      x: rect.left - rootRect.left,
      y: rect.top - rootRect.top,
      width: rect.width,
      height: rect.height,
    },
    rounded: circular || hasRounding(el) || BLOCK_TEXT_TAGS.has(el.tagName),
    radius,
  });
}

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
    if (isIgnored(el)) return;

    const role = el.getAttribute("role");
    if (role && SKIP_ROLES.has(role)) return;

    const style = window.getComputedStyle(el);
    if (style.display === "none") return;

    const rect = el.getBoundingClientRect();
    if (!isVisible(el, rect)) {
      if (el.children.length > 0 && depth < maxDepth) {
        for (let i = 0; i < el.children.length; i++) {
          walk(el.children[i], depth + 1);
        }
      }
      return;
    }

    if (isLeafNode(el) || depth === maxDepth) {
      const type = classifyElement(el);
      if (type === "unknown") return;
      pushBone(elements, el, type, rect, rootRect);
      return;
    }

    const children = el.children;
    if (children.length === 0 && el.textContent?.trim()) {
      pushBone(elements, el, "text", rect, rootRect);
      return;
    }

    for (let i = 0; i < children.length; i++) {
      walk(children[i], depth + 1);
    }
  }

  walk(root, 0);
  return elements;
}
