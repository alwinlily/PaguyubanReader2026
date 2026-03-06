import { format, parse, startOfMonth } from 'date-fns';
import {
    Transaction,
    TransactionType,
    Member,
    DashboardStats,
    MonthlyStat,
    CategoryBreakdown
} from './types';

export const normalizeName = (name: string): string => {
    let normalized = name.trim().toLowerCase().replace(/\s+/g, ' ');
    // Merge "alwin" and "alwin lily"
    if (normalized === 'alwin' || normalized === 'alwin lily') {
        return 'alwin lily';
    }
    return normalized;
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export const processTransactions = (rawRows: any[]): Transaction[] => {
    return rawRows.map((row, index) => {
        // Robust date parsing for YYYY-MM-DD
        const date = new Date(row.date);
        const amount = parseFloat(row.amount?.toString().replace(/[^\d.-]/g, '') || '0');

        // In this specific sheet: CR = Credit (IN), DB = Debit (OUT)
        const type: TransactionType = row.transaction_type === 'IN' ? 'IN' : 'OUT';

        // Parse category from keterangan if possible (e.g., first word)
        const rawCategory = row.category || 'Uncategorized';
        const category = rawCategory.split(' ')[0] || 'General';

        return {
            id: `row-${index}`,
            date,
            monthKey: isNaN(date.getTime()) ? 'Invalid' : format(date, 'yyyy-MM'),
            type,
            memberName: row.name ? normalizeName(row.name) : null,
            amount: Math.abs(amount),
            category: category,
            note: row.note || '',
            sourceRowId: index + 1,
        };
    }).filter(t =>
        !isNaN(t.amount) &&
        t.monthKey !== 'Invalid' &&
        t.date.toString() !== 'Invalid Date'
    );
};

export const aggregateStats = (transactions: Transaction[]): DashboardStats => {
    const monthlyMap = new Map<string, MonthlyStat>();
    const categoryMap = new Map<string, CategoryBreakdown>();
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
        // Total stats
        if (t.type === 'IN') {
            totalIncome += t.amount;
        } else {
            totalExpense += t.amount;
        }

        // Monthly stats
        const monthStat = monthlyMap.get(t.monthKey) || {
            monthKey: t.monthKey,
            income: 0,
            expense: 0,
            balance: 0,
        };
        if (t.type === 'IN') {
            monthStat.income += t.amount;
        } else {
            monthStat.expense += t.amount;
        }
        monthStat.balance = monthStat.income - monthStat.expense;
        monthlyMap.set(t.monthKey, monthStat);

        // Category breakdown
        const catKey = `${t.type}-${t.category}`;
        const catStat = categoryMap.get(catKey) || {
            category: t.category,
            amount: 0,
            type: t.type,
        };
        catStat.amount += t.amount;
        categoryMap.set(catKey, catStat);
    });

    return {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
        monthlyData: Array.from(monthlyMap.values()).sort((a, b) => a.monthKey.localeCompare(b.monthKey)),
        categoryBreakdown: Array.from(categoryMap.values()),
    };
};

export const getMemberSummary = (transactions: Transaction[]): Member[] => {
    const memberMap = new Map<string, Member>();

    transactions.forEach(t => {
        if (t.memberName) {
            const key = normalizeName(t.memberName);
            const member = memberMap.get(key) || {
                memberKey: key,
                displayName: key.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                totalContribution: 0,
                totalIncome: 0,
                totalExpense: 0,
                payments: {},
            };

            // Net contribution for the total: CR (IN) - DB (OUT)
            const netAmount = t.type === 'IN' ? t.amount : -t.amount;
            member.totalContribution += netAmount;

            if (t.type === 'IN') {
                member.totalIncome += t.amount;
                // For monthly compliance tracking (heatmap), we only count Receipts (CR)
                // so that a withdrawal doesn't invalidate a payment checkmark.
                member.payments[t.monthKey] = (member.payments[t.monthKey] || 0) + t.amount;
            } else {
                member.totalExpense += t.amount;
            }

            memberMap.set(key, member);
        }
    });

    return Array.from(memberMap.values()).sort((a, b) => b.totalContribution - a.totalContribution);
};

// Mock data generator for testing
export const generateMockTransactions = (count: number = 50): Transaction[] => {
    const categories = ['Monthly Fee', 'Donation', 'Event', 'Stationery', 'Food', 'Rent'];
    const members = ['Alwin', 'Lily', 'Budi', 'Dewi', 'Eko', 'Sari', 'Joko', 'Ani'];
    const data: any[] = [];

    for (let i = 0; i < count; i++) {
        const isIncome = Math.random() > 0.3;
        const date = new Date(2026, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1);
        data.push({
            date: date.toISOString(),
            name: isIncome ? members[Math.floor(Math.random() * members.length)] : '',
            amount: isIncome ? 50000 : Math.floor(Math.random() * 200000) + 10000,
            transaction_type: isIncome ? 'IN' : 'OUT',
            category: isIncome ? 'Contribution' : categories[Math.floor(Math.random() * categories.length)],
            note: 'Transaction note ' + i,
        });
    }

    return processTransactions(data);
};
