import {
  EditorState,
  ContentState,
  ContentBlock,
  CompositeDecorator,
} from "draft-js";
import htmlToState from "./html-to-draftjs";
import { EntityTypeMap, AtomicEntityProps } from "../../constants";
import { RendererFn as Link } from "../../block/normal/link";

function findLinkEntities(
  block: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) {
  block.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() ===
        EntityTypeMap.LinkEntityType
    );
  }, callback);
}

const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

function customChunkRenderer(nodeName: string, node: HTMLElement) {
  if (nodeName === "table") {
    const data: AtomicEntityProps<typeof EntityTypeMap.TableEntityType> = {
      html: node.innerHTML,
      className: node.getAttribute("class"),
      style: node.getAttribute("style"),
    };
    return {
      type: EntityTypeMap.TableEntityType,
      mutability: "IMMUTABLE",
      data,
    } as const;
  }
  if (nodeName === "blockquote") {
    const data: AtomicEntityProps<typeof EntityTypeMap.BlockQuoteEntityType> = {
      html: node.innerHTML,
      className: node.getAttribute("class"),
      style: node.getAttribute("style"),
    };
    return {
      type: EntityTypeMap.BlockQuoteEntityType,
      mutability: "IMMUTABLE",
      data,
    } as const;
  }
  if (nodeName === "img") {
    const data: AtomicEntityProps<typeof EntityTypeMap.ImageEntityType> = {
      src: node.getAttribute("src"),
      alt: node.getAttribute("alt"),
      height: node.getAttribute("height"),
      width: node.getAttribute("width"),
    };
    return {
      type: EntityTypeMap.ImageEntityType,
      mutability: "IMMUTABLE",
      data,
    } as const;
  }
}

export function stateFromHTML(htmlStr: string) {
  if (!htmlStr) {
    return EditorState.createEmpty(decorator);
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
    return EditorState.createWithContent(contentState, decorator);
  } catch (err) {
    return EditorState.createEmpty(decorator);
  }
}
