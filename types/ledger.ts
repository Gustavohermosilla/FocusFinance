export type LedgerType = 'income' | 'expense' | 'transfer';
export type LedgerSource = 'manual' | 'ai_agent' | 'import';

export interface LedgerEntry {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  type: LedgerType;
  category: string;
  description: string | null;
  tags: string[] | null;
  transaction_date: string;
  source: LedgerSource;
  created_at: string;
  updated_at: string;
}

export type CreateLedgerInput = {
  amount: number;
  currency?: string;
  type: LedgerType;
  category: string;
  description?: string;
  tags?: string[];
  transaction_date: string;
  source?: LedgerSource;
};
