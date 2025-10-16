export interface CreateTreeInput {
    startNumber: number;
}

export interface CreateOperationInput {
    treeId: string;
    parentId?: string;
    operationType: 'add' | 'subtract' | 'multiply' | 'divide';
    operand: number;
}

export interface AuthRequest {
    username: string;
    password: string;
}
