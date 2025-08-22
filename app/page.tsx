import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { OverviewCards } from "@/components/overview-cards"
import { RecentTransactions } from "@/components/recent-transactions"
import { ExpensePieChart } from "@/components/charts/expense-pie-chart"
import { BalanceEvolutionChart } from "@/components/charts/balance-evolution-chart"
import { IncomeExpenseChart } from "@/components/charts/income-expense-chart"
import { InvestmentAreaChart } from "@/components/charts/investment-area-chart"
import { FinancialMetrics } from "@/components/financial-metrics"

export default function DashboardPage() {
  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight font-serif">Dashboard</h2>
              <p className="text-muted-foreground">Visão geral das suas finanças pessoais</p>
            </div>

            <OverviewCards />

            <div>
              <h3 className="text-xl font-semibold mb-4">Métricas Financeiras</h3>
              <FinancialMetrics />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <ExpensePieChart />
              <BalanceEvolutionChart />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <IncomeExpenseChart />
              <InvestmentAreaChart />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Atividade Recente</h3>
              <RecentTransactions />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
