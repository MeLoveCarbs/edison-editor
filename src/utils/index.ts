import {
  EditorState,
  ContentState,
  ContentBlock,
  AtomicBlockUtils,
  Modifier,
  RichUtils,
} from "draft-js";
import {
  BlockDataKeyMap,
  EntityTypeMap,
  AtomicEntityTypes,
  AtomicEntityProps,
  LinkProps,
  CustomStylePrefix,
  KeepStylePrefix,
} from "../constants";
import { OrderedSet } from "immutable";
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

function onAddAtomicBlock<T extends AtomicEntityTypes>(
  entityType: T,
  params: AtomicEntityProps<T>,
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

function onToggleLink(url: string, editorState: EditorState) {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    EntityTypeMap.LinkEntityType,
    "MUTABLE",
    { url }
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = EditorState.set(editorState, {
    currentContent: contentStateWithEntity,
  });
  return RichUtils.toggleLink(
    newEditorState,
    newEditorState.getSelection(),
    entityKey
  );
}

function onAddLink(params: LinkProps, editorState: EditorState) {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const startKey = selection.getStartKey();
  const startOffset = selection.getStartOffset();
  const newSelectionState = selection.merge({
    anchorKey: startKey,
    anchorOffset: startOffset + params.text.length,
    focusKey: startKey,
    focusOffset: startOffset + params.text.length,
  });
  const contentStateWithEntity = contentState.createEntity(
    EntityTypeMap.LinkEntityType,
    "MUTABLE",
    params
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newContent = Modifier.insertText(
    contentStateWithEntity,
    selection,
    params.text,
    OrderedSet(),
    entityKey
  );
  return EditorState.set(editorState, {
    currentContent: newContent,
    selection: newSelectionState,
  });
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

function toggleInlineStyle(editorState: EditorState, inlineStyle: string) {
  if (inlineStyle.includes(CustomStylePrefix.HIGH_LIGHT_COLOR)) {
    return RichUtils.toggleInlineStyle(editorState, inlineStyle);
  }
  const stypeType = KeepStylePrefix.find((item) =>
    inlineStyle.startsWith(item)
  );
  if (stypeType === undefined) {
    return editorState;
  }
  const allInline = editorState.getCurrentInlineStyle().toArray();
  const shouldClearInline = allInline.filter((item) =>
    item.startsWith(stypeType)
  );
  let contentState = editorState.getCurrentContent();
  shouldClearInline.forEach((style) => {
    contentState = Modifier.removeInlineStyle(
      contentState,
      editorState.getSelection(),
      style
    );
  });
  contentState = Modifier.applyInlineStyle(
    contentState,
    editorState.getSelection(),
    inlineStyle
  );
  return EditorState.push(editorState, contentState, "change-inline-style");
}

function changeBlocksDepth(
  editorState: EditorState,
  adjustment: number,
  maxDepth: number
) {
  const changeBlocksDepthMap = (block: ContentBlock) => {
    const oldData = block.getData();
    const oldIndent = oldData.get(BlockDataKeyMap.textIndent) || 0;
    const newIndent = Math.min(Math.max(oldIndent + adjustment, 0), maxDepth);
    const newData = oldData.merge({
      [BlockDataKeyMap.textIndent]: newIndent,
    });
    return block.merge({ data: newData }) as ContentBlock;
  };
  const newState = modifyBlockForContentState(
    editorState,
    changeBlocksDepthMap,
    true
  );
  return EditorState.push(
    editorState,
    newState.getCurrentContent(),
    "change-block-data"
  );
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
  onToggleLink,
  onAddLink,
  onAddAtomicBlock,
  clearAllInlineStyle,
  toggleInlineStyle,
  indentIncrease,
  indentDecrease,
  isInIndentBlockBeginning,
};
