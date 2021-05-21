import React from "react";
import { ImageProps } from "../../constants";
import { EventListener, EventMap } from "../../events";

export const RendererFn: React.FunctionComponent<ImageProps> = ({
  src = "",
  alt = "",
  height = "",
  width = "",
}: ImageProps) => {
  const onImageLoad = () => {
    EventListener.emitEvent(EventMap.ImgOnload);
  };
  return (
    <img
      src={src}
      alt={alt}
      height={height}
      width={width}
      onLoad={onImageLoad}
    />
  );
};
