'use client';

import { useState, useEffect } from 'react';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { generateMockTransactions } from '@/lib/data-processor';
import { Transaction } from '@/lib/types';
import { motion } from 'framer-motion';

export default function Home() {
  const [data, setData] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    refreshData();
  }, []);

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
