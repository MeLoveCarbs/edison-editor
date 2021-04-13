import { Entity } from "draft-js";

const getEntityId = (node: ChildNode) => {
  let entityId = undefined;
  if (node instanceof HTMLAnchorElement) {
    const entityConfig: Record<string, unknown> = {};
    if (node.dataset && node.dataset.mention !== undefined) {
      entityConfig.url = node.href;
      entityConfig.text = node.innerHTML;
      entityConfig.value = node.dataset.value;
      entityId = Entity.create("MENTION", "IMMUTABLE", entityConfig);
    } else {
      entityConfig.url = node.getAttribute
        ? node.getAttribute("href") || node.href
        : node.href;
      entityConfig.title = node.innerHTML;
      entityConfig.targetOption = node.target;
      entityId = Entity.create("LINK", "MUTABLE", entityConfig);
    }
  }
  return entityId;
};

export default getEntityId;
