import { Map } from "immutable";

export default function getBlockData(node: HTMLElement) {
  if (node.style.textAlign) {
    return Map({
      "text-align": node.style.textAlign,
    });
  } else if (node.style.marginLeft) {
    return Map({
      "margin-left": node.style.marginLeft,
    });
  }
  return undefined;
}
