'use client';

import React from 'react';
import { Member, Transaction } from '@/lib/types';
import { formatCurrency } from '@/lib/data-processor';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, TrendingUp, TrendingDown, Wallet, History, Info } from 'lucide-react';
import { format } from 'date-fns';

interface MemberDetailViewProps {
    member: Member;
    transactions: Transaction[];
    onClose: () => void;
}

export const MemberDetailView: React.FC<MemberDetailViewProps> = ({
    member,
    transactions,
    onClose
}) => {
    // Filter transactions for this specific member
    const memberTransactions = transactions
        .filter(t => t.memberName?.toLowerCase() === member.memberKey.toLowerCase())
        .sort((a, b) => {
            const dateA = a.date instanceof Date ? a.date : new Date(a.date);
            const dateB = b.date instanceof Date ? b.date : new Date(b.date);
            return dateB.getTime() - dateA.getTime();
        });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end"
            onClick={onClose}
        >
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full max-w-xl bg-slate-50 h-full shadow-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-white px-8 py-6 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{member.displayName}</h2>
                        <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                            <Info size={14} />
                            Member Financial Details
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 text-green-600 mb-2">
                                <TrendingUp size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Total Income</span>
                            </div>
                            <div className="text-xl font-bold text-slate-900">
                                {formatCurrency(member.totalIncome)}
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 text-red-600 mb-2">
                                <TrendingDown size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Total Expense</span>
                            </div>
                            <div className="text-xl font-bold text-slate-900">
                                {formatCurrency(member.totalExpense)}
                            </div>
                        </div>
                        <div className="col-span-2 bg-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-200 text-white">
                            <div className="flex items-center gap-2 opacity-80 mb-2">
                                <Wallet size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Net Contribution Balance</span>
                            </div>
                            <div className="text-3xl font-black">
                                {formatCurrency(member.totalContribution)}
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <History size={20} className="text-slate-400" />
                            <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>
                        </div>
                        <div className="space-y-3">
                            {memberTransactions.length > 0 ? (
                                memberTransactions.map((t) => (
                                    <div
                                        key={t.id}
                                        className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-300 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${t.type === 'IN' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                {t.type === 'IN' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 text-sm">
                                                    {t.note || (t.type === 'IN' ? 'Contribution' : 'Expense')}
                                                </div>
                                                <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                    <Calendar size={12} />
                                                    {format(t.date instanceof Date ? t.date : new Date(t.date), 'dd MMM yyyy')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`font-bold ${t.type === 'IN' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {t.type === 'IN' ? '+' : '-'}{formatCurrency(t.amount)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
                                    No transaction history found for this member.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white px-8 py-6 border-t border-slate-200 text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                        Community Monitoring System v1.0
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};
