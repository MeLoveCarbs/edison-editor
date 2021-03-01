import React from "react";

export const EntityType = "blockquote";
export type Props = { html: string };
export const RendererFn: React.FunctionComponent<Props> = ({ html }: Props) => {
  return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
};
