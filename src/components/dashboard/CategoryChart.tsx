'use client';

import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { CategoryBreakdown } from '@/lib/types';
import { formatCurrency } from '@/lib/data-processor';

interface CategoryChartProps {
    data: CategoryBreakdown[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
    const expenseData = data.filter(d => d.type === 'OUT').sort((a, b) => b.amount - a.amount);

    return (
        <div className="w-full h-[350px] bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Expense Breakdown</h3>
                <p className="text-sm text-slate-500">Expenses by category</p>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="amount"
                        nameKey="category"
                    >
                        {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                        }}
                        formatter={(value: any) => [formatCurrency(Number(value) || 0), '']}
                    />
                    <Legend
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                        layout="horizontal"
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
