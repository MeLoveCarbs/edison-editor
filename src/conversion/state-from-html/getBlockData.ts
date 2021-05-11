import { Map } from "immutable";
import { BlockDataKeyMap } from "../../constants";

export default function getBlockData(node: HTMLElement) {
  const data: [string, string | number][] = [];
  const className = node.className;
  if (className) {
    data.push([BlockDataKeyMap.className, className]);
  }
  const nodeTextAlign = node.style.textAlign;
  const nodeIndent = node.style.marginLeft;
  if (nodeTextAlign) {
    data.push([BlockDataKeyMap.textAlign, nodeTextAlign]);
  } else if (nodeIndent && nodeIndent.endsWith("em")) {
    const indent = Number(nodeIndent.replace("em", ""));
    if (indent) {
      data.push([BlockDataKeyMap.textIndent, indent / 2]);
    }
  }
  if (data.length) {
    return Map<string, string | number>(data);
  }
  return undefined;
}
