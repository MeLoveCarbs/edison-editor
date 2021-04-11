import React from "react";
import { Editor, EditorProps, DraftInlineStyleType } from "draft-js";
import { CustomStylePrefix } from "./constants";
import inlineStyleRender from "./render/inline-style-render";
import blockStyleRender from "./render/block-style-render";
import blockRender from "./render/block-render";
import "./assets/edison.css";

export type InlineStyleType =
  | DraftInlineStyleType
  | `${typeof CustomStylePrefix[keyof typeof CustomStylePrefix]}${string}`;

export type {
  AtomicEntityTypes,
  AtomicEntityProps,
  LinkProps,
} from "./constants";

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
      customStyleFn={inlineStyleRender}
      blockStyleFn={blockStyleRender}
      blockRendererFn={blockRender}
    />
  );
});

export default EdisonEditor;
