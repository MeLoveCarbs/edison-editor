import React from "react";
import {
  AtomicBlockUtils,
  EditorState,
  ContentState,
  ContentBlock,
} from "draft-js";
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

export function onAddBlock<T extends BlockType>(
  entityType: T,
  params: BlockProps<T>,
  editorState: EditorState
) {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    entityType,
    "IMMUTABLE",
    params
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = EditorState.set(editorState, {
    currentContent: contentStateWithEntity,
  });
  return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
}

export function BlockRenderer(contentBlock: ContentBlock) {
  const type = contentBlock.getType();
  if (type === "atomic") {
    return {
      component: MediaComponent,
      editable: false,
    };
  }
}

function MediaComponent(props: {
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
}
