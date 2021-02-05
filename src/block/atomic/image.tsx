import React from "react";

export const EntityType = "image";
export type Props = { src: string };
export const RendererFn: React.FunctionComponent<Props> = ({ src }: Props) => {
  return <img src={src} />;
};
