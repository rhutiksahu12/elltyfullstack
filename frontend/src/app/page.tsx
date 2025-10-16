'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { treeApi } from '@/lib/api';
import { Tree } from '@/lib/types';
import AuthForm from '@/components/AuthForm';
import CreateTree from '@/components/CreateTree';
import TreeView from '@/components/TreeView';

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  const fetchTrees = async () => {
    try {
      const data = await treeApi.getAll();
      setTrees(data);
    } catch (error) {
      console.error('Failed to fetch trees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrees();
  }, []);


  
  const handleTreeCreated = () => {
    fetchTrees();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Number Tree
              </h1>
              <p className="text-sm text-gray-500">
                Communicate through mathematical operations
              </p>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated() ? (
                <>
                  <span className="text-sm text-gray-600">
                    Welcome, <span className="font-semibold">{user?.username}</span>
                  </span>
                  <button
                    onClick={logout}
                    className="bg-red-700 text-white px-5 py-2 rounded-md hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuth(!showAuth)}
                  className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  {showAuth ? 'Close' : 'Login / Register'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
        {/* Auth Form */}
        {!isAuthenticated() && showAuth && (
          <div className="mb-8">
            <AuthForm />
          </div>
        )}

        {/* Create Tree Form */}
        {isAuthenticated() && (
          <CreateTree onTreeCreated={handleTreeCreated} />
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Anyone can view all calculation trees</li>
            <li>• Register/Login to start new calculations or add operations</li>
            <li>• Start a tree with any number</li>
            <li>• Add operations (+, -, ×, ÷) to any number in the tree</li>
            <li>• Build complex calculation trees collaboratively!</li>
          </ul>
        </div>

        {/* Trees */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading trees...</p>
          </div>
        ) : (
          <TreeView trees={trees} onUpdate={fetchTrees} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>Number Tree - A social network through mathematics</p>
        </div>
      </footer>
    </div>
  );
}