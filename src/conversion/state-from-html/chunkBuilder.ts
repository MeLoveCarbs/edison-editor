import { OrderedSet, Map } from "immutable";

const SPACE = " ";
const MAX_DEPTH = 4;

export type Block = {
  type: string;
  depth: number;
  data: Map<string, unknown>;
};
export type Chunk = {
  text: string;
  inlines: Array<OrderedSet<string>>;
  entities: (string | undefined)[];
  blocks: Block[];
};

const getWhitespaceChunk = (entityId?: string): Chunk => {
  return {
    text: SPACE,
    inlines: [OrderedSet()],
    entities: [entityId],
    blocks: [],
  };
};

export const createTextChunk = (
  node: Element,
  inlineStyle: OrderedSet<string>,
  entityId?: string
): { chunk: Chunk } => {
  const text = node.textContent || "";
  if (text.trim() === "") {
    return { chunk: getWhitespaceChunk(entityId) };
  }
  return {
    chunk: {
      text,
      inlines: Array(text.length).fill(inlineStyle) as Array<
        OrderedSet<string>
      >,
      entities: Array(text.length).fill(entityId),
      blocks: [],
    },
  };
};

export const getSoftNewlineChunk = (): Chunk => {
  return {
    text: "\n",
    inlines: [OrderedSet()],
    entities: new Array(1),
    blocks: [],
  };
};

export const getEmptyChunk = (): Chunk => {
  return {
    text: "",
    inlines: [],
    entities: [],
    blocks: [],
  };
};

export const getFirstBlockChunk = (
  blockType: string,
  data?: Map<string, unknown>
): Chunk => {
  return {
    text: "",
    inlines: [],
    entities: [],
    blocks: [
      {
        type: blockType,
        depth: 0,
        data: data || Map({}),
      },
    ],
  };
};

export const getBlockDividerChunk = (
  blockType: string,
  depth: number,
  data?: Map<string, unknown>
): Chunk => {
  return {
    text: "\r",
    inlines: [],
    entities: [],
    blocks: [
      {
        type: blockType,
        depth: Math.max(0, Math.min(MAX_DEPTH, depth)),
        data: data || Map({}),
      },
    ],
  };
};

export const getAtomicBlockChunk = (entityId: string): Chunk => {
  return {
    text: "\r ",
    inlines: [OrderedSet()],
    entities: [entityId],
    blocks: [
      {
        type: "atomic",
        depth: 0,
        data: Map({}),
      },
    ],
  };
};

export const joinChunks = (A: Chunk, B: Chunk): Chunk => {
  return {
    text: A.text + B.text,
    inlines: A.inlines.concat(B.inlines),
    entities: A.entities.concat(B.entities),
    blocks: A.blocks.concat(B.blocks),
  };
};
