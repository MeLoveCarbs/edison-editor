import { EditorState, ContentState } from "draft-js";
import htmlToState from "html-to-draftjs";
import { EntityTypeMap } from "../constants";

function customChunkRenderer(nodeName: string, node: HTMLElement) {
  if (nodeName === "table") {
    return {
      type: EntityTypeMap.TableEntityType,
      mutability: "IMMUTABLE",
      data: {
        html: node.innerHTML,
      },
    } as const;
  }
  if (nodeName === "blockquote") {
    return {
      type: EntityTypeMap.BlockQuoteEntityType,
      mutability: "IMMUTABLE",
      data: {
        html: node.innerHTML,
      },
    } as const;
  }
  if (nodeName === "a") {
    return {
      type: EntityTypeMap.LinkEntityType,
      mutability: "MUTABLE",
      data: { url: node.getAttribute("href"), text: node.innerText },
    } as const;
  }
}

export function stateFromHTML(htmlStr: string) {
  if (!htmlStr) {
    return EditorState.createEmpty();
  }
  try {
    const { contentBlocks, entityMap } = htmlToState(
      htmlStr,
      customChunkRenderer
    );
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );
    return EditorState.createWithContent(contentState);
  } catch (err) {
    return EditorState.createEmpty();
  }
}
