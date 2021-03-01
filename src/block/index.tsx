import { ContentBlock } from "draft-js";
import { AtomicComponent, AtomicNodeMapEntity } from "./atomic";

export type { BlockType, BlockProps } from "./atomic";

export function blockRender(contentBlock: ContentBlock) {
  const type = contentBlock.getType();
  if (type === "atomic") {
    return {
      component: AtomicComponent,
      editable: false,
    };
  }
}

export function nodeMapEntity(nodeName: string, node: HTMLElement) {
  if (nodeName === "blockquote") {
    return AtomicNodeMapEntity.blockquote(node);
  } else if (nodeName === "img") {
    return AtomicNodeMapEntity.img(node);
  }
}
