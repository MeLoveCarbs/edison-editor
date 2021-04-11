import { ContentBlock } from "draft-js";
import { BlockMap } from "../constants";
import { AtomicComponent } from "../block/atomic";

export default function blockRender(contentBlock: ContentBlock) {
  const type = contentBlock.getType();
  if (type === BlockMap.Atomic) {
    return {
      component: AtomicComponent,
      editable: false,
    };
  }
}
