'use client';

import { useState } from 'react';
import { TreeNode as TreeNodeType } from '@/lib/types';
import AddOperation from './AddOperation';
import { useAuth } from '@/hooks/useAuth';

interface TreeNodeProps {
    node: TreeNodeType;
    treeId: string;
    onOperationAdded: () => void;
}

export default function TreeNode({ node, treeId, onOperationAdded }: TreeNodeProps) {
    const [showAddOperation, setShowAddOperation] = useState(false);
    const [expanded, setExpanded] = useState(true);
    const { isAuthenticated } = useAuth();

    const getOperationSymbol = (op: string) => {
        switch (op) {
            case 'add': return '+';
            case 'subtract': return '-';
            case 'multiply': return 'x';
            case 'divide': return '÷';
            default: return '';
        }
    };

    const handleOperationAdded = () => {
        setShowAddOperation(false);
        onOperationAdded();
    };

    return (
        <div className="ml-6 border-l-2 border-gray-300 pl-4 my-2">
            <div className="flex items-center gap-2 group">
                {node.children.length > 0 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-gray-500 hover:text-gray-700 font-bold"
                    >
                        {expanded ? '-' : '+'}
                    </button>
                )}

                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            {node.startNumber !== undefined ? (
                                <span className="text-lg font-bold text-blue-600">
                                    Start: {node.startNumber}
                                </span>
                            ) : (
                                <span className="text-lg">
                                    {getOperationSymbol(node.operationType!)} {node.operand} = <span className="font-bold text-green-600">{node.result}</span>
                                </span>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                                by {node.username} • {new Date(node.createdAt).toLocaleString()}
                            </div>
                        </div>

                        {isAuthenticated() && !showAddOperation && (
                            <button
                                onClick={() => setShowAddOperation(true)}
                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                + Add
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showAddOperation && (
                <AddOperation
                    treeId={treeId}
                    parentId={node.startNumber === undefined ? node.id : undefined}
                    parentResult={node.result}
                    onOperationAdded={handleOperationAdded}
                    onCancel={() => setShowAddOperation(false)}
                />
            )}

            {expanded && node.children.length > 0 && (
                <div>
                    {node.children.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            treeId={treeId}
                            onOperationAdded={onOperationAdded}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
