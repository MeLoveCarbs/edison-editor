import React from "react";
import { Editor, EditorProps } from "draft-js";
import { styleMap, styleRender } from "./styles";
import { blockRender } from "./block";

export type { InlineStyleType } from "./styles";
export { CustomStylePrefix } from "./styles";
export type {
  BlockType as AtomicBlockType,
  BlockProps as AtomicBlockProps,
} from "./block";

export * from "./utils";

type WithoutProps =
  | "blockRendererFn"
  | "blockRenderMap"
  | "customStyleMap"
  | "customStyleFn";
type Props = Omit<EditorProps, WithoutProps>;

const EdisonEditor = React.forwardRef<Editor, Props>((props: Props, ref) => {
  return (
    <Editor
      ref={ref}
      {...props}
      customStyleMap={styleMap}
      customStyleFn={styleRender}
      blockRendererFn={blockRender}
    />
  );
});

export default EdisonEditor;
