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
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const startKey = selectionState.getStartKey();
  const startBlock = contentState.getBlockForKey(startKey);
  const startIndent = startBlock.getData().get(BlockDataKeyMap.textIndent) || 0;
  const newData = Math.min(Math.max(startIndent + adjustment, 0), maxDepth);
  const newContent = Modifier.setBlockData(
    contentState,
    selectionState,
    convertObjectToImmutableMap({
      [BlockDataKeyMap.textIndent]: newData,
    })
  );
  const allblock = getSelectedBlocks(editorState);
  allblock.forEach((b) => console.log(b.getType()));
  return EditorState.createWithContent(newContent);
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
