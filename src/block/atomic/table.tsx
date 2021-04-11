import React from "react";
import { TableProps } from "../../constants";

export const RendererFn: React.FunctionComponent<TableProps> = ({
  html,
}: TableProps) => {
  return <table dangerouslySetInnerHTML={{ __html: html }} />;
};
