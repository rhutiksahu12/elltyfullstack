'use client';

import { Tree } from '@/lib/types';
import { buildTreeStructure } from '@/lib/treeBuilder';
import TreeNode from './TreeNode';

interface TreeViewProps {
    trees: Tree[];
    onUpdate: () => void;
}

export default function TreeView({ trees, onUpdate }: TreeViewProps) {
    if (trees.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p className="text-xl">No calculation trees yet</p>
                <p className="mt-2">Be the first to start a calculation!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {trees.map((tree) => {
                const treeStructure = buildTreeStructure(tree);
                return (
                    <div key={tree.id} className="bg-gray-50 p-6 rounded-lg shadow-md">
                        <TreeNode
                            node={treeStructure}
                            treeId={tree.id}
                            onOperationAdded={onUpdate}
                        />
                    </div>
                );
            })}
        </div>
    );
}