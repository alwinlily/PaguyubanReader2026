'use client';

import { useState, useEffect } from 'react';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { generateMockTransactions } from '@/lib/data-processor';
import { Transaction } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';

const DASHBOARD_PASSWORD = 'mekarsejahtera2026!';

export default function Home() {
  const [data, setData] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setData(generateMockTransactions(100)); // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch data if authenticated
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DASHBOARD_PASSWORD) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-8"
        >
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl text-blue-600 mb-2">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-outfit">Protected Dashboard</h1>
            <p className="text-slate-500 text-sm">Please enter the administrative password to access the full financial dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className={`w-full px-4 py-3 bg-slate-50 border ${error ? 'border-red-300 ring-2 ring-red-50' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  autoFocus
                />
              </div>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 text-red-500 text-xs font-medium pl-1"
                  >
                    <ShieldAlert size={14} />
                    Incorrect password. Please try again.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200"
            >
              Unlock Dashboard
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="pt-4 text-center">
            <p className="text-xs text-slate-400">
              Only authorized personnel should access this page.
              <br />For public status, visit the Compliance Portal.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Dashboard
        transactions={data}
        isLoading={isLoading}
        onRefresh={refreshData}
      />
    </motion.div>
  );
}
