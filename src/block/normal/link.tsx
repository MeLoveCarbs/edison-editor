import React from "react";
import { ContentState } from "draft-js";
import { LinkProps } from "../../constants";

export const RendererFn: React.FunctionComponent<{
  contentState: ContentState;
  entityKey: string;
  children: any;
}> = ({ contentState, entityKey, children }) => {
  const { url }: LinkProps = contentState.getEntity(entityKey).getData();

  return <a href={url}>{children}</a>;
};
