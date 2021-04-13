import React from "react";
import { TableProps } from "../../constants";

export const RendererFn: React.FunctionComponent<TableProps> = ({
  html,
  className,
}: TableProps) => {
  return (
    <table className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
};
