import React, { useState } from "react";
import { BlockQuoteProps } from "../../constants";

export const RendererFn: React.FunctionComponent<BlockQuoteProps> = ({
  html,
}: BlockQuoteProps) => {
  const [showDetail, setShowDetail] = useState(false);
  if (showDetail) {
    return <blockquote dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return (
    <div className="more-button" onClick={() => setShowDetail(true)}>
      ...
    </div>
  );
};
