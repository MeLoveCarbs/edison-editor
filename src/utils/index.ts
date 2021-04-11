import {
  EditorState,
  ContentState,
  ContentBlock,
  AtomicBlockUtils,
  Modifier,
} from "draft-js";
import { BlockDataKeyMap, EntityTypes, EntityProps } from "../constants";
import { stateFromHTML } from "../conversion/state-from-html";
import { stateToHTML } from "../conversion/state-to-html";

const MaxIndentDeep = 6;

export function convertObjectToImmutableMap(raw: { [key: string]: any }) {
  const tempContentBlock = new ContentBlock();
  const blankImmutableMap = tempContentBlock.getData();
  const updatedImmutableMap = blankImmutableMap.merge(raw);
  return updatedImmutableMap;
}

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

function modifyBlockForContentState(
  editorState: EditorState,
  blockMapFunc: (block: ContentBlock) => ContentBlock,
  selected = false
) {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const startKey = selectionState.getStartKey();
  const endKey = selectionState.getEndKey();
  const blockMap = contentState.getBlockMap();
  const newBlocks = blockMap
    .toSeq()
    .skipUntil((_, k) => k === startKey)
    .takeUntil((_, k) => k === endKey)
    .concat([[endKey, blockMap.get(endKey)]])
    .map(blockMapFunc);

  const newContent = contentState.merge({
    blockMap: blockMap.merge(newBlocks),
    selectionBefore: selectionState,
    selectionAfter: selectionState,
  }) as ContentState;

  const newState = EditorState.createWithContent(newContent);
  if (!selected) {
    return newState;
  }
  const newStateWithSelect = EditorState.forceSelection(
    newState,
    selectionState
  );
  return newStateWithSelect;
}

function onAddAtomicBlock<T extends EntityTypes>(
  entityType: T,
  params: EntityProps<T>,
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
  const inlineStyle: string[] = [];
  const selectedBlocks = getSelectedBlocks(editorState);
  selectedBlocks.forEach((block) => {
    block.getCharacterList().forEach((character) => {
      const styleStr = character.getStyle().toArray();
      styleStr.forEach((style) => {
        if (!inlineStyle.includes(style)) {
          inlineStyle.push(style);
        }
      });
    });
  });
  let contentState = editorState.getCurrentContent();
  inlineStyle.forEach((style) => {
    contentState = Modifier.removeInlineStyle(
      contentState,
      editorState.getSelection(),
      style
    );
  });
  return EditorState.push(editorState, contentState, "change-inline-style");
}

function changeBlocksDepth(
  editorState: EditorState,
  adjustment: number,
  maxDepth: number
) {
  const changeBlocksDepthMap = (block: ContentBlock) => {
    const oldIndent = block.getData().get(BlockDataKeyMap.textIndent) || 0;
    const newIndent = Math.min(Math.max(oldIndent + adjustment, 0), maxDepth);
    const newData = { [BlockDataKeyMap.textIndent]: newIndent };
    return block.merge({ data: newData }) as ContentBlock;
  };
  return modifyBlockForContentState(editorState, changeBlocksDepthMap, true);
}

function indentIncrease(editorState: EditorState) {
  return changeBlocksDepth(editorState, 1, MaxIndentDeep);
}

function indentDecrease(editorState: EditorState) {
  return changeBlocksDepth(editorState, -1, MaxIndentDeep);
}

function isInIndentBlockBeginning(editorState: EditorState) {
  const selection = editorState.getSelection();
  const offset = selection.getAnchorOffset();
  if (!selection.isCollapsed() || offset != 0) {
    return false;
  }
  const key = selection.getAnchorKey();
  const content = editorState.getCurrentContent();
  const block = content.getBlockForKey(key);
  const oldIndent = block.getData().get(BlockDataKeyMap.textIndent) || 0;
  if (oldIndent > 0) {
    return true;
  }
  return false;
}

export const EdisonUtil = {
  stateFromHTML,
  stateToHTML,
  getSelectedBlocks,
  onAddAtomicBlock,
  clearAllInlineStyle,
  indentIncrease,
  indentDecrease,
  isInIndentBlockBeginning,
};
