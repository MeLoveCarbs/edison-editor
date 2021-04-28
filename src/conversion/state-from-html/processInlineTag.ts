import { OrderedSet } from "immutable";

const inlineTags = {
  code: "CODE",
  s: "STRIKETHROUGH",
  strike: "STRIKETHROUGH",
  del: "STRIKETHROUGH",
  i: "ITALIC",
  em: "ITALIC",
  b: "BOLD",
  strong: "BOLD",
  u: "UNDERLINE",
  ins: "UNDERLINE",
  sub: "SUBSCRIPT",
  sup: "SUPERSCRIPT",
} as const;

export default function processInlineTag(
  tag: string,
  node: Element,
  currentStyle: OrderedSet<string>
) {
  const styleToCheck = inlineTags[tag as keyof typeof inlineTags];
  if (styleToCheck) {
    return currentStyle.add(styleToCheck).toOrderedSet();
  }
  if (node instanceof HTMLElement) {
    const htmlElement = node;
    return currentStyle
      .withMutations((style) => {
        const color = htmlElement.style.color;
        const backgroundColor = htmlElement.style.backgroundColor;
        const fontSize = htmlElement.style.fontSize;
        const fontFamily = htmlElement.style.fontFamily.replace(/^"|"$/g, "");
        const fontWeight = htmlElement.style.fontWeight;
        const textDecoration = htmlElement.style.textDecoration;
        const fontStyle = htmlElement.style.fontStyle;
        if (color) {
          style.add(`color-${color.replace(/ /g, "")}`);
        }
        if (backgroundColor) {
          style.add(`bgcolor-${backgroundColor.replace(/ /g, "")}`);
        }
        if (fontSize) {
          style.add(`fontsize-${fontSize.replace(/px$/g, "")}`);
        }
        if (fontFamily) {
          style.add(`fontfamily-${fontFamily}`);
        }
        if (fontWeight === "bold") {
          style.add(inlineTags.strong);
        }
        if (textDecoration === "underline") {
          style.add(inlineTags.ins);
        }
        if (fontStyle === "italic") {
          style.add(inlineTags.em);
        }
      })
      .toOrderedSet();
  }
  return currentStyle;
}
