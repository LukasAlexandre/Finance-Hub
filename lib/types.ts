// Tipos locais (sem Pluggy)
export interface Account {
  id: number
  user_id: number
  name: string
  type: 'checking' | 'savings' | 'wallet' | 'investment' | 'credit' | 'other'
  initial_balance: number
  created_at: string
  current_balance?: number
}

export interface Transaction {
  id: number
  user_id: number
  account_id: number
  date: string // YYYY-MM-DD
  description: string
  amount: number // positivo = receita, negativo = despesa
  category_id: number | null
  notes?: string | null
  created_at: string
  // Campos derivados / join
  category_name?: string
  category_type?: 'income' | 'expense' | 'investment'
  category_color?: string
  account_name?: string
}

export interface Category {
  id: number
  user_id: number | null
  name: string
  type: 'income' | 'expense' | 'investment'
  color: string
  parent_id: number | null
}

export interface Asset {
  id: number
  user_id: number
  type: 'stock' | 'fund' | 'fixed_income' | 'crypto' | 'other'
  ticker: string
  quantity: number
  price: number
  total: number
  purchase_date: string
  created_at: string
}

// Tipos para categorização local
export interface TransactionCategory {
  id: string
  name: string
  color: string
  type: "expense" | "income" | "investment"
  subcategories?: string[]
}

export interface CategorizedTransaction extends Transaction {
  localCategory: string // mapeado para category_id ou heurística
  subcategory?: string
  isRecurring?: boolean
  tags?: string[]
}

export interface DailyBalance {
  date: string
  income: number
  expenses: number
  balance: number
  transactions: CategorizedTransaction[]
}

export interface MonthlyReport {
  month: string
  year: number
  totalIncome: number
  totalExpenses: number
  netBalance: number
  categoryBreakdown: Record<string, number>
  dailyBalances: DailyBalance[]
}
