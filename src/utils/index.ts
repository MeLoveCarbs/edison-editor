import {
  EditorState,
  ContentBlock,
  RichUtils,
  AtomicBlockUtils,
} from "draft-js";
import { BlockType, BlockProps } from "../block";

function getSelectedBlocks(editorState: EditorState) {
  const selectionState = editorState.getSelection();
  const startKey = selectionState.getStartKey();
  const endKey = selectionState.getEndKey();
  const contentState = editorState.getCurrentContent();

  const startingBlock = contentState.getBlockForKey(startKey);
  if (startKey === endKey) {
    return [startingBlock];
  }
  const selectedBlocks: ContentBlock[] = [startingBlock];
  let blockKey = startKey;
  while (blockKey !== endKey) {
    const nextBlock = contentState.getBlockAfter(blockKey);
    selectedBlocks.push(nextBlock);
    blockKey = nextBlock.getKey();
  }
  return selectedBlocks;
}
function onAddAtomicBlock<T extends BlockType>(
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

function clearAllInlineStyle(editorState: EditorState) {
  const nowStyles = editorState.getCurrentInlineStyle().toArray();
  let newState: EditorState = editorState;
  nowStyles.forEach((style) => {
    newState = RichUtils.toggleInlineStyle(newState, style);
  });
  return newState;
}

function indentIncrease(editorState: EditorState) {
  return editorState;
}

function indentDecrease(editorState: EditorState) {
  return editorState;
}

export const EdisonUtil = {
  getSelectedBlocks,
  onAddAtomicBlock,
  clearAllInlineStyle,
  indentIncrease,
  indentDecrease,
};
