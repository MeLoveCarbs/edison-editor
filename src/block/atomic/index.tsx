import React from "react";
import { ContentState, ContentBlock } from "draft-js";
import { EntityTypeMap } from "../../constants";
import { RendererFn as ImageRendererFn } from "./image";
import { RendererFn as TableRendererFn } from "./table";
import { RendererFn as BlockQuoteRendererFn } from "./blockquote";

export function AtomicComponent(props: {
  block: ContentBlock;
  contentState: ContentState;
}) {
  try {
    const { block, contentState } = props;
    const entity = contentState.getEntity(block.getEntityAt(0));
    const type = entity.getType();
    const renderProps = entity.getData();
    if (type === EntityTypeMap.ImageEntityType) {
      return <ImageRendererFn {...renderProps} />;
    }
    if (type === EntityTypeMap.TableEntityType) {
      return <TableRendererFn {...renderProps} />;
    }
    if (type === EntityTypeMap.BlockQuoteEntityType) {
      return <BlockQuoteRendererFn {...renderProps} />;
    }
  } catch (err) {}
  return null;
}
