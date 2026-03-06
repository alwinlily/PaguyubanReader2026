'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { Member } from '@/lib/types';
import { formatCurrency } from '@/lib/data-processor';

interface MemberComparisonChartProps {
    members: Member[];
}

export const MemberComparisonChart: React.FC<MemberComparisonChartProps> = ({ members }) => {
    // Take top 10 members by total activity to keep chart readable
    const chartData = [...members]
        .sort((a, b) => (b.totalIncome + b.totalExpense) - (a.totalIncome + a.totalExpense))
        .map(m => ({
            name: m.displayName.split(' ')[0], // Use first name for space
            fullName: m.displayName,
            income: m.totalIncome,
            expense: m.totalExpense,
        }));

    return (
        <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Member Activity Comparison</h3>
                <p className="text-sm text-slate-500">Comparison of total receipts vs expenses for all members</p>
            </div>
            <div className="h-[500px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 40, right: 30, left: 20, bottom: 60 }}
                        barGap={8}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10 }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickFormatter={(value) => `Rp ${value / 1000000}M`}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                padding: '12px'
                            }}
                            formatter={(value: number | undefined) => [formatCurrency(value || 0), '']}
                            labelStyle={{ fontWeight: 'bold', marginBottom: '4px', color: '#0f172a' }}
                            labelFormatter={(label, items) => items[0]?.payload.fullName || label}
                        />
                        <Legend
                            verticalAlign="top"
                            align="right"
                            iconType="circle"
                            wrapperStyle={{ paddingBottom: '20px' }}
                        />
                        <Bar
                            dataKey="income"
                            name="Income (CR)"
                            fill="#10b981"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                        <Bar
                            dataKey="expense"
                            name="Expense (DB)"
                            fill="#ef4444"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
