'use client';

import { useState } from 'react';
import { operationApi } from '@/lib/api';

interface AddOperationProps {
    treeId: string;
    parentId?: string;
    parentResult: number;
    onOperationAdded: () => void;
    onCancel: () => void;
}

export default function AddOperation({
    treeId,
    parentId,
    parentResult,
    onOperationAdded,
    onCancel,
}: AddOperationProps) {
    const [operationType, setOperationType] = useState('add');
    const [operand, setOperand] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const num = parseFloat(operand);
            if (isNaN(num)) {
                setError('Please enter a valid number');
                return;
            }

            await operationApi.create({
                treeId,
                parentId,
                operationType,
                operand: num,
            });

            onOperationAdded();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to add operation');
        } finally {
            setLoading(false);
        }
    };

    const getSymbol = (op: string) => {
        switch (op) {
            case 'add': return '+';
            case 'subtract': return '-';
            case 'multiply': return '*';
            case 'divide': return '÷';
            default: return '';
        }
    };

    const calculatePreview = () => {
        const num = parseFloat(operand);
        if (isNaN(num)) return '?';

        switch (operationType) {
            case 'add': return parentResult + num;
            case 'subtract': return parentResult - num;
            case 'multiply': return parentResult * num;
            case 'divide': return num === 0 ? 'Error' : parentResult / num;
            default: return '?';
        }
    };

    return (
        <div className="ml-8 mt-2 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="text-sm text-gray-600">
                    Current value: <span className="font-bold">{parentResult}</span>
                </div>

                <div className="flex gap-2">
                    <select
                        value={operationType}
                        onChange={(e) => setOperationType(e.target.value)}
                        className="px-3 py-2 border rounded-md"
                    >
                        <option value="add">+ Add</option>
                        <option value="subtract">- Subtract</option>
                        <option value="multiply">* Multiply</option>
                        <option value="divide">÷ Divide</option>
                    </select>

                    <input
                        type="number"
                        step="any"
                        value={operand}
                        onChange={(e) => setOperand(e.target.value)}
                        placeholder="Number..."
                        className="flex-1 px-3 py-2 border rounded-md"
                        required
                    />
                </div>

                {operand && (
                    <div className="text-sm">
                        Preview: {parentResult} {getSymbol(operationType)} {operand} = <span className="font-bold">{calculatePreview()}</span>
                    </div>
                )}

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? 'Adding...' : 'Add Operation'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}