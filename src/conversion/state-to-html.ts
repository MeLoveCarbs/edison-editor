import {
  EditorState,
  ContentBlock,
  EntityInstance,
  DraftInlineStyle,
} from "draft-js";
import { stateToHTML as conversion } from "draft-js-export-html";
import { EntityTypeMap, BlockClassNamePrefix } from "../constants";
import inlineStyleRender from "../render/inline-style-render";
import blockStyleRender from "../render/block-style-render";

function classMapStyle(classNames: string) {
  const classList = classNames.split(` `);
  return classList.reduce((styles: React.CSSProperties, className: string) => {
    if (className.startsWith(BlockClassNamePrefix.Indent)) {
      styles.marginLeft =
        parseInt(className.split(BlockClassNamePrefix.Indent)[1]) * 2 + "em";
    }
    return styles;
  }, {});
}

const entityMapNode = (entity: EntityInstance) => {
  const entityType = entity.getType();
  const data = entity.getData();
  if (entityType === EntityTypeMap.ImageEntityType) {
    return {
      element: "img",
      attributes: {
        ...data,
      },
    };
  }

  if (entityType === EntityTypeMap.TableEntityType) {
    return {
      element: "img",
      attributes: {
        innerHTML: data.html,
      },
    };
  }
};

export function stateToHTML(state: EditorState) {
  const options = {
    inlineStyleFn: (style: DraftInlineStyle) => {
      return {
        style: inlineStyleRender(style),
      };
    },
    blockStyleFn: (block: ContentBlock) => {
      const className = blockStyleRender(block);
      const style = classMapStyle(className);
      if (block.getType() === "atomic") {
        return {
          element: "div",
          style,
        };
      }
      return {
        style,
      };
    },
    entityStyleFn: entityMapNode,
  };

  const formatStr = conversion(state.getCurrentContent(), options);
  const boxNode = document.createElement("div");
  boxNode.innerHTML = formatStr;
  const allTable = boxNode.querySelectorAll("table");
  allTable.forEach((el) => {
    const innerHTML = el.getAttribute("innerHTML");
    if (innerHTML) {
      el.innerHTML = innerHTML;
      el.removeAttribute("innerHTML");
    }
  });
  return boxNode.innerHTML;
}
