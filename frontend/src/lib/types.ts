export interface User {
  id: string;
  username: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface Tree {
  id: string;
  startNumber: number;
  userId: string;
  user: { username: string };
  createdAt: string;
  operations: Operation[];
}

export interface Operation {
  id: string;
  treeId: string;
  parentId: string | null;
  userId: string;
  user: { username: string };
  operationType: string;
  operand: number;
  result: number;
  createdAt: string;
}

export interface TreeNode {
  id: string;
  startNumber?: number;
  operationType?: string;
  operand?: number;
  result: number;
  userId: string;
  username: string;
  children: TreeNode[];
  createdAt: string;
}
