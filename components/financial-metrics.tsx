"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, Calendar } from "lucide-react"
import { useEffect, useState } from "react"

interface MetricsData {
  savingsRate: number
  dailyAverage: number
  investmentGoalProgress: number
  monthlyChange: number
  totalIncome: number
  totalExpenses: number
  totalInvestments: number
}

export function FinancialMetrics() {
  const [data, setData] = useState<MetricsData>({
    savingsRate: 0,
    dailyAverage: 0,
    investmentGoalProgress: 0,
    monthlyChange: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalInvestments: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMetricsData() {
      try {
        console.log("[v0] Buscando dados para métricas financeiras...")

        const currentDate = new Date()
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

        // Buscar transações do mês atual
        const transactionsResponse = await fetch(
          `/api/transactions?from=${firstDayOfMonth.toISOString().split("T")[0]}&to=${lastDayOfMonth.toISOString().split("T")[0]}`,
        )
        const transactions = await transactionsResponse.json()

        // Buscar investimentos
        const investmentsResponse = await fetch("/api/investments")
        const investments = await investmentsResponse.json()

        let totalIncome = 0
        let totalExpenses = 0

        if (Array.isArray(transactions)) {
          transactions.forEach((transaction: any) => {
            if (transaction.amount > 0) {
              totalIncome += transaction.amount
            } else {
              totalExpenses += Math.abs(transaction.amount)
            }
          })
        }

        const totalInvestments = Array.isArray(investments)
          ? investments.reduce((sum: number, investment: any) => sum + (investment.balance || investment.value || 0), 0)
          : 0

        // Calcular métricas
        const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
        const daysInMonth = lastDayOfMonth.getDate()
        const dailyAverage = totalExpenses / daysInMonth

        // Meta de investimento (exemplo: R$ 3.000)
        const investmentGoal = 3000
        const investmentGoalProgress = Math.min((totalInvestments / investmentGoal) * 100, 100)

        // Variação mensal (simulada baseada na diferença receitas vs gastos)
        const monthlyChange =
          totalIncome > totalExpenses
            ? ((totalIncome - totalExpenses) / totalExpenses) * 100
            : -(((totalExpenses - totalIncome) / totalIncome) * 100)

        console.log("[v0] Métricas calculadas:", {
          savingsRate,
          dailyAverage,
          investmentGoalProgress,
          monthlyChange,
          totalIncome,
          totalExpenses,
          totalInvestments,
        })

        setData({
          savingsRate: Math.max(0, savingsRate),
          dailyAverage,
          investmentGoalProgress: Math.max(0, investmentGoalProgress),
          monthlyChange: isNaN(monthlyChange) ? 0 : monthlyChange,
          totalIncome,
          totalExpenses,
          totalInvestments,
        })
      } catch (error) {
        console.error("[v0] Erro ao buscar métricas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetricsData()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-20 mb-2"></div>
              <div className="h-2 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const metrics = [
    {
      title: "Taxa de Poupança",
      value: `${Math.round(data.savingsRate)}%`,
      description: "Do seu salário",
      progress: Math.round(data.savingsRate),
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Gasto Médio Diário",
      value: formatCurrency(data.dailyAverage),
      description: "Últimos 30 dias",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Meta de Investimento",
      value: `${Math.round(data.investmentGoalProgress)}%`,
      description: `${formatCurrency(data.totalInvestments)} de R$ 3.000`,
      progress: Math.round(data.investmentGoalProgress),
      icon: Target,
      color: "text-primary",
    },
    {
      title: "Variação Mensal",
      value: `${data.monthlyChange >= 0 ? "+" : ""}${data.monthlyChange.toFixed(1)}%`,
      description: "Comparado ao mês anterior",
      icon: TrendingUp,
      color: data.monthlyChange >= 0 ? "text-green-600" : "text-red-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground mb-2">{metric.description}</p>
            {metric.progress !== undefined && <Progress value={metric.progress} className="h-2" />}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
