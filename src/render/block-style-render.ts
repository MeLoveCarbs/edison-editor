import { ContentBlock } from "draft-js";
import { BlockDataKeyMap, BlockClassNamePrefix } from "../constants";

function generateIndentClassName(block: ContentBlock) {
  const blockAlignment = block.getData().get(BlockDataKeyMap.textIndent);
  if (blockAlignment) {
    return `${BlockClassNamePrefix.Indent}${blockAlignment}`;
  }
  return "";
}
const classNameHandleFuncs = [generateIndentClassName];

export default function blockStyleRender(block: ContentBlock) {
  const classNameList = classNameHandleFuncs.map((func) => func(block));
  return classNameList.join(` `);
}
