import React from "react";
import { Editor, EditorProps } from "draft-js";
import { inlineStyleMap, inlineStyleRender } from "./inline-style";
import { blockStyleRender } from "./block-style";
import { blockRender } from "./block-render";
import "./assets/edison.css";

export type { InlineStyleType } from "./inline-style";
export type {
  BlockType as AtomicBlockType,
  BlockProps as AtomicBlockProps,
} from "./block-render";

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
      customStyleMap={inlineStyleMap}
      customStyleFn={inlineStyleRender}
      blockStyleFn={blockStyleRender}
      blockRendererFn={blockRender}
    />
  );
});

export default EdisonEditor;
