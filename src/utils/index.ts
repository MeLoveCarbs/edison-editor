import {
  EditorState,
  ContentState,
  ContentBlock,
  AtomicBlockUtils,
  Modifier,
} from "draft-js";
import htmlToDraft from "html-to-draftjs";
import { BlockType, BlockProps, nodeMapEntity } from "../block-render";
import { BlockDataKeyMap } from "../block-style";

const MaxIndentDeep = 6;

function convertObjectToImmutableMap(raw: { [key: string]: any }) {
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

function htmlToState(htmlStr: string) {
  if (!htmlStr) {
    return EditorState.createEmpty();
  }
  const blocksFromHtml = htmlToDraft(htmlStr, nodeMapEntity);
  const { contentBlocks, entityMap } = blocksFromHtml;
  const contentState = ContentState.createFromBlockArray(
    contentBlocks,
    entityMap
  );
  return EditorState.createWithContent(contentState);
}

export const EdisonUtil = {
  htmlToState,
  getSelectedBlocks,
  onAddAtomicBlock,
  clearAllInlineStyle,
  indentIncrease,
  indentDecrease,
};
