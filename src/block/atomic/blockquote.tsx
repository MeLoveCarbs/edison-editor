import React, { useState } from "react";
import { BlockQuoteProps } from "../../constants";

export const RendererFn: React.FunctionComponent<BlockQuoteProps> = ({
  html,
  className,
}: BlockQuoteProps) => {
  const [showDetail, setShowDetail] = useState(true);
  if (showDetail) {
    return <blockquote dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return (
    <div
      className={`more-button ${className}`}
      onClick={() => setShowDetail(true)}
    >
      ...
    </div>
  );
};
