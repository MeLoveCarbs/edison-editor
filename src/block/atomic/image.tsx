import React from "react";
import { ImageProps } from "../../constants";

export const RendererFn: React.FunctionComponent<ImageProps> = ({
  src = "",
  alt = "",
  height = "",
  width = "",
}: ImageProps) => {
  return <img src={src} alt={alt} height={height} width={width} />;
};
