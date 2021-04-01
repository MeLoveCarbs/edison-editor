import { ContentBlock } from "draft-js";
import {
  AtomicComponent,
  AtomicNodeMapEntity,
  AtomicEntityMapNode,
} from "./atomic";
import { HeadNodeMapEntity } from "./head";
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
  } else if (nodeName === "head") {
    return HeadNodeMapEntity.head(node);
  } else if (nodeName === "style") {
    return HeadNodeMapEntity.style(node);
  }
}

export const entityMapNode = AtomicEntityMapNode;
