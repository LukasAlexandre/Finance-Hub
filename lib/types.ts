// Tipos para a API do Pluggy
export interface PluggyTransaction {
  id: string
  description: string
  descriptionRaw: string
  currencyCode: string
  amount: number
  date: string
  balance: number
  category: string
  accountId: string
  providerCode: string
  status: string
  paymentData?: {
    payerName?: string
    payerDocument?: string
    receiverName?: string
    receiverDocument?: string
    paymentMethod?: string
    referenceNumber?: string
  }
}

export interface PluggyAccount {
  id: string
  type: string
  subtype: string
  number: string
  name: string
  marketingName: string
  balance: number
  currencyCode: string
  itemId: string
}

export interface PluggyItem {
  id: string
  connector: {
    id: number
    name: string
    institutionUrl: string
    imageUrl: string
    primaryColor: string
    type: string
  }
  createdAt: string
  updatedAt: string
  status: string
  executionStatus: string
  lastUpdatedAt: string
  webhookUrl?: string
}

// Tipos para categorização local
export interface TransactionCategory {
  id: string
  name: string
  color: string
  type: "expense" | "income" | "investment"
  subcategories?: string[]
}

export interface CategorizedTransaction extends PluggyTransaction {
  localCategory: string
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
