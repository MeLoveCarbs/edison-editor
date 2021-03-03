import { ContentBlock } from "draft-js";

export const BlockDataKeyMap = {
  textIndent: "textIndent",
};

function generateIndentClassName(block: ContentBlock) {
  const blockAlignment = block.getData().get(BlockDataKeyMap.textIndent);
  if (blockAlignment) {
    return `edison-indent-${blockAlignment}`;
  }
  return "";
}

export function blockStyleRender(block: ContentBlock) {
  const classNameList: string[] = [];

  classNameList.push(generateIndentClassName(block));

  return classNameList.join(` `);
}
