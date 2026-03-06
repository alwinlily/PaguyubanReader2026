'use client';

import React from 'react';
import { Member } from '@/lib/types';
import { formatCurrency } from '@/lib/data-processor';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Check, X, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface MemberComplianceTableProps {
    members: Member[];
    months: string[];
    sortConfig: {
        key: 'name' | 'total';
        direction: 'asc' | 'desc';
    };
    onSort: (key: 'name' | 'total') => void;
    onMemberClick?: (memberKey: string) => void;
    readonly?: boolean;
}

export const MemberComplianceTable: React.FC<MemberComplianceTableProps> = ({
    members,
    months,
    sortConfig,
    onSort,
    onMemberClick,
    readonly = false
}) => {
    return (
        <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50">
                <h3 className="text-lg font-bold text-slate-900">Member Contributions</h3>
                <p className="text-sm text-slate-500">Monthly payment compliance tracking</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th
                                onClick={() => onSort('name')}
                                className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50 z-10 border-r border-slate-100 cursor-pointer hover:text-blue-600 transition-colors"
                            >
                                <div className="flex items-center gap-1">
                                    Member Name
                                    {sortConfig.key === 'name' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                    )}
                                </div>
                            </th>
                            {months.map(month => (
                                <th key={month} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center border-r border-slate-100 last:border-0">
                                    {month}
                                </th>
                            ))}
                            {readonly && (
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        Total
                                    </div>
                                </th>
                            )}
                            {!readonly && (
                                <th
                                    onClick={() => onSort('total')}
                                    className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:text-blue-600 transition-colors"
                                >
                                    <div className="flex items-center justify-end gap-1">
                                        {sortConfig.key === 'total' && (
                                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                        )}
                                        Total
                                    </div>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {members.map((member, idx) => (
                            <motion.tr
                                key={member.memberKey}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => !readonly && onMemberClick?.(member.memberKey)}
                                className={cn(
                                    "transition-colors border-b border-slate-50",
                                    !readonly ? "hover:bg-blue-50/50 cursor-pointer group/row" : ""
                                )}
                            >
                                <td className={cn(
                                    "px-6 py-4 font-medium text-slate-900 sticky left-0 bg-white border-r border-slate-100 z-10 transition-colors",
                                    !readonly && "group-hover/row:bg-blue-50/50"
                                )}>
                                    <div className="flex items-center gap-2">
                                        {member.displayName}
                                    </div>
                                </td>
                                {months.map(month => {
                                    const amount = member.payments[month] || 0;
                                    const isPaid = amount > 0;
                                    return (
                                        <td key={month} className="px-4 py-4 text-center border-r border-slate-100 last:border-0">
                                            <div className="flex justify-center">
                                                {isPaid ? (
                                                    <div className="group relative">
                                                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 transition-transform hover:scale-110">
                                                            <Check size={16} />
                                                        </div>
                                                        {!readonly && (
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                                                                <div className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                                                    {formatCurrency(amount)}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-slate-300">
                                                        <X size={16} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    );
                                })}
                                {!readonly && (
                                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                                        {formatCurrency(member.totalContribution)}
                                    </td>
                                )}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div >
        </div >
    );
};
