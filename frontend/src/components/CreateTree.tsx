'use client';

import { useState } from 'react';
import { treeApi } from '@/lib/api';

interface CreateTreeProps {
    onTreeCreated: () => void;
}

export default function CreateTree({ onTreeCreated }: CreateTreeProps) {
    const [startNumber, setStartNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const num = parseFloat(startNumber);
            if (isNaN(num)) {
                setError('Please enter a valid number');
                return;
            }

            await treeApi.create(num);
            setStartNumber('');
            onTreeCreated();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create tree');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Start New Calculation</h2>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="number"
                    step="any"
                    value={startNumber}
                    onChange={(e) => setStartNumber(e.target.value)}
                    placeholder="Enter starting number..."
                    className="flex-1 px-3 py-2 border rounded-md"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400"
                >
                    {loading ? 'Creating...' : 'Start'}
                </button>
            </form>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
    );
}
