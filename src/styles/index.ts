import { DraftInlineStyle, DraftInlineStyleType } from "draft-js";
import { highLight } from "./custom-styles";

const CustomStyle = {
  HIGHLIGHT: "HIGHLIGHT",
} as const;

export const CustomStylePrefix = {
  COLOR: "COLOR_",
  HIGH_LIGHT_COLOR: "HIGH_COLOR_",
  FONT_SIZE: "FONT_SIZE_",
  FONT_FAMILY: "FONT_FAMILY_",
} as const;

export type InlineStyleType =
  | DraftInlineStyleType
  | typeof CustomStyle[keyof typeof CustomStyle]
  | `${typeof CustomStylePrefix[keyof typeof CustomStylePrefix]}${string}`;

export const styleMap = {
  [CustomStyle.HIGHLIGHT]: highLight,
} as const;

export const styleRender = (style: DraftInlineStyle) => {
  const styleNames = style.toJS();
  return styleNames.reduce((styles: React.CSSProperties, styleName: string) => {
    if (styleName.startsWith(CustomStylePrefix.COLOR)) {
      styles.color = styleName.split(CustomStylePrefix.COLOR)[1];
    }
    if (styleName.startsWith(CustomStylePrefix.HIGH_LIGHT_COLOR)) {
      styles.background = styleName.split(
        CustomStylePrefix.HIGH_LIGHT_COLOR
      )[1];
    }
    if (styleName.startsWith(CustomStylePrefix.FONT_SIZE)) {
      styles.fontSize = `${styleName.split(CustomStylePrefix.FONT_SIZE)[1]}px`;
    }
    if (styleName.startsWith(CustomStylePrefix.FONT_FAMILY)) {
      styles.fontFamily = `${
        styleName.split(CustomStylePrefix.FONT_FAMILY)[1]
      }`;
    }
    return styles;
  }, {});
};
