import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DailyTransactionList } from "@/components/daily-transaction-list"
import { TransactionSummary } from "@/components/transaction-summary"

export default function TransactionsPage() {
  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight font-serif">Transações</h2>
              <p className="text-muted-foreground">Histórico completo das suas movimentações financeiras</p>
            </div>

            <TransactionSummary
              totalIncome={5750.0}
              totalExpenses={470.58}
              transactionCount={8}
              period="Últimos 30 dias"
            />

            <DailyTransactionList />
          </div>
        </main>
      </div>
    </div>
  )
}
