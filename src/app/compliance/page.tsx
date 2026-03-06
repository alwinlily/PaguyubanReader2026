'use client';

import { useState, useEffect, useMemo } from 'react';
import { MemberComplianceTable } from '@/components/dashboard/MemberComplianceTable';
import { Transaction, Member } from '@/lib/types';
import { getMemberSummary } from '@/lib/data-processor';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function CompliancePage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'total'; direction: 'asc' | 'desc' }>({
        key: 'name',
        direction: 'asc'
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/data');
                const result = await response.json();
                setTransactions(result);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const allMembers = useMemo(() => getMemberSummary(transactions), [transactions]);

    const months = useMemo(() => {
        const monthSet = new Set<string>();
        transactions.forEach(t => monthSet.add(t.monthKey));
        return Array.from(monthSet).sort();
    }, [transactions]);

    const filteredAndSortedMembers = useMemo(() => {
        return allMembers
            .filter(member =>
                member.displayName.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
                const modifier = sortConfig.direction === 'asc' ? 1 : -1;
                if (sortConfig.key === 'name') {
                    return modifier * a.displayName.localeCompare(b.displayName);
                }
                return modifier * (a.totalContribution - b.totalContribution);
            });
    }, [allMembers, searchQuery, sortConfig]);

    const handleSort = (key: 'name' | 'total') => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Public Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 py-8 text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl text-blue-600 mb-2">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight font-outfit">
                        Transparency Portal
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Real-time payment compliance status for Mekar Sejahtera Sempura.
                        Green checks represent confirmed monthly contributions.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                            <p className="text-slate-500 font-medium">Loading contribution records...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h2 className="text-xl font-bold text-slate-900">Contribution Status</h2>
                                <div className="relative w-full md:w-64">
                                    <input
                                        type="text"
                                        placeholder="Search your name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-4 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <MemberComplianceTable
                                members={filteredAndSortedMembers}
                                months={months}
                                sortConfig={sortConfig}
                                onSort={handleSort}
                                readonly={true}
                            />
                        </div>
                    )}

                    <div className="text-center text-slate-400 text-sm py-8 border-t border-slate-100">
                        &copy; {new Date().getFullYear()} Sejahtera Sempura. Dedicated to community transparency.
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
