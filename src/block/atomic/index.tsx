import React from "react";
import { ContentState, ContentBlock } from "draft-js";
import {
  EntityType as ImageEntityType,
  Props as ImageProps,
  RendererFn as ImageRendererFn,
} from "./image";

const BlockRendererMap = {
  [ImageEntityType]: ImageRendererFn,
};

export type BlockType = keyof typeof BlockRendererMap;
export type BlockProps<T extends BlockType> = {
  [ImageEntityType]: ImageProps;
}[T];

export function AtomicComponent(props: {
  block: ContentBlock;
  contentState: ContentState;
}) {
  const { block, contentState } = props;
  const entity = contentState.getEntity(block.getEntityAt(0));
  const type = entity.getType();
  if (BlockRendererMap[type as BlockType]) {
    const renderProps = entity.getData();
    const Renderer = BlockRendererMap[type as BlockType];
    return <Renderer {...renderProps} />;
  }
  return null;
}
