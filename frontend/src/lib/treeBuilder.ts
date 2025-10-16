import { Tree, TreeNode } from "./types";

export function buildTreeStructure(tree: Tree): TreeNode {
  const operationsMap = new Map<string, TreeNode>();
  const rootChildren: TreeNode[] = [];

  // Create nodes for all operations
  tree.operations.forEach((op) => {
    const node: TreeNode = {
      id: op.id,
      operationType: op.operationType,
      operand: op.operand,
      result: op.result,
      userId: op.userId,
      username: op.user.username,
      children: [],
      createdAt: op.createdAt,
    };
    operationsMap.set(op.id, node);
  });

  // Build tree structure
  tree.operations.forEach((op) => {
    const node = operationsMap.get(op.id)!;
    if (op.parentId) {
      const parent = operationsMap.get(op.parentId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      rootChildren.push(node);
    }
  });

  // Create root node
  return {
    id: tree.id,
    startNumber: tree.startNumber,
    result: tree.startNumber,
    userId: tree.userId,
    username: tree.user.username,
    children: rootChildren,
    createdAt: tree.createdAt,
  };
}
