export type TransactionType = 'IN' | 'OUT';

export interface Transaction {
  id: string;
  date: Date;
  monthKey: string; // YYYY-MM
  type: TransactionType;
  memberName: string | null;
  amount: number;
  category: string;
  note: string;
  sourceRowId: number;
}

export interface Member {
  memberKey: string;
  displayName: string;
  totalContribution: number;
  totalIncome: number;
  totalExpense: number;
  payments: Record<string, number>; // monthKey -> amount
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  monthlyData: MonthlyStat[];
  categoryBreakdown: CategoryBreakdown[];
}

export interface MonthlyStat {
  monthKey: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  type: TransactionType;
}
