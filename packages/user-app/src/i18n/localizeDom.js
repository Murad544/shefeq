import { translate } from "./translations";

const attributes = ["aria-label", "alt", "placeholder", "title"];
const sourceText = new WeakMap();
const appliedText = new WeakMap();
const sourceAttributes = new WeakMap();
const appliedAttributes = new WeakMap();

const localizeText = (node, language) => {
  if (node.parentElement?.closest("script, style, textarea, [contenteditable], [translate='no']")) return;
  const current = node.nodeValue;
  if (!current?.trim()) return;

  if (!sourceText.has(node) || (current !== appliedText.get(node) && current !== sourceText.get(node))) {
    sourceText.set(node, current);
  }

  const source = sourceText.get(node);
  const leading = source.match(/^\s*/)[0];
  const trailing = source.match(/\s*$/)[0];
  const text = source.trim().replace(/\s+/g, " ");
  const replacement = `${leading}${translate(text, language)}${trailing}`;
  appliedText.set(node, replacement);
  if (current !== replacement) node.nodeValue = replacement;
};

const localizeElement = (element, language) => {
  if (element.closest("[translate='no']")) return;
  let sources = sourceAttributes.get(element);
  let applied = appliedAttributes.get(element);
  if (!sources) {
    sources = {};
    applied = {};
    sourceAttributes.set(element, sources);
    appliedAttributes.set(element, applied);
  }

  attributes.forEach((name) => {
    const current = element.getAttribute(name);
    if (current == null) return;
    if (!(name in sources) || (current !== applied[name] && current !== sources[name])) {
      sources[name] = current;
    }
    const replacement = translate(sources[name], language);
    applied[name] = replacement;
    if (current !== replacement) element.setAttribute(name, replacement);
  });
};

export const localizeTree = (root, language) => {
  if (!root) return;
  localizeElement(root, language);
  root.querySelectorAll("*").forEach((element) => localizeElement(element, language));
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) localizeText(walker.currentNode, language);
};
