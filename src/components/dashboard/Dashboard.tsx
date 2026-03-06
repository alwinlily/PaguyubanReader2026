'use client';

import React, { useMemo } from 'react';
import {
    PlusCircle,
    TrendingUp,
    TrendingDown,
    Wallet,
    Users,
    PieChart as PieChartIcon,
    Calendar,
    Search,
    RefreshCw,
    FileText
} from 'lucide-react';
import { SummaryCard } from './SummaryCard';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { MemberComparisonChart } from './MemberComparisonChart';
import { MemberDetailView } from './MemberDetailView';
import { MemberComplianceTable } from './MemberComplianceTable';
import { Transaction, DashboardStats, Member } from '@/lib/types';
import { formatCurrency, aggregateStats, getMemberSummary } from '@/lib/data-processor';
import { motion, AnimatePresence } from 'framer-motion';

type SortConfig = {
    key: 'name' | 'total';
    direction: 'asc' | 'desc';
};

interface DashboardProps {
    transactions: Transaction[];
    isLoading?: boolean;
    onRefresh?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    transactions,
    isLoading = false,
    onRefresh
}) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [sortConfig, setSortConfig] = React.useState<SortConfig>({ key: 'total', direction: 'desc' });
    const [selectedMemberKey, setSelectedMemberKey] = React.useState<string | null>(null);

    const stats = useMemo(() => aggregateStats(transactions), [transactions]);
    const allMembers = useMemo(() => getMemberSummary(transactions), [transactions]);

    const selectedMember = useMemo(() => {
        if (!selectedMemberKey) return null;
        return allMembers.find(m => m.memberKey === selectedMemberKey) || null;
    }, [allMembers, selectedMemberKey]);

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

    const months = useMemo(() => {
        const monthSet = new Set<string>();
        transactions.forEach(t => monthSet.add(t.monthKey));
        return Array.from(monthSet).sort();
    }, [transactions]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mekar Sejahtera Sempura</h1>
                    <p className="text-slate-500 mt-1">Monitoring Kas Paguyuban</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onRefresh}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <RefreshCw size={16} />
                        Refresh Data
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm">
                        <FileText size={16} />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    title="Total Income"
                    value={formatCurrency(stats.totalIncome)}
                    icon={TrendingUp}
                    color="green"
                    trend="+12.5%"
                    trendType="up"
                />
                <SummaryCard
                    title="Total Expenses"
                    value={formatCurrency(stats.totalExpense)}
                    icon={TrendingDown}
                    color="red"
                    trend="+4.2%"
                    trendType="down"
                />
                <SummaryCard
                    title="Net Balance"
                    value={formatCurrency(stats.netBalance)}
                    icon={Wallet}
                    color="blue"
                />
                <SummaryCard
                    title="Active Members"
                    value={allMembers.length.toString()}
                    icon={Users}
                    color="orange"
                />
            </div>

            {/* Main Charts */}
            <div className="w-full">
                <IncomeExpenseChart data={stats.monthlyData} />
            </div>

            {/* Member Comparison Chart */}
            <div className="mt-8">
                <MemberComparisonChart members={allMembers} />
            </div>

            {/* Member Compliance */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Users className="text-blue-600" size={24} />
                        Member Compliance
                    </h2>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>
                <MemberComplianceTable
                    members={filteredAndSortedMembers}
                    months={months}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    onMemberClick={setSelectedMemberKey}
                />
            </div>

            {/* Member Detail Sidebar/Modal */}
            <AnimatePresence>
                {selectedMember && (
                    <MemberDetailView
                        member={selectedMember}
                        transactions={transactions}
                        onClose={() => setSelectedMemberKey(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
