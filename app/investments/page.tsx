import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { InvestmentPortfolio } from "@/components/investment-portfolio"
import { InvestmentAllocation } from "@/components/investment-allocation"
import { InvestmentMetrics } from "@/components/investment-metrics"
import { InvestmentPerformance } from "@/components/investment-performance"
import { InvestmentAreaChart } from "@/components/charts/investment-area-chart"

export default function InvestmentsPage() {
  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight font-serif">Investimentos</h2>
              <p className="text-muted-foreground">Acompanhe e gerencie seu portfólio de investimentos</p>
            </div>

            <InvestmentMetrics />

            <div className="grid gap-6 lg:grid-cols-2">
              <InvestmentAllocation />
              <InvestmentPerformance />
            </div>

            <InvestmentAreaChart />

            <InvestmentPortfolio />
          </div>
        </main>
      </div>
    </div>
  )
}
