import React, { useState } from "react";
import { BlockQuoteProps } from "../../constants";

export const RendererFn: React.FunctionComponent<BlockQuoteProps> = ({
  html,
}: BlockQuoteProps) => {
  const [showDetail, setShowDetail] = useState(false);
  if (showDetail) {
    return <blockquote dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <div onClick={() => setShowDetail(true)}>...</div>;
};
