import React, { useState } from "react";

export const EntityType = "table";
export type Props = { html: string };
export const RendererFn: React.FunctionComponent<Props> = ({ html }: Props) => {
  return (
    <table
      style={{
        whiteSpace: "normal",
        wordBreak: "break-all",
        maxWidth: "100%",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
