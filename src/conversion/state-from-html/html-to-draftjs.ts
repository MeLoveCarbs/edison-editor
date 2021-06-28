import {
  CharacterMetadata,
  ContentBlock,
  genKey,
  Entity,
  DraftEntityMutability,
} from "draft-js";
import { Map, List, OrderedMap, OrderedSet } from "immutable";
import getSafeBodyFromHTML from "./getSafeBodyFromHTML";
import {
  createTextChunk,
  getSoftNewlineChunk,
  getEmptyChunk,
  getBlockDividerChunk,
  getFirstBlockChunk,
  getAtomicBlockChunk,
  joinChunks,
} from "./chunkBuilder";
import getBlockTypeForTag from "./getBlockTypeForTag";
import processInlineTag from "./processInlineTag";
import getBlockData from "./getBlockData";
import getEntityId from "./getEntityId";

const SPACE = " ";
const REGEX_NBSP = new RegExp("&nbsp;", "g");

let firstBlock = true;

type CustomChunkGenerator = (
  nodeName: string,
  node: HTMLElement
) => {
  type: string;
  mutability: DraftEntityMutability;
  data: Record<string, unknown>;
};

function genFragment(
  node: HTMLElement,
  inlineStyle: OrderedSet<string>,
  depth: number,
  lastList: string,
  inEntity?: string,
  customChunkGenerator?: CustomChunkGenerator
) {
  const nodeName = node.nodeName.toLowerCase();

  if (customChunkGenerator) {
    const value = customChunkGenerator(nodeName, node);
    if (value) {
      const entityId = Entity.create(
        value.type,
        value.mutability,
        value.data || {}
      );
      return { chunk: getAtomicBlockChunk(entityId) };
    }
  }

  if (nodeName === "#text" && node.textContent !== "\n") {
    return createTextChunk(node, inlineStyle, inEntity);
  }

  if (nodeName === "img" && node instanceof HTMLImageElement) {
    const entityConfig: Record<string, unknown> = {};
    entityConfig.src = node.getAttribute
      ? node.getAttribute("src") || node.src
      : node.src;
    entityConfig.alt = node.alt;
    entityConfig.height = node.style.height;
    entityConfig.width = node.style.width;
    if (node.style.float) {
      entityConfig.alignment = node.style.float;
    }
    const entityId = Entity.create("IMAGE", "MUTABLE", entityConfig);
    return { chunk: getAtomicBlockChunk(entityId) };
  }

  if (nodeName === "video" && node instanceof HTMLVideoElement) {
    const entityConfig: Record<string, unknown> = {};
    entityConfig.src = node.getAttribute
      ? node.getAttribute("src") || node.src
      : node.src;
    entityConfig.height = node.style.height;
    entityConfig.width = node.style.width;
    if (node.style.float) {
      entityConfig.alignment = node.style.float;
    }
    const entityId = Entity.create("VIDEO", "MUTABLE", entityConfig);
    return { chunk: getAtomicBlockChunk(entityId) };
  }

  if (nodeName === "iframe" && node instanceof HTMLIFrameElement) {
    const entityConfig: Record<string, unknown> = {};
    entityConfig.src = node.getAttribute
      ? node.getAttribute("src") || node.src
      : node.src;
    entityConfig.height = node.height;
    entityConfig.width = node.width;
    const entityId = Entity.create("EMBEDDED_LINK", "MUTABLE", entityConfig);
    return { chunk: getAtomicBlockChunk(entityId) };
  }

  const blockType = getBlockTypeForTag(nodeName, lastList);

  let chunk;
  if (blockType) {
    if (nodeName === "ul" || nodeName === "ol") {
      lastList = nodeName;
      depth += 1;
    } else {
      if (
        blockType !== "unordered-list-item" &&
        blockType !== "ordered-list-item"
      ) {
        lastList = "";
        depth = -1;
      }
      if (!firstBlock) {
        chunk = getBlockDividerChunk(blockType, depth, getBlockData(node));
      } else {
        chunk = getFirstBlockChunk(blockType, getBlockData(node));
        firstBlock = false;
      }
    }
  }
  if (!chunk) {
    chunk = getEmptyChunk();
  }

  inlineStyle = processInlineTag(nodeName, node, inlineStyle);

  let child = node.firstChild;
  while (child) {
    const entityId = getEntityId(child);
    const { chunk: generatedChunk } = genFragment(
      child as HTMLElement,
      inlineStyle,
      depth,
      lastList,
      entityId || inEntity,
      customChunkGenerator
    );
    chunk = joinChunks(chunk, generatedChunk);
    const sibling = child.nextSibling;
    child = sibling;
  }
  return { chunk };
}

function getChunkForHTML(
  html: string,
  customChunkGenerator?: CustomChunkGenerator
) {
  const sanitizedHtml = html.trim().replace(REGEX_NBSP, SPACE);
  const safeBody = getSafeBodyFromHTML(sanitizedHtml);
  if (!safeBody) {
    return null;
  }
  firstBlock = true;
  const { chunk } = genFragment(
    safeBody,
    OrderedSet(),
    -1,
    "",
    undefined,
    customChunkGenerator
  );
  return { chunk };
}

export default function htmlToDraft(
  html: string,
  customChunkGenerator?: CustomChunkGenerator
) {
  const chunkData = getChunkForHTML(html, customChunkGenerator);
  if (chunkData) {
    const { chunk } = chunkData;
    let entityMap = OrderedMap({});
    chunk.entities &&
      chunk.entities.forEach((entity) => {
        if (entity) {
          entityMap = entityMap.set(entity, Entity.get(entity));
        }
      });
    let start = 0;
    return {
      contentBlocks: chunk.text.split("\r").map((textBlock, ii) => {
        const end = start + textBlock.length;
        const inlines = chunk && chunk.inlines.slice(start, end);
        const entities = chunk && chunk.entities.slice(start, end);
        const characterList = List(
          inlines.map((style, index) => {
            const data: {
              style: OrderedSet<string>;
              entity: string | null;
            } = {
              style,
              entity: null,
            };
            if (entities[index]) {
              data.entity = entities[index];
            }
            return CharacterMetadata.create(data);
          })
        );
        start = end;
        return new ContentBlock({
          key: genKey(),
          type:
            (chunk && chunk.blocks[ii] && chunk.blocks[ii].type) || "unstyled",
          depth: chunk && chunk.blocks[ii] && chunk.blocks[ii].depth,
          data: (chunk && chunk.blocks[ii] && chunk.blocks[ii].data) || Map({}),
          text: textBlock,
          characterList,
        });
      }),
      entityMap,
    };
  }
  return null;
}
