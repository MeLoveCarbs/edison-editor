export const CustomStylePrefix = {
  COLOR: "color-",
  HIGH_LIGHT_COLOR: "bgcolor-",
  FONT_SIZE: "fontsize-",
  FONT_FAMILY: "fontfamily-",
} as const;

export const KeepStylePrefix = [
  CustomStylePrefix.COLOR,
  CustomStylePrefix.FONT_SIZE,
  CustomStylePrefix.FONT_FAMILY,
] as const;

export const BlockMap = {
  Atomic: "atomic",
} as const;

export const EntityTypeMap = {
  ImageEntityType: "IMAGE",
  TableEntityType: "TABLE",
  BlockQuoteEntityType: "BLOCKQUOTE",
  LinkEntityType: "LINK",
} as const;

export type ImageProps = {
  src?: string;
  alt?: string;
  height?: string;
  width?: string;
};
export type TableProps = { html: string; className: string; style: string };
export type BlockQuoteProps = {
  html: string;
  className: string;
  style: string;
};
export type LinkProps = { url: string; text: string };

export type AtomicEntityTypes =
  | typeof EntityTypeMap.ImageEntityType
  | typeof EntityTypeMap.BlockQuoteEntityType
  | typeof EntityTypeMap.TableEntityType;

export type AtomicEntityProps<T extends AtomicEntityTypes> = {
  [EntityTypeMap.ImageEntityType]: ImageProps;
  [EntityTypeMap.TableEntityType]: TableProps;
  [EntityTypeMap.BlockQuoteEntityType]: BlockQuoteProps;
}[T];

export const BlockDataKeyMap = {
  textIndent: "textIndent",
  className: "className",
  textAlign: "textAlign",
} as const;

export const BlockClassNamePrefix = {
  Indent: "edison-indent-",
} as const;
