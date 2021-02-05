import { ContentBlock } from "draft-js";
import { AtomicComponent } from "./atomic";

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
