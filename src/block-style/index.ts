import { ContentBlock } from "draft-js";

export const BlockDataKeyMap = {
  textIndent: "textIndent",
};

const ClassPrefix = {
  Indent: "edison-indent-",
} as const;

function generateIndentClassName(block: ContentBlock) {
  const blockAlignment = block.getData().get(BlockDataKeyMap.textIndent);
  if (blockAlignment) {
    return `${ClassPrefix.Indent}${blockAlignment}`;
  }
  return "";
}

export function blockStyleRender(block: ContentBlock) {
  const classNameList: string[] = [];

  classNameList.push(generateIndentClassName(block));

  return classNameList.join(` `);
}

export function classMapStyle(classNames: string) {
  const classList = classNames.split(` `);
  return classList.reduce((styles: React.CSSProperties, className: string) => {
    if (className.startsWith(ClassPrefix.Indent)) {
      styles.marginLeft =
        parseInt(className.split(ClassPrefix.Indent)[1]) * 2 + "em";
    }
    return styles;
  }, {});
}
