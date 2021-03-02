import React from "react";
import { ContentState, ContentBlock, RawDraftEntity } from "draft-js";
import {
  EntityType as ImageEntityType,
  Props as ImageProps,
  RendererFn as ImageRendererFn,
} from "./image";
import {
  EntityType as BlockQuoteEntityType,
  Props as BlockQuoteProps,
  RendererFn as BlockQuoteRendererFn,
} from "./blockquote";

const BlockRendererMap = {
  [ImageEntityType]: ImageRendererFn,
  [BlockQuoteEntityType]: BlockQuoteRendererFn,
};

export type BlockType = keyof typeof BlockRendererMap;
export type BlockProps<T extends BlockType> = {
  [ImageEntityType]: ImageProps;
  [BlockQuoteEntityType]: BlockQuoteProps;
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

export const AtomicNodeMapEntity = {
  img: (node: HTMLElement) => {
    const src = node.getAttribute("src");
    return {
      type: ImageEntityType,
      mutability: "IMMUTABLE",
      data: {
        src,
      },
    } as RawDraftEntity;
  },
  blockquote: (node: HTMLElement) => {
    return {
      type: BlockQuoteEntityType,
      mutability: "IMMUTABLE",
      data: {
        html: node.innerHTML,
      },
    } as RawDraftEntity;
  },
};
