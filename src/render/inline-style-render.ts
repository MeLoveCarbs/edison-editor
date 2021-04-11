import { DraftInlineStyle } from "draft-js";
import { CustomStylePrefix } from "../constants";

export default function inlineStyleRender(style: DraftInlineStyle) {
  const styleNames = style.toJS();
  return styleNames.reduce((styles: React.CSSProperties, styleName: string) => {
    if (styleName.startsWith(CustomStylePrefix.COLOR)) {
      styles.color = styleName.split(CustomStylePrefix.COLOR)[1];
      return styles;
    }
    if (styleName.startsWith(CustomStylePrefix.HIGH_LIGHT_COLOR)) {
      styles.background = styleName.split(
        CustomStylePrefix.HIGH_LIGHT_COLOR
      )[1];
      return styles;
    }
    if (styleName.startsWith(CustomStylePrefix.FONT_SIZE)) {
      styles.fontSize = `${styleName.split(CustomStylePrefix.FONT_SIZE)[1]}px`;
      return styles;
    }
    if (styleName.startsWith(CustomStylePrefix.FONT_FAMILY)) {
      styles.fontFamily = `${
        styleName.split(CustomStylePrefix.FONT_FAMILY)[1]
      }`;
      return styles;
    }
    return styles;
  }, {});
}
