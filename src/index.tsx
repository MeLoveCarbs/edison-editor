import React from "react";
import { Editor, EditorProps, DraftInlineStyleType } from "draft-js";
import { styleMap } from "./styles";
import {
  onAddBlock,
  BlockProps,
  BlockType as CustomBlockType,
  BlockRenderer,
} from "./block";

type BlockType =
  | "unstyled"
  | "paragraph"
  | "header-one"
  | "header-two"
  | "header-three"
  | "header-four"
  | "header-five"
  | "header-six"
  | "unordered-list-item"
  | "ordered-list-item"
  | "blockquote"
  | "code-block"
  | "atomic";
type StyleType = DraftInlineStyleType | keyof typeof styleMap;

type WithoutProps =
  | "blockRendererFn"
  | "blockRenderMap"
  | "customStyleMap"
  | "customStyleFn";
type Props = Omit<EditorProps, WithoutProps>;

// RichUtils.toggleBlockType;
const EdisonEditor = React.forwardRef<Editor, Props>((props: Props, ref) => {
  return (
    <Editor
      ref={ref}
      {...props}
      customStyleMap={styleMap}
      blockRendererFn={BlockRenderer}
    />
  );
});

export default EdisonEditor;

export { onAddBlock };
export type { BlockProps, BlockType, CustomBlockType, StyleType };
