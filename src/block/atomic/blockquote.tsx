import React, { useState } from "react";

export const EntityType = "blockquote";
export type Props = { html: string };
export const RendererFn: React.FunctionComponent<Props> = ({ html }: Props) => {
  return (
    <blockquote
      style={{
        margin: "0px 0px 0px 0.8ex",
        borderLeft: "1px solid rgb(204,204,204)",
        paddingLeft: "1ex",
        overflow: "hidden",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
