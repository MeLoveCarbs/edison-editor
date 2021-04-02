import { RawDraftEntity } from "draft-js";

export const HeadNodeMapEntity = {
  head: (node: HTMLElement) => {
    return {
      type: "EMPTY",
      mutability: "IMMUTABLE",
      data: {},
    } as RawDraftEntity;
  },
  style: (node: HTMLElement) => {
    return {
      type: "EMPTY",
      mutability: "IMMUTABLE",
      data: {},
    } as RawDraftEntity;
  },
};
