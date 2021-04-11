export const CustomStylePrefix = {
  COLOR: "color-",
  HIGH_LIGHT_COLOR: "bgcolor-",
  FONT_SIZE: "fontsize-",
  FONT_FAMILY: "fontfamily-",
} as const;

export const BlockMap = {
  Atomic: "atomic",
} as const;

export const EntityTypeMap = {
  ImageEntityType: "IMAGE",
  TableEntityType: "TABLE",
  BlockQuoteEntityType: "BLOCKQUOTE",
  LinkEntityType: "LINK",
} as const;

export type EntityTypes = typeof EntityTypeMap[keyof typeof EntityTypeMap];

export type ImageProps = {
  src?: string;
  alt?: string;
  height?: string;
  width?: string;
};
export type TableProps = { html: string };
export type BlockQuoteProps = { html: string };
export type LinkProps = { url: string; text: string };

export type EntityProps<T extends EntityTypes> = {
  [EntityTypeMap.ImageEntityType]: ImageProps;
  [EntityTypeMap.TableEntityType]: TableProps;
  [EntityTypeMap.BlockQuoteEntityType]: BlockQuoteProps;
  [EntityTypeMap.LinkEntityType]: LinkProps;
}[T];

export const BlockDataKeyMap = {
  textIndent: "textIndent",
} as const;

export const BlockClassNamePrefix = {
  Indent: "edison-indent-",
} as const;
