import React from "react";
import { ContentState, ContentBlock } from "draft-js";
import { EntityTypeMap, EntityTypes } from "../../constants";
import { RendererFn as ImageRendererFn } from "./image";
import { RendererFn as TableRendererFn } from "./table";
import { RendererFn as BlockQuoteRendererFn } from "./blockquote";
import { RendererFn as LinkRendererFn } from "./link";

const EntityRendererMap = {
  [EntityTypeMap.ImageEntityType]: ImageRendererFn,
  [EntityTypeMap.TableEntityType]: TableRendererFn,
  [EntityTypeMap.BlockQuoteEntityType]: BlockQuoteRendererFn,
  [EntityTypeMap.LinkEntityType]: LinkRendererFn,
};

export function AtomicComponent(props: {
  block: ContentBlock;
  contentState: ContentState;
}) {
  try {
    const { block, contentState } = props;
    const entity = contentState.getEntity(block.getEntityAt(0));
    const type = entity.getType();
    if (EntityRendererMap[type as EntityTypes]) {
      const renderProps = entity.getData();
      const Renderer = EntityRendererMap[type as EntityTypes];
      return <Renderer {...renderProps} />;
    }
  } catch (err) {}
  return null;
}
