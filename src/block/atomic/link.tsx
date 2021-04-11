import React from "react";
import { LinkProps } from "../../constants";

export const RendererFn: React.FunctionComponent<LinkProps> = ({
  url,
  text,
}: LinkProps) => {
  return <a href={url}>{text}</a>;
};
